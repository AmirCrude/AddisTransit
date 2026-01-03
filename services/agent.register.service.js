const {
    getInviteByToken,
    markInviteUsed,
  } = require("../database/queries/agentInvite.query");
  
  const {
    insertUser,
    getUserByEmail,
  } = require("../database/queries/admin.query");
  
  const {
    generatePassword,
    hashedPassword,
  } = require("../utils/password/password.manager");
  
  const {
    sendAgentWelcomeEmail,
  } = require("../utils/template/email.template");
  
  const registerAgentFromInvite = async ({
    token,
    first_name,
    last_name,
    phone_number,
  }) => {
    if (!token) throw new Error("Invite token is required");
  
    const invite = await getInviteByToken(token);
  
    if (!invite) throw new Error("Invalid invite token");
    if (invite.used) throw new Error("Invite already used");
    if (new Date(invite.expires_at) < new Date())
      throw new Error("Invite has expired");
  
    const existingUser = await getUserByEmail(invite.email);
    if (existingUser) throw new Error("User already exists");
  
    const plainPassword = generatePassword(12);
    const passwordHash = await hashedPassword(plainPassword);
  
    await insertUser({
      email: invite.email,
      passwordHash,
      first_name,
      last_name,
      phone_number,
      role: "ticket_agent",
    });
  
    await markInviteUsed(invite.invite_id);
  
    await sendAgentWelcomeEmail(invite.email, first_name, plainPassword);
  };
  
  module.exports = { registerAgentFromInvite };
  