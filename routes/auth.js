import express from "express";
import { validateBody, validateJWT } from "../middlewars/index.js";
import { schemas } from "../schemas/userSchemas.js";
import { userControllers } from "../controllers/auth.js";

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

authRouter.patch(
  "/",
  validateJWT,
  validateBody(schemas.subscriptionSchema),
  userControllers.patchSubscription
);

export default authRouter;
