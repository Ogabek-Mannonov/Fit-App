const Course = require('../models/course.model');
const User = require('../models/user.model');

// @desc    Создание нового курса
// @route   POST /api/courses
// @access  Private (только для тренеров)
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Только тренеры могут создавать курсы' });
    }

    const course = await Course.create({
      ...req.body,
      trainer: req.user._id
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании курса' });
  }
};

// @desc    Получение всех курсов
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { 
      trainer, 
      isPublished, 
      minPrice, 
      maxPrice,
      specialization,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    if (trainer) query.trainer = trainer;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (specialization) {
      const trainers = await User.find({ specialization, role: 'trainer' }).select('_id');
      query.trainer = { $in: trainers.map(t => t._id) };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('trainer', 'username firstName lastName profileImage')
      .populate('reviews.user', 'username profileImage');

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении курсов' });
  }
};

// @desc    Получение курса по ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('trainer', 'username firstName lastName profileImage bio specialization experience certificates socialLinks')
      .populate('reviews.user', 'username profileImage')
      .populate('likes.user', 'username');

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении курса' });
  }
};

// @desc    Обновление курса
// @route   PUT /api/courses/:id
// @access  Private (только для создателя курса)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав для обновления курса' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении курса' });
  }
};

// @desc    Удаление курса
// @route   DELETE /api/courses/:id
// @access  Private (только для создателя курса)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав для удаления курса' });
    }

    await course.deleteOne();
    res.json({ message: 'Курс удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении курса' });
  }
};

// @desc    Запись на курс
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Курс еще не опубликован' });
    }

    const isEnrolled = course.enrollments.some(
      enrollment => enrollment.user.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Вы уже записаны на этот курс' });
    }

    course.enrollments.push({
      user: req.user._id,
      enrollmentDate: Date.now()
    });

    await course.save();
    res.json({ message: 'Вы успешно записались на курс' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при записи на курс' });
  }
};

// @desc    Добавление отзыва к курсу
// @route   POST /api/courses/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const hasReviewed = course.reviews.some(
      review => review.user.toString() === req.user._id.toString()
    );

    if (hasReviewed) {
      return res.status(400).json({ message: 'Вы уже оставили отзыв на этот курс' });
    }

    course.reviews.push({
      user: req.user._id,
      rating,
      comment,
      reviewDate: Date.now()
    });

    await course.save();
    res.json({ message: 'Отзыв успешно добавлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при добавлении отзыва' });
  }
};

// @desc    Лайк/анлайк курса
// @route   POST /api/courses/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const likeIndex = course.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      course.likes.splice(likeIndex, 1);
      await course.save();
      return res.json({ message: 'Лайк удален' });
    }

    course.likes.push({
      user: req.user._id,
      likedAt: Date.now()
    });

    await course.save();
    res.json({ message: 'Курс лайкнут' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обработке лайка' });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  addReview,
  toggleLike
}; 