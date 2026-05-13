import { Subscription } from "../../enterprise/entities/subscription";

export interface SubscriptionsRepository {
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<void>;
  save(subscription: Subscription): Promise<void>;
}
