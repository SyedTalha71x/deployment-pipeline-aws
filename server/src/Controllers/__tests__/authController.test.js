import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterEach, afterAll } from '@jest/globals';
import app from '../../../app.js';
import User from '../../Models/User.js';
import { connect, disconnect, clearDatabase } from '../../../jest.setup.js';

describe('Auth Controller - Register & Login', () => {
  beforeAll(async () => {
    await connect();
    await mongoose.connect(process.env.MONGODB_URL);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.referralApplied).toBe(false);

      // Verify user in DB
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeDefined();
      expect(user.username).toBe('johndoe');
      expect(user.referralCode).toBeDefined();
    });

    it('should fail if user already exists', async () => {
      // Create first user
      await User.create({
        username: 'alice',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 10),
        referralCode: 'ABC123'
      });

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'alice2',
          email: 'alice@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should apply referral if valid referral code provided', async () => {
      // Create referrer user
      const referrer = await User.create({
        username: 'referrer',
        email: 'referrer@example.com',
        password: await bcrypt.hash('password123', 10),
        referralCode: 'REFER123',
        referralCount: 0
      });

      // Register new user with referral code
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
          referralCode: 'REFER123'
        });

      expect(res.status).toBe(201);
      expect(res.body.referralApplied).toBe(true);
      expect(res.body.referrer).toBe('referrer@example.com');

      // Verify referral count increased
      const updatedReferrer = await User.findById(referrer._id);
      expect(updatedReferrer.referralCount).toBe(1);

      // Verify new user has referredBy set
      const newUser = await User.findOne({ email: 'newuser@example.com' });
      expect(newUser.referredBy.toString()).toBe(referrer._id.toString());
    });

    it('should not apply referral if code does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'bob',
          email: 'bob@example.com',
          password: 'password123',
          referralCode: 'INVALID123'
        });

      expect(res.status).toBe(201);
      expect(res.body.referralApplied).toBe(false);
      expect(res.body.referrer).toBeNull();
    });

    it('should prevent self-referral', async () => {
      // Create user first
      const user = await User.create({
        username: 'self',
        email: 'self@example.com',
        password: await bcrypt.hash('password123', 10),
        referralCode: 'SELF123'
      });

      // Try to use own referral code
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'self',
          email: 'self@example.com',
          password: 'password123',
          referralCode: 'SELF123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create user
      const password = 'password123';
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash(password, 10),
        role: 'user',
        isTestFamily: false,
        referralCode: 'TEST123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.role).toBe('user');
    });

    it('should fail if user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should fail if password is incorrect', async () => {
      // Create user
      await User.create({
        username: 'wrongpass',
        email: 'wrongpass@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isTestFamily: false,
        referralCode: 'WRONG123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpass@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return correct user data in response', async () => {
      // Create user
      const password = 'password123';
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash(password, 10),
        role: 'admin',
        isTestFamily: true,
        referralCode: 'ADMIN123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: password
        });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('admin');
      expect(res.body.user.isTestFamily).toBe(true);
      expect(res.body.user.username).toBe('admin');
    });

    it('should return valid JWT token', async () => {
      // Create user
      const password = 'password123';
      const user = await User.create({
        username: 'jwttest',
        email: 'jwt@example.com',
        password: await bcrypt.hash(password, 10),
        role: 'user',
        isTestFamily: false,
        referralCode: 'JWT123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jwt@example.com',
          password: password
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();

      // Token should be a valid JWT
      const parts = res.body.token.split('.');
      expect(parts).toHaveLength(3);
    });
  });
});