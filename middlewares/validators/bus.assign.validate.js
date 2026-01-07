const Joi = require("joi");

const assignBusToRouteSchema = Joi.object({
  bus_id: Joi.number().integer().required(),
  route_id: Joi.number().integer().required(),
});

const validateAssignBusToRoute = (req, res, next) => {
  const { error } = assignBusToRouteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateAssignBusToRoute };
