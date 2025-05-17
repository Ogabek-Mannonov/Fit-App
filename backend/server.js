const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, closeDB } = require('./config/database');

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Импорт роутов
const authRoutes = require('./routes/auth.routes');
const workoutRoutes = require('./routes/workout.routes');
const userRoutes = require('./routes/user.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const courseRoutes = require('./routes/course.routes');
const statsRoutes = require('./routes/stats.routes');

// Базовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в API Fit App' });
});

// Подключение роутов
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/stats', statsRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера
const server = app.listen(port, () => {
  console.log(`Сервер запущен на порту: ${port}`);
});

// Обработка завершения работы
process.on('SIGINT', async () => {
  console.log('Закрытие соединения с базой данных...');
  await closeDB();
  server.close(() => {
    console.log('Сервер остановлен');
    process.exit(0);
  });
});
