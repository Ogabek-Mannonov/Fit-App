const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { courseValidation } = require('../middleware/validation.middleware');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  addReview,
  toggleLike
} = require('../controllers/course.controller');

// Публичные маршруты
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Защищенные маршруты
router.use(protect);

// Маршруты для тренеров
router.post('/', authorize('trainer'), courseValidation, createCourse);
router.put('/:id', authorize('trainer'), courseValidation, updateCourse);
router.delete('/:id', authorize('trainer'), deleteCourse);

// Маршруты для пользователей
router.post('/:id/enroll', authorize('user'), enrollInCourse);
router.post('/:id/reviews', authorize('user'), addReview);
router.post('/:id/like', authorize('user'), toggleLike);

module.exports = router; 