import { ConvoyMessage, MessageStatus, QueuedMessage } from "../Domain";
import { CallHandler } from "./CallHandler";

export class InMemoryCallHandler implements CallHandler {
  private _queue: QueuedMessage[] = [];

  set queue(messages: QueuedMessage[]) {
    this._queue = messages;
  }

  public getQueue() {
    return this._queue;
  }

  saveMessageToQueue(message: ConvoyMessage): void {
    this._queue.push({ ...message, status: MessageStatus.PENDING });
  }

  setStatus(id: number, status: MessageStatus): void {
    const newQueue = this._queue.map((message) => {
      if (id === message.messageId) {
        return { ...message, status };
      }
      return message;
    });
    this._queue = newQueue;
  }
}
