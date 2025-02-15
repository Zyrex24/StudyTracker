const express = require('express');
const router = express.Router();
const {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  updateStudyTime,
  getProductivityScore,
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/daily', getDailyStats);
router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);
router.put('/study-time', updateStudyTime);
router.get('/productivity', getProductivityScore);

module.exports = router;
