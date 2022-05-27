import { Router } from 'express';

import { getGames, addGame } from '../controllers/gamesController.js';

import {
  validateSchema,
  validateUniqueName,
} from '../middlewares/gamesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateSchema, validateUniqueName, addGame); // TODO validar o id da categoria

export default gamesRouter;
