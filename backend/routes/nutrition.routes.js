const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { mealValidation } = require('../middleware/validation.middleware');
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionStats
} = require('../controllers/nutrition.controller');

// Все маршруты защищены аутентификацией
router.use(protect);

// Маршруты для питания
router.post('/', authorize('user'), mealValidation, createMeal);
router.get('/', authorize('user'), getMeals);
router.get('/:id', authorize('user'), getMealById);
router.put('/:id', authorize('user'), mealValidation, updateMeal);
router.delete('/:id', authorize('user'), deleteMeal);
router.get('/stats/summary', authorize('user'), getNutritionStats);

module.exports = router; 