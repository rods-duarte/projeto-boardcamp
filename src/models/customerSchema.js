import baseJoi from 'joi';
import date from '@joi/date';

const joi = baseJoi.extend(date);

const CustomerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11),
  cpf: joi.string().length(11).required(),
  birthday: joi.date().format('YYYY-MM-DD').utc(),
});

export default CustomerSchema;
