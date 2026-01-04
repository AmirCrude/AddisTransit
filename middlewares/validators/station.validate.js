const Joi = require("joi");

const createStationSchema = Joi.object({
  name: Joi.string().max(100).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  is_major: Joi.boolean().optional(),
});

const validateCreateStation = (req, res, next) => {
  const { error } = createStationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateCreateStation,
};
