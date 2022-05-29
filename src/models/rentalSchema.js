import baseJoi from 'joi';
import date from '@joi/date';

const joi = baseJoi.extend(date);

const RentalSchema = joi.object({
  customerId: joi.number(),
  gameId: joi.number(),
  rentDate: joi.date().format('YYYY-MM-DD').utc(),
  daysRented: joi.number().greater(0),
  returnDate: joi.any(),
  originalPrice: joi.number(),
  delayFee: joi.any(),
});

export default RentalSchema;
