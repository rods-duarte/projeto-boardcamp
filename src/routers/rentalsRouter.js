import { Router } from 'express';

import { getRentals, addRental } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', addRental);
rentalsRouter.put('/rentals');
rentalsRouter.delete('/rentals');

export default rentalsRouter;
