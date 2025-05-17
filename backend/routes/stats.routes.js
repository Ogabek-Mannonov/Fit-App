const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getTrainerStats,
  getCourseStats
} = require('../controllers/stats.controller');

// Все маршруты защищены аутентификацией
router.use(protect);

// Маршруты для статистики
router.get('/trainer', authorize('trainer'), getTrainerStats);
router.get('/courses/:courseId', authorize('trainer'), getCourseStats);

module.exports = router; 