const asyncHandler = require('express-async-handler');
const Subject = require('../models/Subject');
const Task = require('../models/Task');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ user: req.user.id })
    .sort({ priority: -1, name: 1 });
  res.status(200).json(subjects);
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  // Check for user
  if (subject.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(subject);
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private
const createSubject = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error('Please add a name');
  }

  const subject = await Subject.create({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    goals: req.body.goals,
    priority: req.body.priority,
    user: req.user.id,
  });

  res.status(201).json(subject);
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  // Check for user
  if (subject.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedSubject);
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  // Check for user
  if (subject.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Delete associated tasks
  await Task.deleteMany({ subject: req.params.id });
  
  await subject.remove();
  res.status(200).json({ id: req.params.id });
});

// @desc    Update subject progress
// @route   PUT /api/subjects/:id/progress
// @access  Private
const updateSubjectProgress = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  // Check for user
  if (subject.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Update progress
  subject.progress.totalTimeSpent += req.body.timeSpent || 0;
  subject.progress.completedTasks += req.body.completedTasks || 0;
  subject.progress.lastStudySession = new Date();

  await subject.save();
  res.status(200).json(subject);
});

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  updateSubjectProgress,
};
