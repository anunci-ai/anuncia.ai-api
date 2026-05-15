import { Plan } from "../../enterprise/entities/plan";

export interface PlansRepository {
  findAll(): Promise<Plan[]>;
  findByName(name: string): Promise<Plan | null>;
  findById(id: string): Promise<Plan | null>;
}
