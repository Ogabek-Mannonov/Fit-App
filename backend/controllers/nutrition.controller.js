const Meal = require('../models/nutrition.model');

// @desc    Создание нового приема пищи
// @route   POST /api/nutrition/meals
// @access  Private
const createMeal = async (req, res) => {
  try {
    const { type, foods, notes } = req.body;

    const meal = await Meal.create({
      user: req.user._id,
      type,
      foods,
      notes
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании приема пищи' });
  }
};

// @desc    Получение всех приемов пищи пользователя
// @route   GET /api/nutrition/meals
// @access  Private
const getMeals = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const query = { user: req.user._id };

    // Фильтрация по дате
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Фильтрация по типу приема пищи
    if (type) {
      query.type = type;
    }

    const meals = await Meal.find(query)
      .sort({ date: -1 });

    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении приемов пищи' });
  }
};

// @desc    Получение приема пищи по ID
// @route   GET /api/nutrition/meals/:id
// @access  Private
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ message: 'Прием пищи не найден' });
    }

    res.json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении приема пищи' });
  }
};

// @desc    Обновление приема пищи
// @route   PUT /api/nutrition/meals/:id
// @access  Private
const updateMeal = async (req, res) => {
  try {
    const { type, foods, notes } = req.body;

    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ message: 'Прием пищи не найден' });
    }

    meal.type = type || meal.type;
    meal.foods = foods || meal.foods;
    meal.notes = notes || meal.notes;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении приема пищи' });
  }
};

// @desc    Удаление приема пищи
// @route   DELETE /api/nutrition/meals/:id
// @access  Private
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ message: 'Прием пищи не найден' });
    }

    await meal.deleteOne();
    res.json({ message: 'Прием пищи удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении приема пищи' });
  }
};

// @desc    Получение статистики питания
// @route   GET /api/nutrition/stats
// @access  Private
const getNutritionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const meals = await Meal.find(query);

    // Рассчитываем статистику
    const stats = {
      totalMeals: meals.length,
      totalCalories: meals.reduce((sum, meal) => sum + meal.totalCalories, 0),
      totalProtein: meals.reduce((sum, meal) => sum + meal.totalProtein, 0),
      totalCarbs: meals.reduce((sum, meal) => sum + meal.totalCarbs, 0),
      totalFat: meals.reduce((sum, meal) => sum + meal.totalFat, 0),
      mealsByType: {
        breakfast: meals.filter(m => m.type === 'breakfast').length,
        lunch: meals.filter(m => m.type === 'lunch').length,
        dinner: meals.filter(m => m.type === 'dinner').length,
        snack: meals.filter(m => m.type === 'snack').length
      }
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении статистики питания' });
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
  getNutritionStats
}; 