import dayjs from 'dayjs';

import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

import RentalSchema from '../models/rentalSchema.js';

export async function getRentalsQuerySQL(req, res, next) {
  const { gameId, customerId } = req.query;

  let query;
  let queryParams;

  if (gameId) {
    query = `--sql
      SELECT 
      RENTALS.*,
      GAMES.NAME AS "gameName",
      GAMES."categoryId",
      CATEGORIES.NAME AS "categoryName",
      CUSTOMERS.NAME
      FROM RENTALS
      JOIN GAMES ON RENTALS."gameId" = GAMES.ID 
      JOIN CATEGORIES ON GAMES."categoryId" = CATEGORIES.ID
      JOIN CUSTOMERS ON RENTALS."customerId" = CUSTOMERS.ID
      WHERE (RENTALS."gameId" = $1)
    `;
    queryParams = [gameId];
  } else if (customerId) {
    query = `--sql
      SELECT 
      RENTALS.*,
      GAMES.NAME AS "gameName",
      GAMES."categoryId",
      CATEGORIES.NAME AS "categoryName",
      CUSTOMERS.NAME
      FROM RENTALS
      JOIN GAMES ON RENTALS."gameId" = GAMES.ID 
      JOIN CATEGORIES ON GAMES."categoryId" = CATEGORIES.ID
      JOIN CUSTOMERS ON RENTALS."customerId" = CUSTOMERS.ID
      WHERE (RENTALS."customerId" = $1)
  `;
    queryParams = [customerId];
  } else {
    query = `--sql
      SELECT 
      RENTALS.*,
      GAMES.NAME AS "gameName",
      GAMES."categoryId",
      CATEGORIES.NAME AS "categoryName",
      CUSTOMERS.NAME
      FROM RENTALS
      JOIN GAMES ON RENTALS."gameId" = GAMES.ID 
      JOIN CATEGORIES ON GAMES."categoryId" = CATEGORIES.ID
      JOIN CUSTOMERS ON RENTALS."customerId" = CUSTOMERS.ID
    `;
  }

  res.locals.query = query;
  res.locals.queryParams = queryParams;

  next();
}

export async function validateSchema(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const rental = {
    customerId,
    gameId,
    daysRented,
    rentDate: dayjs().format('YYYY-MM-DD'),
    returnDate: null,
    delayFee: null,
  };

  const validate = RentalSchema.validate(rental);

  if (validate.error) {
    res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }

  res.locals.rental = rental;
  next();
}

export async function rentalExists(req, res, next) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `--sql
        SELECT *
        FROM rentals
        WHERE id = $1`,
      [id]
    );

    if (!result.rows.length) {
      res.status(404).send({
        message: 'Rental not found',
      });
      return;
    }

    [res.locals.rental] = result.rows;
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }

  next();
}
