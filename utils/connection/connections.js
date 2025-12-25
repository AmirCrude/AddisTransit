// Unified Connection Tester Module

const pool = require("../../configs/database.config");
const { transporter } = require("../../configs/email.config");


// Execute SQL query
const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

// Test database connection

const testDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email server connected successfully!");
  } catch (err) {
    console.error("Email connection failed:", err.message);
  }
};



// Exported function: runs all connection tests
const testAllConnections = async () => {
  await testDBConnection();
  await testEmailConnection();
};

// Export only what you want

module.exports = {
  query,
  testAllConnections,
};
