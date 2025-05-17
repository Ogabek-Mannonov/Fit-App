const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Название урока обязательно']
  },
  description: String,
  orderInCourse: {
    type: Number,
    required: [true, 'Порядок урока в курсе обязателен']
  },
  tasks: [{
    title: {
      type: String,
      required: [true, 'Название задания обязательно']
    },
    description: String,
    orderInLesson: {
      type: Number,
      required: [true, 'Порядок задания в уроке обязателен']
    },
    videos: [{
      title: {
        type: String,
        required: [true, 'Название видео обязательно']
      },
      contentUrl: {
        type: String,
        required: [true, 'URL видео обязателен']
      },
      durationSeconds: Number
    }]
  }]
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Тренер обязателен']
  },
  title: {
    type: String,
    required: [true, 'Название курса обязательно']
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Цена курса обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  coverImageUrl: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  lessons: [lessonSchema],
  enrollments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    completionStatus: {
      type: String,
      enum: ['in_progress', 'completed', 'dropped'],
      default: 'in_progress'
    }
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: [true, 'Оценка обязательна'],
      min: 1,
      max: 5
    },
    comment: String,
    reviewDate: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Индексы для оптимизации запросов
courseSchema.index({ trainer: 1 });
courseSchema.index({ 'enrollments.user': 1 });
courseSchema.index({ 'reviews.user': 1 });
courseSchema.index({ 'likes.user': 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 