import { Plan } from "../../enterprise/entities/plan";

export interface PlansRepository {
  findByName(name: string): Promise<Plan | null>;
  findById(id: string): Promise<Plan | null>;
}
