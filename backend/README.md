# Fit App Backend

## Структура проекта

```
backend/
├── config/                 # Конфигурационные файлы
│   ├── database.js        # Настройки базы данных
│   └── config.js          # Общие настройки
├── controllers/           # Контроллеры
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── workout.controller.js
│   └── nutrition.controller.js
├── middleware/            # Middleware функции
│   ├── auth.middleware.js
│   └── validation.middleware.js
├── models/               # Модели данных
│   ├── user.model.js
│   ├── workout.model.js
│   └── nutrition.model.js
├── routes/              # Маршруты API
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── workout.routes.js
│   └── nutrition.routes.js
├── utils/              # Вспомогательные функции
│   ├── logger.js
│   └── helpers.js
├── server.js          # Основной файл сервера
└── package.json       # Зависимости проекта
```

## Основные компоненты

1. **Аутентификация и авторизация**
   - Регистрация пользователей
   - Вход в систему
   - Управление токенами

2. **Управление пользователями**
   - Профили пользователей
   - Настройки аккаунта
   - Статистика тренировок

3. **Тренировки**
   - Создание тренировок
   - Отслеживание прогресса
   - Календарь тренировок

4. **Питание**
   - Дневник питания
   - Расчет калорий
   - Рекомендации по питанию

## Установка и запуск

1. Установка зависимостей:
```bash
npm install
```

2. Запуск в режиме разработки:
```bash
npm run dev
```

3. Запуск в продакшн режиме:
```bash
npm start
``` 