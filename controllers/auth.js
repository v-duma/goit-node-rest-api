import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import crypto from "crypto";
import { sendEmail } from "../helpers/index.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomUUID();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3001/users/verify/${verificationToken}">Verify email</a>`,
  };

  try {
    await sendEmail(mail);
  } catch (error) {
    return res.status(500).json(error.message);
  }

  res.status(201).json({
    users: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  if (!user.verify) {
    return res
      .status(401)
      .json({ message: "Email not verified. Access denied" });
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { token, email, subscription, avatarURL } = req.user;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout success. Not found content",
  });
};

const patchSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  if (result.token === null) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(200).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    return res.status(400).send({ message: "File not uploaded" });
  }
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(process.cwd(), "public/avatars", filename);

  const img = await Jimp.read(tempUpload);
  img.resize(250, 250).write(tempUpload);

  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    await fs.unlink(tempUpload);
    console.log(error);
  }

  const avatarURL = path.join("avatars", filename);
  const result = await User.findByIdAndUpdate(_id, { avatarURL });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  if (result.token === null) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.status(200).json({
    avatarURL,
  });
};

export const userControllers = {
  register,
  login,
  getCurrent,
  logout,
  patchSubscription,
  updateAvatar,
};
