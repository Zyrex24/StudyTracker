const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    color: {
      type: String,
      default: '#3498db', // Default blue color
    },
    goals: {
      weeklyHours: {
        type: Number,
        default: 0,
      },
      totalTasks: {
        type: Number,
        default: 0,
      },
    },
    progress: {
      totalTimeSpent: {
        type: Number,
        default: 0,
      },
      completedTasks: {
        type: Number,
        default: 0,
      },
      lastStudySession: {
        type: Date,
      },
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
subjectSchema.index({ user: 1, priority: -1 });

module.exports = mongoose.model('Subject', subjectSchema);
