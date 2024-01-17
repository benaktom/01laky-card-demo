import { Router, Request, Response } from 'express';
import authMiddleware from '../../Middleware/authMiddleware';
import Proxy from '../../Services/Proxy';
import { IValidityResponse, IStateResponse, ISecuredCardResponse } from './interfaces';
import { formatValidityDate } from '../../Helpers';
import { cardNumberSchema } from './validation';

const cardRouter = Router();
const proxy = new Proxy();

/**
 * @swagger
 * /card-secured:
 *   get:
 *     summary: Get secured card information
 *     tags:
 *       - Card
 *     parameters:
 *       - in: query
 *         name: cardNumber
 *         description: Credit card number
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               cardValidityEnd: '2024-12-31'
 *               state: 'Active'
 *       '400':
 *         description: Bad request
 *         content:
 *           text/plain:
 *             example: 'Invalid credit card number: Validation error message'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           text/plain:
 *             example: 'Unauthorized'
 *       '500':
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             example: 'Something wrong!'
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
cardRouter.get('/card-secured', authMiddleware, async (request: Request, response: Response) => {
    // [CR] proč /card-secured?
    // [CR] ze zadání měl být cardNumber url parametr?
    const cardNumber = request.query.cardNumber as string;
    // [CR] opravdu to musí být kreditní karta?
    const { error } = cardNumberSchema.validate(cardNumber);
    if (error) {
        return response.status(400).send(`Invalid credit card number: ${error.message}`);
    }
    try {
        const validityResponse = await proxy.get<IValidityResponse>(`validity`, cardNumber);
        const stateResponse = await proxy.get<IStateResponse>(`state`, cardNumber);
        const cardValidityEnd = formatValidityDate(validityResponse.validity_end);
        const securedCardResponse: ISecuredCardResponse = {
            cardValidityEnd, ... stateResponse,
        }

        // [CR] návratová hodnota neodpovídá dokumentaci, vrátilo mi to:
        /*
            {
                "cardValidityEnd": "12.08.2020",
                "state_id": 100,
                "state_description": "Aktivní v držení klienta"
            }
        */

        return response.status(200).send(securedCardResponse);
    } catch (error) {
        // [CR] asi by to chtělo nějaký log
        return response.status(500).send('Something wrong!');
    }
    // [CR] škoda, že zrovna k tomuto chybí testy
});

export default cardRouter;
