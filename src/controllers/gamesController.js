import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

import GameSchema from '../models/gameSchema.js';

export async function getGames(req, res) {
  try {
    const result = await db.query('SELECT * FROM games');
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal Error',
      detail: err,
    });
  }
}

export async function addGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  // TODO fazer validacoes

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
    return res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
  }

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

  try {
    await db.query(
      `
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    console.log('EXECUTOU TUDO');
    res.status(200).send('Adicionado com sucesso');
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal Error when adding game',
      detail: err,
    });
  }
}
