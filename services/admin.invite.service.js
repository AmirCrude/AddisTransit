const crypto = require("crypto");
const {
  insertAgentInvite,
  getActiveInviteByEmail,
} = require("../database/queries/agentInvite.query");

const createAgentInvite = async (email, adminId) => {
  const existingInvite = await getActiveInviteByEmail(email);
  if (existingInvite) {
    throw new Error("An active invite already exists for this email");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await insertAgentInvite({
    email,
    token,
    expires_at: expiresAt,
    created_by: adminId,
  });

  return `${process.env.CLIENT_URL}/register/agent?token=${token}`;
};

module.exports = { createAgentInvite };
