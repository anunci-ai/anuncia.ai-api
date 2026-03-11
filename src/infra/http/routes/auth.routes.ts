import { Router } from "express";
import { makeSignInWithPasswordController } from "../factories/make-sign-in-with-password-controller";
import { makeCreateAccountController } from "../factories/make-create-account-controller";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";

const authRoutes = Router();

authRoutes.post("/sign-up", adaptRoute(makeCreateAccountController()));

authRoutes.post("/sessions", adaptRoute(makeSignInWithPasswordController()));

export { authRoutes };
