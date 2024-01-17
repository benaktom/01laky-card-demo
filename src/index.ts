import express, { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import authRouter from './Routes/authRouter';
import baseRouter from './Routes/baseRouter';
import cardRouter from './Routes/cardRouter';

import { initializeAuthUser } from './Services/DemoUser';
import { specs } from './Services/Swagger';

dotenv.config();

const Server = express();
const PORT = parseInt(process.env.PORT as string);

// [CR] je nutné používat urlencoded?
Server.use(urlencoded({ extended: false }));
Server.use(json());
// [CR] je nutné používat cookie-parser?
Server.use(cookieParser());
Server.use(cors({ origin: '*' }));
// [CR] hodil by se tu nějaký request logger

Server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
Server.use('/auth', authRouter);
Server.use(baseRouter);
Server.use(cardRouter);

initializeAuthUser();

Server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`); 
});
