import { move, offboardPeople, onboardPeople } from "../../consumer/functions";
import { ConvoyMessage } from "./ConvoyMessage";
import { Elevator } from "./Elevator";

export class OtisLeScribe implements Elevator {
  async convoy({ nbPeople, fromStage, toStage }: ConvoyMessage) {
    if (nbPeople) {
      await onboardPeople(nbPeople);
    }
    await move(fromStage, toStage);
    if (nbPeople) {
      await offboardPeople(nbPeople);
    }
  }
}
