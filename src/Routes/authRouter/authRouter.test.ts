import request from 'supertest';
import express from 'express';
import authRouter from './index';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Router Tests', () => {
    it('Should respond with a 401 status for an invalid user', async () => {
        const invalidUser = {
            email: 'nonexistent@email.com',
            password: 'invalid_password',
        };

        const response = await request(app)
            .post('/auth/login')
            .send(invalidUser)
            .expect(401);

        expect(response.text).toBe('Email not found');
    });
});
