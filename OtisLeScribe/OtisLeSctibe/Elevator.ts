import { ConvoyMessage } from "./ConvoyMessage";

export interface Elevator {
  convoy(message: ConvoyMessage): void;
}
