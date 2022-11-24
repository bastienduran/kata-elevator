import {
  getElevatorStage,
  getTotalPeopleConvoyed,
} from "../consumer/functions";
import { OtisLeScribe } from "./OtisLeSctibe/OtisLeSctibe";

describe("OtisLeScribe lift welcome!", () => {
  it("transport 1 people from 0 to 1", async () => {
    const convoyMessage = {
      messageId: 1,
      fromStage: 0,
      toStage: 1,
      nbPeople: 1,
    };
    const elevator = new OtisLeScribe();
    await elevator.convoy(convoyMessage);
    expect(getTotalPeopleConvoyed()).toEqual(1);
    expect(getElevatorStage()).toEqual(1);
  });
});
