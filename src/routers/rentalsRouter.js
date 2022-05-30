import { Router } from 'express';

import { getRentals, addRental } from '../controllers/rentalsController.js';

// rentals middlewares
import {
  getRentalsQuerySQL,
  validateSchema,
} from '../middlewares/rentalsMiddleware.js';

// customers middlewares
import { customerExists } from '../middlewares/customersMiddleware.js';

// games middlewares
import { gameExists, checkGameStock } from '../middlewares/gamesMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentalsQuerySQL, getRentals);
rentalsRouter.post(
  '/rentals',
  validateSchema,
  gameExists,
  customerExists,
  checkGameStock,
  addRental
);
rentalsRouter.put('/rentals');
rentalsRouter.delete('/rentals');

export default rentalsRouter;
