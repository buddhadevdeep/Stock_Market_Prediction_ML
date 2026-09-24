import mongoose from 'mongoose';

const StockSearchSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

export const StockSearch = mongoose.models.StockSearch || mongoose.model('StockSearch', StockSearchSchema);
