import { Router } from "express";
import { makeSignInWithPasswordController } from "../factories/make-sign-in-with-password-controller";
import { makeCreateUserController } from "../factories/make-create-user-controller";
import { makeSignInWithGoogleController } from "../factories/make-sign-in-with-google-controller";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeGetProfileController } from "../factories/make-get-profile-controller";

const authRoutes = Router();

authRoutes.post("/sign-up", adaptRoute(makeCreateUserController()));

authRoutes.post("/sessions", adaptRoute(makeSignInWithPasswordController()));

authRoutes.post("/sessions/google", adaptRoute(makeSignInWithGoogleController()));

authRoutes.get("/me", auth, adaptRoute(makeGetProfileController()));

export { authRoutes };
