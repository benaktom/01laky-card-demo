import { Router, Request, Response } from 'express';

const baseRouter = Router();

baseRouter.get('/', (_: Request, response: Response) => {
    return response.status(200).send('Alive')
});

export default baseRouter;

