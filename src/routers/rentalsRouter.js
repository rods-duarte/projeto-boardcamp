import { Router } from 'express';

import {
  getRentals,
  addRental,
  endRent,
  deleteRental,
} from '../controllers/rentalsController.js';

// rentals middlewares
import {
  getRentalsQuerySQL,
  validateSchema,
  rentalExists,
  isRentEnded,
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
rentalsRouter.post('/rentals/:id/return', rentalExists, isRentEnded, endRent);
rentalsRouter.delete('/rentals/:id', rentalExists, isRentEnded, deleteRental);

export default rentalsRouter;
