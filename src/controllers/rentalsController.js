import dayjs from 'dayjs';

import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

import RentalSchema from '../models/rentalSchema.js';

export async function getRentals(req, res) {
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

  try {
    const result = await db.query(query, queryParams);
    const rentals = result.rows.map((rental) => {
      const customer = { id: rental.customerId, name: rental.name };
      const game = {
        id: rental.gameId,
        name: rental.gameName,
        categoryId: rental.categoryId,
        categoryName: rental.categoryName,
      };
      return {
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer,
        game,
      };
    });

    res.status(200).send(rentals);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}

export async function addRental(req, res) {
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

  try {
    const result = await db.query(
      `--sql
            SELECT 1
            FROM customers
            WHERE id = $1`,
      [customerId]
    );

    if (!result.rows.length) {
      res.status(400).send({
        message: 'Customer not found',
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

    await db.query(
      `--sql
          INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
      [
        rental.customerId,
        rental.gameId,
        rental.rentDate,
        rental.daysRented,
        rental.returnDate,
        rental.originalPrice,
        rental.delayFee,
      ]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}
