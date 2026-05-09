import { qstash } from ".";
import { QueueService } from "../../domain/application/queue/queue-service";
import { QueueEventMap } from "../../domain/events/queue-events";
import { env } from "../env";

export class QStashService implements QueueService {
  async publish<T extends keyof QueueEventMap>(event: T, payload: QueueEventMap[T]): Promise<void> {
    console.log("[Queue] Publishing:", event, payload);

    const url = this.getUrl(event);

    await qstash.publishJSON({
      url,
      body: payload,
      headers: {
        "Idempotency-Key": `${event}-${payload.listingId}`,
      },
    });
  }

  private getUrl(event: keyof QueueEventMap) {
    const baseUrl = `${env.API_URL}/v1/listings`;

    const map = {
      "process-text": `${baseUrl}/process-text`,
      "process-images": `${baseUrl}/process-images`,
    };

    return map[event];
  }
}
