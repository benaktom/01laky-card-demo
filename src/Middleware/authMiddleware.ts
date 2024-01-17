import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: string | jsonwebtoken.JwtPayload;
}

const authMiddleware = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const token = request.header('Authorization') as string;
    if (!token) {
        // [CR] 400?
        return response.status(400).send('Access Denied');
    }
    // [CR] co když token nezačíná na Bearer?
    const tokenWithoutBearer = token.substring(7);
    try {
        const user = jsonwebtoken.verify(tokenWithoutBearer, process.env.TOKEN_SECRET as string);
        if (user) {
            // [CR] je to pro účel této aplikace nutné?
            request.user = user;
        }
        next();
    } catch (error) {
        // [CR] 400?
        return response.status(400).send('Invalid token');
    }
};

export default authMiddleware;
