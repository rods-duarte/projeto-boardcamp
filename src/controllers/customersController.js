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

  try {
    const result = await db.query(
      `--sql 
            SELECT * FROM customers
            WHERE id = $1
            `,
      [id]
    );

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

export async function addCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await db.query(
      `--sql
          INSERT INTO customers (name, phone, cpf, birthday)
          VALUES ($1, $2, $3, $4)
          `,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal error',
      details: err,
    });
  }
}

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await db.query(
      `--sql
      UPDATE customers 
      SET name = $1, phone = $2, cpf = $3, birthday = $4
      WHERE cpf = $3
      `,
      [name, phone, cpf, birthday]
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
