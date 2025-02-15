const mongoose = require('mongoose');

const statsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    studyTime: {
      total: { type: Number, default: 0 },
      bySubject: [{
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        time: { type: Number, default: 0 },
      }],
    },
    tasks: {
      completed: { type: Number, default: 0 },
      created: { type: Number, default: 0 },
      bySubject: [{
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        completed: { type: Number, default: 0 },
        created: { type: Number, default: 0 },
      }],
    },
    streak: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 },
    },
    productivity: {
      score: { type: Number, default: 0 }, // 0-100
      factors: {
        taskCompletion: { type: Number, default: 0 },
        studyConsistency: { type: Number, default: 0 },
        focusTime: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
statsSchema.index({ user: 1, date: -1 });
statsSchema.index({ 'studyTime.bySubject.subject': 1 });

module.exports = mongoose.model('Stats', statsSchema);
