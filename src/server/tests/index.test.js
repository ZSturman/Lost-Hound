import request from 'supertest';
import app from '../index.js';

describe('API Server', () => {

    // Test for the root route
    test('GET / should return a successful response', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Successful response');
    });

    // Test for the /api/account route (you can modify it to your actual route logic)
    test('GET /api/account should return 400 since current user not logged in', async () => {
        const res = await request(app).get('/api/account');
        expect(res.statusCode).toBe(400);
    });

    // Test for /api/posts route
    test('GET /api/posts should return 404 if not handled by the route', async () => {
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toBe(404);
    });

    // Test for /api/lostPet route
    test('GET /api/lostPet should return 404 if not handled by the route', async () => {
        const res = await request(app).get('/api/lostPet');
        expect(res.statusCode).toBe(404);
    });

    // Test for /api/account/register route
    test('GET /api/account/register should return 400 since register includes OTP verification', async () => {
        const res = await request(app).get('/api/account/register');
        expect(res.statusCode).toBe(400);
    });
});