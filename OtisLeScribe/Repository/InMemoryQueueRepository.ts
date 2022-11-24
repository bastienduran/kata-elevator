import { ConvoyMessage, MessageStatus, QueuedMessage } from "../Domain";
import { QueueRepository } from "./QueueRepository";

export class InMemoryQueueRepository implements QueueRepository {
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

  setConvoyed(id: number): void {
    const newQueue = this._queue.map((message) => {
      if (id === message.messageId) {
        return { ...message, status: MessageStatus.CONVOYED };
      }
      return message;
    });
    this._queue = newQueue;
  }
}
