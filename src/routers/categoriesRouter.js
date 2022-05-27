import { Router } from 'express';

import {
  getCategories,
  addCategory,
} from '../controllers/categoriesController.js';

import {
  validateSchema,
  validateUniqueName,
} from '../middlewares/categoriesMiddleware.js';

const CategoriesRouter = Router();

CategoriesRouter.get('/categories', getCategories);
CategoriesRouter.post(
  '/categories',
  validateSchema,
  validateUniqueName,
  addCategory
);

export default CategoriesRouter;
