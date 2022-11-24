import { InMemoryCallHandler } from "./Repository/InMemoryCallHandler";
import { move, offboardPeople, onboardPeople } from "../consumer/functions";
import { OtisLeScribe } from "./OtisLeScribe";

describe("OtisLeScribe lift welcome!", () => {
  let queueRepository: InMemoryCallHandler;
  beforeEach((): void => {
    queueRepository = new InMemoryCallHandler();
  });

  it("log when there is no one to convoy", async () => {
    const logger = jest.fn();
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );
    elevator.start();
    expect(logger).toHaveBeenCalledWith(
      "No one to convoy. Waiting for calls..."
    );
  });

  it("record calls", async () => {
    const logger = jest.fn();
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );

    const call1 = {
      messageId: 1,
      fromStage: 0,
      toStage: 1,
      nbPeople: 1,
      status: "pending",
    };
    const call2 = {
      messageId: 2,
      fromStage: 0,
      toStage: 1,
      nbPeople: 1,
      status: "pending",
    };
    elevator.start();
    elevator.onCall(call1);
    elevator.onCall(call2);
    expect(queueRepository.getQueue()).toEqual([call1, call2]);
    // expectLogSequence(logger, [
    //   "Onboarding 1 people",
    //   "Move from 2 to 3",
    //   "Off-boarding 1 people",
    //   "No one to convoy. Waiting for calls...",
    // ]);
  });

  it("convoy 1 people from 0 to 1", async () => {
    const logger = jest.fn();
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );

    const call1 = {
      messageId: 1,
      fromStage: 0,
      toStage: 1,
      nbPeople: 1,
      status: "pending",
    };
    elevator.start();
    elevator.onCall(call1);
    expectLogSequence(logger, [
      "Onboarding 1 people",
      "Move from 0 to 31",
      "Off-boarding 1 people",
      "No one to convoy. Waiting for calls...",
    ]);
  });

  xit("", async () => {
    const logger = jest.fn();
    queueRepository.queue = [
      {
        messageId: 1,
        fromStage: 0,
        toStage: 1,
        nbPeople: 1,
        status: "pending",
      },
    ];
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );
    await elevator.start();
    expect(queueRepository.getQueue()[0].status).toBe("convoyed");
  });

  // xit("starting from 0 floor, transport 1 people from 2 to 3", async () => {
  //   const convoyMessage1 = {
  //     messageId: 1,
  //     fromStage: 2,
  //     toStage: 3,
  //     nbPeople: 1,
  //   };

  //   const logger = jest.fn();
  //   const elevator = new OtisLeScribe(
  //     move,
  //     onboardPeople,
  //     offboardPeople,
  //     queueRepository,
  //     logger
  //   );
  //   await elevator.onMessage(convoyMessage1);
  //   expectLogSequence(logger, [
  //     "Move from 0 to 2",
  //     "Onboarding 1 people",
  //     "Move from 2 to 3",
  //     "Off-boarding 1 people",
  //   ]);
  // });
});

function expectLogSequence(logger = jest.fn(), sequence: string[]) {
  sequence.forEach((step, index) =>
    expect(logger.mock.calls[index][0]).toEqual(step)
  );
}
