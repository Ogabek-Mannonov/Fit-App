const User = require('../models/user.model');

// @desc    Обновление профиля пользователя
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, height, weight, goal } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем только те поля, которые были переданы
    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (age) user.profile.age = age;
    if (gender) user.profile.gender = gender;
    if (height) user.profile.height = height;
    if (weight) user.profile.weight = weight;
    if (goal) user.profile.goal = goal;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profile: updatedUser.profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
};

// @desc    Изменение пароля
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем текущий пароль
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный текущий пароль' });
    }

    // Обновляем пароль
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при изменении пароля' });
  }
};

// @desc    Получение статистики пользователя
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('profile')
      .populate({
        path: 'workouts',
        select: 'type duration date completed',
        options: { sort: { date: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Рассчитываем статистику
    const stats = {
      profile: user.profile,
      recentWorkouts: user.workouts,
      totalWorkouts: user.workouts.length,
      completedWorkouts: user.workouts.filter(w => w.completed).length,
      averageWorkoutDuration: user.workouts.reduce((acc, w) => acc + w.duration, 0) / user.workouts.length || 0
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getUserStats
}; 