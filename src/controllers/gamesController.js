import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

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

  try {
    await db.query(
      `
      INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5)
      `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.status(200).send('Adicionado com sucesso');
  } catch (err) {
    console.log(`${ERROR} ${err}`);
    res.status(500).send({
      message: 'Internal Error when adding game',
      detail: err,
    });
  }
}
