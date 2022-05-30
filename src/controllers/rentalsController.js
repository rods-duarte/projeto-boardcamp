import dayjs from 'dayjs';

import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

export async function getRentals(req, res) {
  const { query, queryParams } = res.locals;

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
  const { rental } = res.locals;

  try {
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

export async function endRent(req, res) {
  const { id } = req.params;
  const { daysRented, originalPrice, rentDate } = res.locals.rental;
  let delayFee = null;
  const daysPassed = dayjs().diff(rentDate, 'day');

  if (daysPassed > daysRented) {
    const excess = daysPassed - daysRented;
    delayFee = excess * originalPrice;
  }

  try {
    await db.query(
      `--sql
        UPDATE rentals
        SET "delayFee" = $1, "returnDate" = $2
        WHERE id = $3
      `,
      [delayFee, dayjs().format('YYYY-MM-DD'), id]
    );
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }

  res.sendStatus(200);
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    await db.query(
      `--sql
        DELETE FROM rentals
        WHERE id = $1`,
      [id]
    );
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}

export async function getMetrics(req, res) {
  const { startDate, endDate } = req.query;
  let query;

  try {
    const result = await db.query(
      `--sql
        SELECT 
        SUM("daysRented"*"originalPrice") as "rentTotal",
        SUM("delayFee") as "delayFeeTotal",
        COUNT(id) as rentals
        FROM RENTALS;
        `
    );
    console.log(result.rows[0]);

    const { rentTotal, delayFeeTotal, rentals } = result.rows[0];
    const revenue = Number(rentTotal) + Number(delayFeeTotal);
    const average = (revenue / rentals).toFixed(2);

    res.send({
      rentals,
      revenue,
      average,
    });
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}
