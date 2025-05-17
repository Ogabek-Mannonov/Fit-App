const { body, validationResult } = require('express-validator');

// Middleware для проверки результатов валидации
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Валидация регистрации
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Имя пользователя должно быть не менее 3 символов'),
  body('email')
    .isEmail()
    .withMessage('Пожалуйста, введите корректный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов'),
  validate
];

// Валидация входа
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Пожалуйста, введите корректный email'),
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен'),
  validate
];

// Валидация профиля
const profileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Имя должно быть не менее 2 символов'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Фамилия должна быть не менее 2 символов'),
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('Возраст должен быть от 16 до 100 лет'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Некорректный пол'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Рост должен быть от 100 до 250 см'),
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Вес должен быть от 30 до 300 кг'),
  body('goal')
    .optional()
    .isIn(['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness'])
    .withMessage('Некорректная цель'),
  validate
];

// Валидация изменения пароля
const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Текущий пароль обязателен'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Новый пароль должен быть не менее 6 символов'),
  validate
];

// Валидация тренировки
const workoutValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Название тренировки обязательно'),
  body('type')
    .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'other'])
    .withMessage('Некорректный тип тренировки'),
  body('exercises')
    .isArray()
    .withMessage('Упражнения должны быть массивом'),
  body('exercises.*.name')
    .trim()
    .notEmpty()
    .withMessage('Название упражнения обязательно'),
  body('exercises.*.sets')
    .isInt({ min: 1 })
    .withMessage('Количество подходов должно быть положительным числом'),
  body('exercises.*.reps')
    .isInt({ min: 1 })
    .withMessage('Количество повторений должно быть положительным числом'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Длительность должна быть положительным числом'),
  validate
];

// Валидация приема пищи
const mealValidation = [
  body('type')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Некорректный тип приема пищи'),
  body('foods')
    .isArray()
    .withMessage('Продукты должны быть массивом'),
  body('foods.*.name')
    .trim()
    .notEmpty()
    .withMessage('Название продукта обязательно'),
  body('foods.*.calories')
    .isFloat({ min: 0 })
    .withMessage('Калории должны быть положительным числом'),
  body('foods.*.protein')
    .isFloat({ min: 0 })
    .withMessage('Белки должны быть положительным числом'),
  body('foods.*.carbs')
    .isFloat({ min: 0 })
    .withMessage('Углеводы должны быть положительным числом'),
  body('foods.*.fat')
    .isFloat({ min: 0 })
    .withMessage('Жиры должны быть положительным числом'),
  body('foods.*.servingSize')
    .isFloat({ min: 0 })
    .withMessage('Размер порции должен быть положительным числом'),
  body('foods.*.servingUnit')
    .isIn(['g', 'ml', 'pcs'])
    .withMessage('Некорректная единица измерения порции'),
  validate
];

// Валидация курса
const courseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Название курса обязательно')
    .isLength({ min: 3, max: 100 })
    .withMessage('Название курса должно быть от 3 до 100 символов'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Описание курса не должно превышать 2000 символов'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Цена курса должна быть положительным числом'),
  body('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('Некорректный URL изображения'),
  body('lessons')
    .isArray()
    .withMessage('Уроки должны быть массивом'),
  body('lessons.*.title')
    .trim()
    .notEmpty()
    .withMessage('Название урока обязательно')
    .isLength({ min: 3, max: 100 })
    .withMessage('Название урока должно быть от 3 до 100 символов'),
  body('lessons.*.description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Описание урока не должно превышать 1000 символов'),
  body('lessons.*.orderInCourse')
    .isInt({ min: 1 })
    .withMessage('Порядок урока должен быть положительным числом'),
  body('lessons.*.tasks')
    .isArray()
    .withMessage('Задания должны быть массивом'),
  body('lessons.*.tasks.*.title')
    .trim()
    .notEmpty()
    .withMessage('Название задания обязательно')
    .isLength({ min: 3, max: 100 })
    .withMessage('Название задания должно быть от 3 до 100 символов'),
  body('lessons.*.tasks.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Описание задания не должно превышать 500 символов'),
  body('lessons.*.tasks.*.orderInLesson')
    .isInt({ min: 1 })
    .withMessage('Порядок задания должен быть положительным числом'),
  body('lessons.*.tasks.*.videos')
    .isArray()
    .withMessage('Видео должны быть массивом'),
  body('lessons.*.tasks.*.videos.*.title')
    .trim()
    .notEmpty()
    .withMessage('Название видео обязательно')
    .isLength({ min: 3, max: 100 })
    .withMessage('Название видео должно быть от 3 до 100 символов'),
  body('lessons.*.tasks.*.videos.*.contentUrl')
    .isURL()
    .withMessage('Некорректный URL видео'),
  body('lessons.*.tasks.*.videos.*.durationSeconds')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Длительность видео должна быть положительным числом'),
  validate
];

// Валидация отзыва
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка должна быть от 1 до 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Комментарий не должен превышать 1000 символов'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  passwordValidation,
  workoutValidation,
  mealValidation,
  courseValidation,
  reviewValidation
}; 