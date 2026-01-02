const { query } = require("../../utils/connection/connections");

// Get user by email

const getUserByEmail = async (email) => {
  const sql = `
    SELECT 
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone_number,
      u.password_hash,
      u.role,
      u.created_at,
      u.last_login
    FROM users u
    WHERE u.email = ?
    LIMIT 1
  `;

  const [user] = await query(sql, [email]);

  if (!user) return null;

  return user;
};

// Get user by ID

const getUserById = async (id) => {
  try {
    const sql = `
      SELECT 
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        role,
        password_hash
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `;

    const [user] = await query(sql, [id]);
    return user || null;
  } catch (error) {
    console.error("Get User By ID Query Error:", error);
    throw error;
  }
};

// Update user password

const updateUserPassword = async (email, newPasswordHash) => {
  const sql = `
    UPDATE users 
    SET password_hash = ?
    WHERE email = ?
  `;

  const result = await query(sql, [newPasswordHash, email]);
  return result.affectedRows > 0;
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUserPassword,
};
