const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { workoutValidation } = require('../middleware/validation.middleware');
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} = require('../controllers/workout.controller');

// Все маршруты защищены аутентификацией
router.use(protect);

// Маршруты для тренировок
router.post('/', authorize('user'), workoutValidation, createWorkout);
router.get('/', authorize('user'), getWorkouts);
router.get('/:id', authorize('user'), getWorkoutById);
router.put('/:id', authorize('user'), workoutValidation, updateWorkout);
router.delete('/:id', authorize('user'), deleteWorkout);

module.exports = router; 