import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

export async function getCategories(req, res) {
  try {
    const result = await db.query(`SELECT * FROM categories`);

    res.status(200).send(result.rows);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal Error',
      details: err,
    });
  }
}

export async function addCategory(req, res) {
  const { name } = req.body;

  try {
    await db.query(
      `--sql
        INSERT INTO categories (name) 
        VALUES ($1)
      `,
      [name]
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
