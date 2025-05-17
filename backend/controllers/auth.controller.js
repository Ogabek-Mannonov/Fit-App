const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserProfile = require('../models/userProfile.model');
const TrainerProfile = require('../models/trainerProfile.model');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fit-app-secret-key-2024', {
    expiresIn: '30d'
  });
};

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, role, name, lastname, bio, avatar, specialization, text } = req.body;

    // Проверяем, существует ли пользователь
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Создаем нового пользователя
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Создаем профиль
    let profile = null;
    if (user.role === 'trainer') {
      profile = await TrainerProfile.create({
        user_id: user._id,
        name,
        lastname,
        bio,
        avatar,
        specialization,
        text
      });
    } else {
      profile = await UserProfile.create({
        user_id: user._id,
        name,
        lastname,
        bio,
        avatar
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        profile
      });
    } else {
      res.status(400).json({ message: 'Неверные данные пользователя' });
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при регистрации',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Авторизация пользователя
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем наличие пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при входе',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Получение профиля пользователя
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при получении профиля',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
}; 