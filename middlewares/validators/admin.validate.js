const Joi = require("joi");

// Schema for creating ticket agent
const createTicketAgentSchema = Joi.object({
  email: Joi.string().email().max(255).required().messages({
    "string.email": "Please enter a valid email address",
    "string.max": "Email cannot be longer than 255 characters",
    "any.required": "Email is required",
  }),
  first_name: Joi.string().max(100).required().messages({
    "string.base": "First name must be a string",
    "string.max": "First name cannot be longer than 100 characters",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().max(100).required().messages({
    "string.base": "Last name must be a string",
    "string.max": "Last name cannot be longer than 100 characters",
    "any.required": "Last name is required",
  }),
  phone_number: Joi.string().max(50).optional().messages({
    "string.base": "Phone number must be a string",
    "string.max": "Phone number cannot be longer than 50 characters",
  }),
});

// Middleware validator
const validateCreateTicketAgent = (req, res, next) => {
  const { error } = createTicketAgentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = { validateCreateTicketAgent };
