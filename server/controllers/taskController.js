const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Stats = require('../models/Stats');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id })
    .populate('subject', 'name color')
    .sort({ dueDate: 1 });
  res.status(200).json(tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('subject', 'name color');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(task);
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.subject || !req.body.dueDate) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    subject: req.body.subject,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    tags: req.body.tags,
    user: req.user.id,
  });

  const populatedTask = await Task.findById(task._id).populate('subject', 'name color');
  res.status(201).json(populatedTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('subject', 'name color');

  res.status(200).json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await task.remove();
  res.status(200).json({ id: req.params.id });
});

// @desc    Get tasks by subject
// @route   GET /api/tasks/subject/:subjectId
// @access  Private
const getTasksBySubject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    user: req.user.id,
    subject: req.params.subjectId,
  }).populate('subject', 'name color');

  res.status(200).json(tasks);
});

// @desc    Update task progress
// @route   PUT /api/tasks/:id/progress
// @access  Private
const updateTaskProgress = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Update task progress
  task.timeSpent += req.body.timeSpent || 0;
  
  if (req.body.status === 'completed' && task.status !== 'completed') {
    task.completedAt = new Date();
    task.status = 'completed';

    // Update stats
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

    stats.tasks.completed += 1;
    stats.tasks.bySubject = stats.tasks.bySubject || [];
    
    const subjectStats = stats.tasks.bySubject.find(
      s => s.subject.toString() === task.subject.toString()
    );

    if (subjectStats) {
      subjectStats.completed += 1;
    } else {
      stats.tasks.bySubject.push({
        subject: task.subject,
        completed: 1,
        created: 0,
      });
    }

    await stats.save();
  }

  await task.save();

  const updatedTask = await Task.findById(req.params.id).populate('subject', 'name color');
  res.status(200).json(updatedTask);
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksBySubject,
  updateTaskProgress,
};
