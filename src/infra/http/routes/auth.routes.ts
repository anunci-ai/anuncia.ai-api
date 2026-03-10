import { Router, type Request, type Response } from "express";
import { makeSignInWithPasswordController } from "../factories/make-sign-in-with-password-controller";

const authRoutes = Router();

authRoutes.post("/", (request: Request, response: Response) => {
  makeSignInWithPasswordController().handle(request, response);
});

export { authRoutes };
