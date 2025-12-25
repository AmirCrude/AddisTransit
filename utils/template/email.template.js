require("dotenv").config();
const { transporter } = require("../../configs/email.config");

// Send password reset email
const sendResetTokenEmail = async (email, token) => {
  try {
    const appName = "Addis_Transit"; // fixed app name
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"${appName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${appName} | Password Reset`,
      text: `
You requested a password reset for ${appName}.

Reset your password using the link below:
${resetUrl}

This link will expire in 1 hour.
If you did not request this, please ignore this email.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color:#222;">${appName} – Password Reset</h2>

          <p>You requested a password reset for your <strong>${appName}</strong> account.</p>

          <p style="margin: 20px 0;">
            <a href="${resetUrl}"
               style="
                 background:#0d6efd;
                 color:#ffffff;
                 padding:12px 24px;
                 text-decoration:none;
                 border-radius:6px;
                 display:inline-block;
               ">
              Reset Password
            </a>
          </p>

          <p>This link will expire in <strong>1 hour</strong>.</p>

          <p style="color:#666; font-size:14px;">
            If you did not request this password reset, you can safely ignore this email.
          </p>

          <hr />

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} ${appName}. All rights reserved.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending reset email:", error.message);
    return false;
  }
};

module.exports = { sendResetTokenEmail };
