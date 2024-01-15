import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any;
}

const authMiddleware = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const token = request.header('Authorization') as string;
    if (!token) {
        return response.status(400).send('Access Denied');
    }
    const tokenWithoutBearer = token.substring(7);
    try {
        const user = jsonwebtoken.verify(tokenWithoutBearer, process.env.TOKEN_SECRET as string);
        if (user) {
            request.user = user;
        }
        next();
    } catch (error) {
        return response.status(400).send('Invalid token');
    }
};

export default authMiddleware;
