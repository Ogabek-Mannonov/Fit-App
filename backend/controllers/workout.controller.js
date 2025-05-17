const Workout = require('../models/workout.model');

// @desc    Создание новой тренировки
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const { name, type, exercises, duration, notes } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      name,
      type,
      exercises,
      duration,
      notes
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании тренировки' });
  }
};

// @desc    Получение всех тренировок пользователя
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении тренировок' });
  }
};

// @desc    Получение тренировки по ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении тренировки' });
  }
};

// @desc    Обновление тренировки
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const { name, type, exercises, duration, notes, completed, rating } = req.body;

    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }

    workout.name = name || workout.name;
    workout.type = type || workout.type;
    workout.exercises = exercises || workout.exercises;
    workout.duration = duration || workout.duration;
    workout.notes = notes || workout.notes;
    workout.completed = completed !== undefined ? completed : workout.completed;
    workout.rating = rating || workout.rating;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении тренировки' });
  }
};

// @desc    Удаление тренировки
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Тренировка не найдена' });
    }

    await workout.deleteOne();
    res.json({ message: 'Тренировка удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении тренировки' });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
}; 