import { ConvoyMessage } from "./Domain/ConvoyMessage";

export interface Elevator {
  onMessage(message: ConvoyMessage): void;
}
