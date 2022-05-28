import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';
import CustomerSchema from '../models/customerSchema.js';

export async function validateSchema(req, res, next) {
  const { body } = req;

  const validate = CustomerSchema.validate(body);

  if (validate.error) {
    res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }

  next();
}

export async function validateUniqueCpf(req, res, next) {
  try {
    const { cpf } = req.body;
    const result = await db.query(
      `--sql
              SELECT * FROM customers 
              WHERE cpf = $1
          `,
      [cpf]
    );

    if (result.rows.length) {
      res.status(409).send({
        message: 'Cpf already registered',
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

export async function customerExists(req, res, next) {
  const { cpf } = req.body;

  try {
    const result = await db.query(
      `--sql
      SELECT * FROM customers
      WHERE cpf = $1      
      `,
      [cpf]
    );

    if (!result.rows[0]) {
      res.status(404).send({
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

  next();
}
