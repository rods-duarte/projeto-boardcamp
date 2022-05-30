import { Router } from 'express';

import {
  getRentals,
  addRental,
  endRent,
} from '../controllers/rentalsController.js';

// rentals middlewares
import {
  getRentalsQuerySQL,
  validateSchema,
  rentalExists,
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
rentalsRouter.post('/rentals/:id/return', rentalExists, endRent);
rentalsRouter.delete('/rentals');

export default rentalsRouter;
