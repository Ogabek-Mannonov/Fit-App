const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название продукта обязательно']
  },
  calories: {
    type: Number,
    required: [true, 'Калории обязательны']
  },
  protein: {
    type: Number,
    default: 0 // в граммах
  },
  carbs: {
    type: Number,
    default: 0 // в граммах
  },
  fat: {
    type: Number,
    default: 0 // в граммах
  },
  servingSize: {
    type: Number,
    required: [true, 'Размер порции обязателен']
  },
  servingUnit: {
    type: String,
    required: [true, 'Единица измерения порции обязательна'],
    enum: ['g', 'ml', 'pcs']
  }
});

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Тип приема пищи обязателен'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  date: {
    type: Date,
    default: Date.now
  },
  foods: [foodItemSchema],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Middleware для подсчета общих значений
mealSchema.pre('save', function(next) {
  this.totalCalories = this.foods.reduce((sum, food) => sum + food.calories, 0);
  this.totalProtein = this.foods.reduce((sum, food) => sum + food.protein, 0);
  this.totalCarbs = this.foods.reduce((sum, food) => sum + food.carbs, 0);
  this.totalFat = this.foods.reduce((sum, food) => sum + food.fat, 0);
  next();
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal; 