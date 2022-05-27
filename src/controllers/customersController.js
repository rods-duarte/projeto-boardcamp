import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

export async function getCustomers(req, res) {
  try {
    const result = await db.query(
      `--sql
            SELECT * FROM customers
            `
    );

    res.status(200).send(result.rows);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  console.log(id);

  try {
    const result = await db.query(
      `--sql 
            SELECT * FROM customers
            WHERE id = $1
            `,
      [id]
    );
    console.log(result);

    if (!result.rows.length) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      detials: err,
    });
  }
}

export async function addCustomer(req, res) {}
