import Portfolio from '../models/Portfolio.js';
import { getDBStatus } from '../config/db.js';

// In-memory fallback map of user portfolios: userEmail -> Array of holdings
const memoryPortfolios = new Map();

// @route   GET /api/portfolio
// @desc    Get all stock holdings for the authenticated user
export const getUserPortfolio = async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (getDBStatus()) {
      try {
        const holdings = await Portfolio.find({ userEmail }).sort({ createdAt: -1 });
        return res.json({ success: true, holdings, count: holdings.length });
      } catch (dbErr) {
        console.warn('MongoDB portfolio fallback to memory store:', dbErr.message);
      }
    }

    // In-memory store fallback for this specific user
    if (!memoryPortfolios.has(userEmail)) {
      memoryPortfolios.set(userEmail, []);
    }

    const holdings = memoryPortfolios.get(userEmail) || [];
    return res.json({ success: true, holdings, count: holdings.length });
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch portfolio' });
  }
};

// @route   POST /api/portfolio
// @desc    Add or update a stock holding in the user's portfolio
export const addStockToPortfolio = async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const { symbol, name, shares, avgPrice, buyDate, notes } = req.body;

    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!symbol || !shares || !avgPrice) {
      return res.status(400).json({ success: false, message: 'Symbol, shares, and average price are required' });
    }

    const cleanSymbol = symbol.toUpperCase().trim();
    const numShares = Math.max(1, parseInt(shares, 10));
    const numPrice = Math.max(0.01, parseFloat(avgPrice));
    const parsedDate = buyDate ? new Date(buyDate) : new Date();

    if (getDBStatus()) {
      try {
        // Check if user already holds this symbol
        let existing = await Portfolio.findOne({ userEmail, symbol: cleanSymbol });

        if (existing) {
          // Weighted average price update
          const totalExistingValue = existing.shares * existing.avgPrice;
          const newAddedValue = numShares * numPrice;
          const totalShares = existing.shares + numShares;
          const newAvgPrice = +( (totalExistingValue + newAddedValue) / totalShares ).toFixed(2);

          existing.shares = totalShares;
          existing.avgPrice = newAvgPrice;
          if (name) existing.name = name;
          if (notes) existing.notes = notes;
          await existing.save();

          const allHoldings = await Portfolio.find({ userEmail }).sort({ createdAt: -1 });
          return res.status(200).json({ success: true, message: `Updated ${cleanSymbol} holdings`, holdings: allHoldings });
        } else {
          await Portfolio.create({
            userId: userEmail,
            userEmail,
            symbol: cleanSymbol,
            name: name || `${cleanSymbol} Equity`,
            shares: numShares,
            avgPrice: numPrice,
            buyDate: parsedDate,
            notes: notes || '',
          });

          const allHoldings = await Portfolio.find({ userEmail }).sort({ createdAt: -1 });
          return res.status(201).json({ success: true, message: `Added ${cleanSymbol} to portfolio`, holdings: allHoldings });
        }
      } catch (dbErr) {
        console.warn('MongoDB add portfolio fallback:', dbErr.message);
      }
    }

    // In-memory fallback for this specific user
    if (!memoryPortfolios.has(userEmail)) {
      memoryPortfolios.set(userEmail, []);
    }

    const currentHoldings = memoryPortfolios.get(userEmail) || [];
    const existingIndex = currentHoldings.findIndex(h => h.symbol === cleanSymbol);

    if (existingIndex >= 0) {
      const existing = currentHoldings[existingIndex];
      const totalExistingValue = existing.shares * existing.avgPrice;
      const newAddedValue = numShares * numPrice;
      const totalShares = existing.shares + numShares;
      const newAvgPrice = +( (totalExistingValue + newAddedValue) / totalShares ).toFixed(2);

      currentHoldings[existingIndex] = {
        ...existing,
        shares: totalShares,
        avgPrice: newAvgPrice,
        name: name || existing.name,
        notes: notes || existing.notes,
      };
    } else {
      currentHoldings.unshift({
        _id: `port_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: userEmail,
        userEmail,
        symbol: cleanSymbol,
        name: name || `${cleanSymbol} Equity`,
        shares: numShares,
        avgPrice: numPrice,
        buyDate: parsedDate,
        notes: notes || '',
      });
    }

    memoryPortfolios.set(userEmail, currentHoldings);

    return res.status(201).json({
      success: true,
      message: `Successfully added ${cleanSymbol} to portfolio`,
      holdings: currentHoldings,
    });
  } catch (err) {
    console.error('Error adding stock to portfolio:', err);
    return res.status(500).json({ success: false, message: 'Failed to add stock' });
  }
};

// @route   DELETE /api/portfolio/:id
// @desc    Delete a stock holding from the user's portfolio
export const deleteStockFromPortfolio = async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const { id } = req.params;

    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (getDBStatus()) {
      try {
        await Portfolio.findOneAndDelete({
          $or: [{ _id: id }, { symbol: id.toUpperCase() }],
          userEmail,
        });
        const allHoldings = await Portfolio.find({ userEmail }).sort({ createdAt: -1 });
        return res.json({ success: true, message: 'Stock removed from portfolio', holdings: allHoldings });
      } catch (dbErr) {
        console.warn('MongoDB delete portfolio fallback:', dbErr.message);
      }
    }

    // In-memory fallback
    if (memoryPortfolios.has(userEmail)) {
      const list = memoryPortfolios.get(userEmail);
      const updated = list.filter(h => h._id !== id && h.symbol !== id.toUpperCase());
      memoryPortfolios.set(userEmail, updated);
      return res.json({ success: true, message: 'Stock removed from portfolio', holdings: updated });
    }

    return res.json({ success: true, message: 'Stock removed', holdings: [] });
  } catch (err) {
    console.error('Error deleting stock:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove stock' });
  }
};
