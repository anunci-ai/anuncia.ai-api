import { Router } from "express";
import multer from "multer";

// Importe o seu middleware de autenticação JWT que achamos mais cedo
import { auth } from "../middlewares/auth";

// Importe a Factory que construímos no Passo 4
import { makeUploadAndPersistImageController } from "../factories/make-upload-and-persist-image-controller";

const listingsRoutes = Router();

// 1. Configuração do Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB (boa prática para não derrubarem seu servidor)
  },
});

// 2. A nossa rota protegida: POST /
// Ordem de execução:
// -> Bate no Auth (valida o token)
// -> Bate no Multer (pega a imagem no campo "file")
// -> Bate no Controller (nossa regra de negócio)
listingsRoutes.post(
  "/",
  auth,
  upload.single("file"), // "file" é o nome do campo que o Front-end vai usar no FormData
  async (request, response) => {
    const controller = makeUploadAndPersistImageController();
    return controller.handle(request, response);
  },
);

export { listingsRoutes };
