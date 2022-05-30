import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

import GameSchema from '../models/gameSchema.js';

export async function validateSchema(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validate = GameSchema.validate({
    name,
    image,
    stockTotal,
    categoryId,
    pricePerDay,
  });

  if (validate.error) {
    console.log(
      `${ERROR} ${validate.error.details.map((e) => e.message).join(', ')}`
    );
    res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }

  next();
}

export async function validateUniqueName(req, res, next) {
  const { name } = req.body;

  try {
    const result = await db.query(`SELECT * FROM games WHERE name = '${name}'`);

    if (result.rows.length) {
      res.status(409).send({
        message: 'Name already exists',
      });
      return;
    }
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal Error',
      detail: err,
    });
  }

  next();
}

export async function gameExists(req, res, next) {
  const { gameId } = req.body;
  try {
    const result = await db.query(
      `--sql
            SELECT 1
            FROM games
            WHERE id = $1`,
      [gameId]
    );

    if (!result.rows.length) {
      res.status(400).send({
        message: 'game not found',
      });
      return;
    }
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }

  next();
}

export async function checkGameStock(req, res, next) {
  const { gameId, daysRented } = req.body;
  const { rental } = res.locals;

  try {
    const gamesResult = await db.query(
      `--sql
                  SELECT "pricePerDay", "stockTotal" 
                  FROM games
                  WHERE id = $1
                `,
      [gameId]
    );
    const rentalsResult = await db.query(
      `--sql
                SELECT *
                FROM rentals
                WHERE "gameId" = $1 
                AND "returnDate" IS NULL
              `,
      [gameId]
    );

    if (rentalsResult.rows.length >= gamesResult.rows[0].stockTotal) {
      res.status(400).send({
        message: 'Game out of stock',
      });
      return;
    }

    const { pricePerDay } = gamesResult.rows[0];
    rental.originalPrice = pricePerDay * daysRented;
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }

  next();
}
