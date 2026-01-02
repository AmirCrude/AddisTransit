const { query } = require("../../utils/connection/connections");

// Users Table Queries

// Get user by email
const getUserByEmail = async (email) => {
  const sql = `
    SELECT 
      user_id,
      first_name,
      last_name,
      email,
      phone_number,
      password_hash,
      role,
      created_at
    FROM users
    WHERE email = ?
    LIMIT 1
  `;
  const [user] = await query(sql, [email]);
  return user || null;
};

// Get user by ID
const getUserById = async (id) => {
  const sql = `
    SELECT 
      user_id,
      first_name,
      last_name,
      email,
      phone_number,
      password_hash,
      role,
      created_at
    FROM users
    WHERE user_id = ?
    LIMIT 1
  `;
  const [user] = await query(sql, [id]);
  return user || null;
};

// Insert new user
const insertUser = async ({
  email,
  passwordHash,
  first_name,
  last_name,
  phone_number,
  role,
}) => {
  const sql = `
    INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const result = await query(sql, [
    email,
    passwordHash,
    first_name,
    last_name,
    phone_number || null,
    role,
  ]);
  return result.insertId;
};


module.exports = {
  getUserByEmail,
  getUserById,
  insertUser,
};