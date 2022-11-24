import { ConvoyMessage } from "./ConvoyMessage";

export interface QueuedMessage extends ConvoyMessage {
  status: string;
}
