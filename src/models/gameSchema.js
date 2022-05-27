import joi from 'joi';

const GameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string(),
  stockTotal: joi.number().min(1),
  categoryId: joi.number(),
  pricePerDay: joi.number().min(1),
});

export default GameSchema;
