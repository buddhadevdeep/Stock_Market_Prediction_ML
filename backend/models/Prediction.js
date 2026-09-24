import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  predictedHigh: {
    type: Number,
    required: true,
  },
  predictedLow: {
    type: Number,
    required: true,
  },
  predictedRange: {
    type: Number,
    required: true,
  },
  direction: {
    type: String,
    enum: ['BULLISH', 'BEARISH'],
    required: true,
  },
  directionConfidence: {
    type: Number,
    default: 50.0,
  },
  signal: {
    type: String,
    enum: ['BUY', 'HOLD', 'SELL'],
    required: true,
  },
  signalConfidence: {
    type: Number,
    default: 50.0,
  },
  baseline: {
    predictedHigh: Number,
    predictedLow: Number,
    predictedRange: Number,
    direction: String,
    directionConfidence: Number,
    signal: String,
    signalConfidence: Number,
  },
  modelVersion: {
    type: String,
    default: '1.0.0 (RF+CustomTree)',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Prediction = mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
