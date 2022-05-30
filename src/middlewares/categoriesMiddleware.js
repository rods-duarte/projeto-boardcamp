import db from '../database/index.js';
import { ERROR } from '../blueprint/chalkMessages.js';

import CategorySchema from '../models/categorySchema.js';

export async function validateSchema(req, res, next) {
  const { name } = req.body;

  const validate = CategorySchema.validate({ name });

  if (validate.error) {
    console.log(
      `${ERROR} ${validate.error.details.map((e) => e.message).join(', ')}`
    );
    res.status(400).send({
      message: `Invalid category name`,
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }

  next();
}

export async function validateUniqueName(req, res, next) {
  const { name } = req.body;

  try {
    const result = await db.query(
      `--sql
          SELECT * FROM categories WHERE name = '${name}'
          `
    );

    if (result.rows.length) {
      res.status(409).send({
        message: 'Category already exists',
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

export async function categoryExists(req, res, next) {
  const { categoryId } = req.body;

  try {
    const result = db.query(
      `--sql
        SELECT * FROM categories
        WHERE id = $1
        `,
      [categoryId]
    );

    if (!result.rows.length) {
      res.sendStatus(400);
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
