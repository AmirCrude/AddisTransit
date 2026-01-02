const adminService = require("../services/admin.service");

// Create Ticket Agent (Super Admin only)
const createTicketAgent = async (req, res) => {
  try {
    // req.body already validated by Joi validator
    const result = await adminService.createTicketAgent(req.body);

    res.status(201).json({
      status: "success",
      message:
        "Ticket Agent created successfully. Password sent via email.",
      data: result,
    });
  } catch (error) {
    console.error("Create Ticket Agent Error:", error);
    res.status(400).json({
      status: "error",
      message: error.message || "Failed to create ticket agent.",
    });
  }
};

module.exports = {
  createTicketAgent,
};
