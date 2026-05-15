import { Controller } from "../../../core/infra/controller";
import { FetchPlansUseCase } from "../../../domain/application/use-cases/plan/fetch-plans/fetch-plans";
import { PrismaPlansRepository } from "../../prisma/repositories/prisma-plans-repository";
import { FetchPlansController } from "../controllers/fetch-plans-controller";

export function makeFetchPlansController(): Controller {
  const plansRepository = new PrismaPlansRepository();
  const fetchPlansUseCase = new FetchPlansUseCase(plansRepository);
  const fetchPlansController = new FetchPlansController(fetchPlansUseCase);

  return fetchPlansController;
}
