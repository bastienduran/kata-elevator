import { ConvoyMessage } from "./Domain/ConvoyMessage";

export interface Elevator {
  readonly move: (fromStage: number, toStage: number) => Promise<void>;
  readonly onboardPeople: (nbPeople: number) => Promise<void>;
  readonly offboardPeople: (nbPeople: number) => Promise<void>;
  start(): void;
  onCall: (message: ConvoyMessage) => void;
}
