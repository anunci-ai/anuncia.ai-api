import { Router, type Request, type Response } from "express";
import { makeSignInWithPasswordController } from "../factories/make-sign-in-with-password-controller";
import { makeCreateAccountController } from "../factories/make-create-account-controller";

const authRoutes = Router();

authRoutes.post("/sign-up", (request: Request, response: Response) => {
  makeCreateAccountController().handle(request, response);
});

authRoutes.post("/sessions", (request: Request, response: Response) => {
  makeSignInWithPasswordController().handle(request, response);
});

export { authRoutes };
