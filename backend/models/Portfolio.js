import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userEmail: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    default: '',
  },
  shares: {
    type: Number,
    required: true,
    min: 1,
  },
  avgPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  buyDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
