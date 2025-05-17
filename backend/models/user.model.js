const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя обязательно'],
    unique: true,
    trim: true,
    minlength: [3, 'Имя пользователя должно быть не менее 3 символов']
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Пожалуйста, введите корректный email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен быть не менее 6 символов']
  },
  role: {
    type: String,
    enum: ['user', 'trainer'],
    default: 'user'
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: [16, 'Возраст должен быть не менее 16 лет'],
    max: [100, 'Возраст должен быть не более 100 лет']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,
    min: [100, 'Рост должен быть не менее 100 см'],
    max: [250, 'Рост должен быть не более 250 см']
  },
  weight: {
    type: Number,
    min: [30, 'Вес должен быть не менее 30 кг'],
    max: [300, 'Вес должен быть не более 300 кг']
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness']
  },
  profileImage: String,
  bio: String,
  specialization: [String], // Для тренеров
  experience: Number, // Для тренеров, в годах
  certificates: [{ // Для тренеров
    name: String,
    issuer: String,
    date: Date,
    imageUrl: String
  }],
  socialLinks: {
    instagram: String,
    facebook: String,
    youtube: String,
    website: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для проверки пароля
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Виртуальное поле для полного имени
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Индексы для оптимизации запросов
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 