import request from 'supertest';
import express from 'express';
import baseRouter from './index';

const app = express();
app.use(baseRouter);

describe('Base Router Tests', () => {
    it('Should respond with "Alive" for GET /', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.text).toBe('Alive');
    });
});
