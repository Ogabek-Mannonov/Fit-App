const Course = require('../models/course.model');
const User = require('../models/user.model');

// @desc    Получение статистики тренера
// @route   GET /api/stats/trainer
// @access  Private (только для тренеров)
const getTrainerStats = async (req, res) => {
  try {
    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Доступно только для тренеров' });
    }

    // Получаем все курсы тренера
    const courses = await Course.find({ trainer: req.user._id });

    // Общая статистика
    const stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(course => course.isPublished).length,
      totalEnrollments: courses.reduce((sum, course) => sum + course.enrollments.length, 0),
      totalRevenue: courses.reduce((sum, course) => {
        return sum + (course.price * course.enrollments.length);
      }, 0),
      averageRating: 0,
      totalReviews: 0,
      totalLikes: courses.reduce((sum, course) => sum + course.likes.length, 0),
      completionRates: {
        inProgress: 0,
        completed: 0,
        dropped: 0
      }
    };

    // Статистика по отзывам и рейтингам
    let totalRating = 0;
    courses.forEach(course => {
      course.reviews.forEach(review => {
        totalRating += review.rating;
        stats.totalReviews++;
      });
    });
    stats.averageRating = stats.totalReviews > 0 ? totalRating / stats.totalReviews : 0;

    // Статистика по завершению курсов
    courses.forEach(course => {
      course.enrollments.forEach(enrollment => {
        stats.completionRates[enrollment.completionStatus]++;
      });
    });

    // Статистика по месяцам
    const monthlyStats = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // Формат YYYY-MM
    }).reverse();

    last6Months.forEach(month => {
      monthlyStats[month] = {
        enrollments: 0,
        revenue: 0,
        reviews: 0
      };
    });

    courses.forEach(course => {
      course.enrollments.forEach(enrollment => {
        const month = new Date(enrollment.enrollmentDate).toISOString().slice(0, 7);
        if (monthlyStats[month]) {
          monthlyStats[month].enrollments++;
          monthlyStats[month].revenue += course.price;
        }
      });

      course.reviews.forEach(review => {
        const month = new Date(review.reviewDate).toISOString().slice(0, 7);
        if (monthlyStats[month]) {
          monthlyStats[month].reviews++;
        }
      });
    });

    // Топ курсов
    const topCourses = courses
      .map(course => ({
        id: course._id,
        title: course.title,
        enrollments: course.enrollments.length,
        revenue: course.price * course.enrollments.length,
        averageRating: course.reviews.length > 0
          ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
          : 0,
        likes: course.likes.length
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5);

    res.json({
      generalStats: stats,
      monthlyStats,
      topCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
};

// @desc    Получение статистики по конкретному курсу
// @route   GET /api/stats/courses/:courseId
// @access  Private (только для создателя курса)
const getCourseStats = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет прав для просмотра статистики' });
    }

    const stats = {
      totalEnrollments: course.enrollments.length,
      revenue: course.price * course.enrollments.length,
      averageRating: course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0,
      totalReviews: course.reviews.length,
      totalLikes: course.likes.length,
      completionRates: {
        inProgress: 0,
        completed: 0,
        dropped: 0
      },
      lessonStats: course.lessons.map(lesson => ({
        id: lesson._id,
        title: lesson.title,
        totalTasks: lesson.tasks.length,
        totalVideos: lesson.tasks.reduce((sum, task) => sum + task.videos.length, 0)
      }))
    };

    // Статистика по завершению
    course.enrollments.forEach(enrollment => {
      stats.completionRates[enrollment.completionStatus]++;
    });

    // Статистика по месяцам
    const monthlyStats = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7);
    }).reverse();

    last6Months.forEach(month => {
      monthlyStats[month] = {
        enrollments: 0,
        reviews: 0
      };
    });

    course.enrollments.forEach(enrollment => {
      const month = new Date(enrollment.enrollmentDate).toISOString().slice(0, 7);
      if (monthlyStats[month]) {
        monthlyStats[month].enrollments++;
      }
    });

    course.reviews.forEach(review => {
      const month = new Date(review.reviewDate).toISOString().slice(0, 7);
      if (monthlyStats[month]) {
        monthlyStats[month].reviews++;
      }
    });

    res.json({
      generalStats: stats,
      monthlyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении статистики курса' });
  }
};

module.exports = {
  getTrainerStats,
  getCourseStats
}; 