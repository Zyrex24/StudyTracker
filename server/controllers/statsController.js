const asyncHandler = require('express-async-handler');
const Stats = require('../models/Stats');
const Task = require('../models/Task');

// @desc    Get daily stats
// @route   GET /api/stats/daily
// @access  Private
const getDailyStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let stats = await Stats.findOne({
    user: req.user.id,
    date: today,
  }).populate('studyTime.bySubject.subject', 'name color');

  if (!stats) {
    stats = await Stats.create({
      user: req.user.id,
      date: today,
    });
  }

  res.status(200).json(stats);
});

// @desc    Get weekly stats
// @route   GET /api/stats/weekly
// @access  Private
const getWeeklyStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const stats = await Stats.find({
    user: req.user.id,
    date: { $gte: lastWeek },
  }).populate('studyTime.bySubject.subject', 'name color');

  res.status(200).json(stats);
});

// @desc    Get monthly stats
// @route   GET /api/stats/monthly
// @access  Private
const getMonthlyStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = await Stats.find({
    user: req.user.id,
    date: { $gte: lastMonth },
  }).populate('studyTime.bySubject.subject', 'name color');

  res.status(200).json(stats);
});

// @desc    Update study time
// @route   PUT /api/stats/study-time
// @access  Private
const updateStudyTime = asyncHandler(async (req, res) => {
  const { subjectId, timeSpent } = req.body;

  if (!subjectId || !timeSpent) {
    res.status(400);
    throw new Error('Please provide subject and time spent');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let stats = await Stats.findOne({
    user: req.user.id,
    date: today,
  });

  if (!stats) {
    stats = await Stats.create({
      user: req.user.id,
      date: today,
    });
  }

  // Update total study time
  stats.studyTime.total += timeSpent;

  // Update subject-specific study time
  const subjectStats = stats.studyTime.bySubject.find(
    s => s.subject.toString() === subjectId
  );

  if (subjectStats) {
    subjectStats.time += timeSpent;
  } else {
    stats.studyTime.bySubject.push({
      subject: subjectId,
      time: timeSpent,
    });
  }

  // Update streak
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const hadStudyYesterday = await Stats.findOne({
    user: req.user.id,
    date: yesterday,
    'studyTime.total': { $gt: 0 },
  });

  if (hadStudyYesterday) {
    stats.streak.current += 1;
    stats.streak.best = Math.max(stats.streak.current, stats.streak.best);
  } else {
    stats.streak.current = 1;
  }

  // Calculate productivity score
  await calculateProductivityScore(stats);

  await stats.save();
  res.status(200).json(stats);
});

// @desc    Get productivity score
// @route   GET /api/stats/productivity
// @access  Private
const getProductivityScore = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await Stats.findOne({
    user: req.user.id,
    date: today,
  });

  if (!stats) {
    res.status(200).json({
      score: 0,
      factors: {
        taskCompletion: 0,
        studyConsistency: 0,
        focusTime: 0,
      },
    });
    return;
  }

  res.status(200).json({
    score: stats.productivity.score,
    factors: stats.productivity.factors,
  });
});

// Helper function to calculate productivity score
const calculateProductivityScore = async (stats) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate task completion rate
  const totalTasks = await Task.countDocuments({
    user: stats.user,
    dueDate: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  const completedTasks = stats.tasks.completed;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 100;

  // Calculate study consistency
  const studyConsistency = Math.min((stats.studyTime.total / (4 * 60 * 60)) * 100, 100);

  // Calculate focus time score
  const focusTimeScore = Math.min((stats.studyTime.total / (2 * 60 * 60)) * 100, 100);

  // Update productivity factors
  stats.productivity.factors = {
    taskCompletion: taskCompletionRate,
    studyConsistency: studyConsistency,
    focusTime: focusTimeScore,
  };

  // Calculate overall productivity score
  stats.productivity.score = Math.round(
    (taskCompletionRate + studyConsistency + focusTimeScore) / 3
  );
};

module.exports = {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  updateStudyTime,
  getProductivityScore,
};
