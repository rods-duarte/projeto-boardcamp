import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';

import gamesRouter from './routers/gamesRouter.js';
import categoriesRouter from './routers/categoriesRouter.js';
import customersRouter from './routers/customersRouter.js';

dotenv.config('./src/config/config.env');

const app = express();

// middlewares
app.use(cors());
app.use(json());

// routes
app.use(gamesRouter);
app.use(categoriesRouter);
app.use(customersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.green.bold('Servidor aberto na porta', PORT));
});
