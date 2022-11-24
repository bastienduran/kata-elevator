import { ConvoyMessage } from "../Domain/ConvoyMessage";
import { QueuedMessage } from "../Domain/QueuedMessage";

export interface QueueRepository {
  saveMessageToQueue(message: ConvoyMessage): void;
  getQueue(): QueuedMessage[];
  setConvoyed(messageId: number): void;
}
