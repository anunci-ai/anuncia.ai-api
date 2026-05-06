import { QueueEventMap } from "../../events/queue-events";

export interface QueueService {
  publish<T extends keyof QueueEventMap>(event: T, payload: QueueEventMap[T]): Promise<void>;
}
