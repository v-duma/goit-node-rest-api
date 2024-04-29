import { User } from "../models/user.js";
import { sendEmail } from "../helpers/index.js";

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="http://localhost:3001/users/verify/${user.verificationToken}">Verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

export const emailControllers = {
  verifyEmail,
  resendVerifyEmail,
};
