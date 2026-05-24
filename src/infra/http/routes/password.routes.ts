import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeRequestPasswordResetController } from "../factories/make-request-password-reset-controller";
import { makeResetPasswordController } from "../factories/make-reset-password-controller";

const passwordRoutes = Router();

passwordRoutes.post("/forgot", adaptRoute(makeRequestPasswordResetController()));
passwordRoutes.post("/reset", adaptRoute(makeResetPasswordController()));

export { passwordRoutes };
