import mongoose from 'mongoose';

const ModelResultSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  task: {
    type: String,
    enum: ['regression', 'classification', 'full_pipeline'],
    default: 'full_pipeline',
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  datasetSize: {
    type: Number,
  },
  trainedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ModelResult = mongoose.models.ModelResult || mongoose.model('ModelResult', ModelResultSchema);
