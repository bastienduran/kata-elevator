import { ConvoyMessage, MessageStatus, QueuedMessage } from "../Domain";

export interface CallHandler {
  saveMessageToQueue(message: ConvoyMessage): void;
  getQueue(): QueuedMessage[];
  setStatus(messageId: number, status: MessageStatus): void;
}
