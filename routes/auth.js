import express from "express";
import { validateBody, validateJWT, upload } from "../middlewars/index.js";
import { schemas } from "../schemas/userSchemas.js";
import { userControllers } from "../controllers/auth.js";
import { emailControllers } from "../controllers/email.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(schemas.registerSchema),
  userControllers.register
);

authRouter.post(
  "/login",
  validateBody(schemas.loginSchema),
  userControllers.login
);

authRouter.get("/current", validateJWT, userControllers.getCurrent);
authRouter.post("/logout", validateJWT, userControllers.logout);
authRouter.get("/verify/:verificationToken", emailControllers.verifyEmail);

authRouter.patch(
  "/",
  validateJWT,
  validateBody(schemas.subscriptionSchema),
  userControllers.patchSubscription
);

authRouter.patch(
  "/avatars",
  validateJWT,
  upload.single("avatar"),
  userControllers.updateAvatar
);

authRouter.post(
  "/verify",
  validateBody(schemas.verifEmailSchema),
  emailControllers.resendVerifyEmail
);

export default authRouter;
