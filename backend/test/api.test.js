const axios = require('axios');
const { expect } = require('chai');

const API_URL = 'http://localhost:5000/api';

// Тестовые данные
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

const testTrainer = {
  username: 'testtrainer',
  email: 'trainer@example.com',
  password: 'password123',
  role: 'trainer'
};

let userToken;
let trainerToken;
let courseId;

describe('API Tests', () => {
  // Тесты аутентификации
  describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const res = await axios.post(`${API_URL}/auth/register`, testUser);
      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('token');
      userToken = res.data.token;
    });

    it('should register a new trainer', async () => {
      const res = await axios.post(`${API_URL}/auth/register`, testTrainer);
      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('token');
      trainerToken = res.data.token;
    });

    it('should login user', async () => {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('token');
    });
  });

  // Тесты курсов
  describe('Course Endpoints', () => {
    const testCourse = {
      title: 'Test Course',
      description: 'Test Description',
      price: 99.99,
      lessons: [{
        title: 'Test Lesson',
        description: 'Test Lesson Description',
        orderInCourse: 1,
        tasks: [{
          title: 'Test Task',
          description: 'Test Task Description',
          orderInLesson: 1,
          videos: [{
            title: 'Test Video',
            contentUrl: 'https://example.com/video.mp4',
            durationSeconds: 300
          }]
        }]
      }]
    };

    it('should create a new course (trainer only)', async () => {
      const res = await axios.post(`${API_URL}/courses`, testCourse, {
        headers: { Authorization: `Bearer ${trainerToken}` }
      });
      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('_id');
      courseId = res.data._id;
    });

    it('should get all courses', async () => {
      const res = await axios.get(`${API_URL}/courses`);
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('courses');
    });

    it('should get course by id', async () => {
      const res = await axios.get(`${API_URL}/courses/${courseId}`);
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('_id', courseId);
    });
  });

  // Тесты статистики
  describe('Stats Endpoints', () => {
    it('should get trainer stats', async () => {
      const res = await axios.get(`${API_URL}/stats/trainer`, {
        headers: { Authorization: `Bearer ${trainerToken}` }
      });
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('generalStats');
      expect(res.data).to.have.property('monthlyStats');
      expect(res.data).to.have.property('topCourses');
    });

    it('should get course stats', async () => {
      const res = await axios.get(`${API_URL}/stats/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${trainerToken}` }
      });
      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('generalStats');
      expect(res.data).to.have.property('monthlyStats');
    });
  });

  // Тесты питания
  describe('Nutrition Endpoints', () => {
    const testMeal = {
      type: 'breakfast',
      foods: [{
        name: 'Oatmeal',
        calories: 300,
        protein: 10,
        carbs: 50,
        fat: 5,
        servingSize: 100,
        servingUnit: 'g'
      }]
    };

    it('should create a meal', async () => {
      const res = await axios.post(`${API_URL}/nutrition`, testMeal, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('_id');
    });

    it('should get meals', async () => {
      const res = await axios.get(`${API_URL}/nutrition`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      expect(res.status).to.equal(200);
      expect(Array.isArray(res.data)).to.be.true;
    });
  });

  // Тесты тренировок
  describe('Workout Endpoints', () => {
    const testWorkout = {
      name: 'Test Workout',
      type: 'strength',
      exercises: [{
        name: 'Push-ups',
        sets: 3,
        reps: 12
      }],
      duration: 30
    };

    it('should create a workout', async () => {
      const res = await axios.post(`${API_URL}/workouts`, testWorkout, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('_id');
    });

    it('should get workouts', async () => {
      const res = await axios.get(`${API_URL}/workouts`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      expect(res.status).to.equal(200);
      expect(Array.isArray(res.data)).to.be.true;
    });
  });
}); 