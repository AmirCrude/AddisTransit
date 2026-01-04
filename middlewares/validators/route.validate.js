const Joi = require("joi");

const createRouteSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(255).optional(),
});

const addRouteStopsSchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        stop_id: Joi.number().required(),
        order: Joi.number().positive().required(),
      })
    )
    .min(2)
    .required(),
});

const validateCreateRoute = (req, res, next) => {
  const { error } = createRouteSchema.validate(req.body);
  if (error)
    return res.status(400).json({ status: "error", message: error.details[0].message });
  next();
};

const validateAddRouteStops = (req, res, next) => {
  const { error } = addRouteStopsSchema.validate(req.body);
  if (error)
    return res.status(400).json({ status: "error", message: error.details[0].message });
  next();
};

module.exports = {
  validateCreateRoute,
  validateAddRouteStops,
};
