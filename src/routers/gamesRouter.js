import { Router } from 'express';

import { getGames, addGame } from '../controllers/gamesController.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', addGame);

export default gamesRouter;
