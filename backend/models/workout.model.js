const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название упражнения обязательно']
  },
  sets: {
    type: Number,
    required: [true, 'Количество подходов обязательно']
  },
  reps: {
    type: Number,
    required: [true, 'Количество повторений обязательно']
  },
  weight: {
    type: Number,
    default: 0 // в килограммах
  },
  duration: {
    type: Number,
    default: 0 // в секундах
  },
  notes: String
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Название тренировки обязательно']
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'other'],
    required: true
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number,
    required: true // в минутах
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: String,
  completed: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout; 