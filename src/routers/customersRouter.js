import { Router } from 'express';

import {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
} from '../controllers/customersController.js';

import {
  validateSchema,
  validateUniqueCpf,
  customerExists,
} from '../middlewares/customersMiddleware.js';

const customersRouter = Router();

console.log(new Date('199-10-05'));

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerById);
customersRouter.post(
  '/customers',
  validateSchema,
  validateUniqueCpf,
  addCustomer
);
customersRouter.put(
  '/customers/:id',
  validateSchema,
  customerExists,
  updateCustomer
);

export default customersRouter;
