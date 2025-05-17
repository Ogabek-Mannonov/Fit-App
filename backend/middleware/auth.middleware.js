const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовках
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fit-app-secret-key-2024');

      // Получаем пользователя из базы данных
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      res.status(401).json({ 
        message: 'Не авторизован, токен недействителен',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }
};

// Middleware для проверки роли
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Роль ${req.user.role} не имеет доступа к этому ресурсу`
      });
    }
    next();
  };
};

module.exports = { protect, authorize }; 