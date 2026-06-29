const db = require("../config/database");
const bcrypt = require("bcrypt");
require("dotenv").config();

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Usage: node scripts/reset-user-password.js <email> <password>");
  process.exit(1);
}

async function resetPassword() {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [result] = await db.query(
    'UPDATE users SET password = ?, status = "approved" WHERE email = ? OR username = ?',
    [hashedPassword, email, email]
  );

  if (result.affectedRows === 0) {
    console.error(`No user found for: ${email}`);
    process.exit(1);
  }

  const [users] = await db.query(
    "SELECT id, username, email, role, status FROM users WHERE email = ? OR username = ?",
    [email, email]
  );

  console.log("Password updated successfully.");
  console.log("User:", users[0]);
  console.log("Login with email/username:", email);
  console.log("Password:", newPassword);
  process.exit(0);
}

resetPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});
