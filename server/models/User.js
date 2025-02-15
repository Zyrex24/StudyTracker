import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true
  },
  streak: {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastUpdated: Date
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }],
  preferences: {
    focusMode: { type: Boolean, default: false },
    timerDuration: { type: Number, default: 25 }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
