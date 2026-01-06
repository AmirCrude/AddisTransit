const Joi = require("joi");

const createBusSchema = Joi.object({
  plate_number: Joi.string().max(20).required(),
  capacity: Joi.number().integer().min(1).required(),
});

const validateCreateBus = (req, res, next) => {
  const { error } = createBusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateCreateBus };
