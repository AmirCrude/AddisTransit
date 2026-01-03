const db = require("../../configs/database.config");

const insertAgentInvite = (data) =>
  db.query("INSERT INTO agent_invites SET ?", data);

const getInviteByToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM agent_invites WHERE token = ?",
    [token]
  );
  return rows[0];
};

const getActiveInviteByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM agent_invites WHERE email = ? AND used = false AND expires_at > NOW()",
    [email]
  );
  return rows[0];
};

const markInviteUsed = (inviteId) =>
  db.query(
    "UPDATE agent_invites SET used = true WHERE invite_id = ?",
    [inviteId]
  );

module.exports = {
  insertAgentInvite,
  getInviteByToken,
  getActiveInviteByEmail,
  markInviteUsed,
};
