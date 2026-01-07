const Joi = require("joi");

const assignAgentSchema = Joi.object({
  bus_id: Joi.number().integer().required(),
  agent_id: Joi.number().integer().required(),
});

const validateAssignAgentToBus = (req, res, next) => {
  const { error } = assignAgentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateAssignAgentToBus };
