import { Router, Request, Response } from 'express';

const baseRouter = Router();

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Card demo
 *   version: 1.0.0
 * paths:
 *   /:
 *     get:
 *       summary: Check if the server is alive
 *       tags:
 *         - Base
 *       responses:
 *         '200':
 *           description: Server is alive
 *           content:
 *             text/plain:
 *               example: 'Alive *'
 */
baseRouter.get('/', (_: Request, response: Response) => {
    return response.status(200).send('Alive')
});

export default baseRouter;

