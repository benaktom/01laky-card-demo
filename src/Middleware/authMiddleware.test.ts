import request from 'supertest';
import express, { Express, Request, Response } from 'express';
import authMiddleware from './authMiddleware';

const validToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZW1haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyNC0wMS0xNVQyMTo0ODoxNy4wOTNaIiwiaWF0IjoxNzA1MzU1Mjk3fQ.OXKborV5A70Lhcg16wKot-CSNOFCg7jQsCnbCT4yFCc`;
const invalidToken = 'aaaaaaa';

describe('Authentication Middleware Tests', () => {
    let app: Express;

    beforeEach(() => {
        app = express();
        app.use(authMiddleware);
        app.get('/protected', (_: Request, res: Response) => res.status(200).json({ success: true }));
    });

    it('Should allow access with a valid token', async () => {


        await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${validToken}`)
            .expect(200, { success: true });
    });

    it('should deny access without a token', async () => {
        await request(app)
            .get('/protected')
            .expect(400, 'Access Denied');
    });

    it('should deny access with an invalid token', async () => {
        await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(400, 'Invalid token');
    });
});
