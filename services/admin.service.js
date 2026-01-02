const {
    getUserByEmail,
    insertUser,
  } = require("../database/queries/admin.query");
  const {
    generatePassword,
    hashedPassword,
  } = require("../utils/password/password.manager");
  const {
    sendAgentWelcomeEmail,
  } = require("../utils/template/email.template");
  
  // Service to create a ticket agent
  const createTicketAgent = async ({
    email,
    first_name,
    last_name,
    phone_number,
  }) => {
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
  
    // Generate system password
    const plainPassword = generatePassword(12);
    const passwordHash = await hashedPassword(plainPassword); // ✅ await here
  
    try {
      // Insert user into users table
      const userId = await insertUser({
        email,
        passwordHash,
        first_name,
        last_name,
        phone_number,
        role: "ticket_agent",
      });
  
      // Send welcome email with generated password
      await sendAgentWelcomeEmail(email, first_name, plainPassword);
  
      // Return created official info
      return {
        user_id: userId,
        role: "ticket_agent",
      };
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = {
    createTicketAgent,
  };
  