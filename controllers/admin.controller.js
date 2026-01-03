const { createAgentInvite } = require("../services/admin.invite.service");

const createAgentInviteController = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user.id;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const inviteLink = await createAgentInvite(email, adminId);

    res.status(201).json({
      status: "success",
      invite_link: inviteLink,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = {
  createAgentInvite: createAgentInviteController,
};
