import { Router } from 'express';

import { getGames, addGame } from '../controllers/gamesController.js';

import { categoryExists } from '../middlewares/categoriesMiddleware.js';

import {
  validateSchema,
  validateUniqueName,
} from '../middlewares/gamesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post(
  '/games',
  validateSchema,
  validateUniqueName,
  categoryExists,
  addGame
);

export default gamesRouter;
