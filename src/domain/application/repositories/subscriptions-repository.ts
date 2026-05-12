import { Subscription } from "../../enterprise/entities/subscription";

export interface SubscriptionsRepository {
  findByUserId(userId: string): Promise<Subscription | null>;
  save(subscription: Subscription): Promise<void>;
}
