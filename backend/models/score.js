import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // automatically set when a document is created
  },
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;
