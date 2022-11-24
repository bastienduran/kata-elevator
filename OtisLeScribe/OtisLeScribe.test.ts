import { InMemoryQueueRepository } from "./Repository/InMemoryQueueRepository";
import { move, offboardPeople, onboardPeople } from "../consumer/functions";
import { OtisLeScribe } from "./OtisLeScribe";

describe("OtisLeScribe lift welcome!", () => {
  let queueRepository: InMemoryQueueRepository;
  beforeEach((): void => {
    queueRepository = new InMemoryQueueRepository();
  });
  it("start log waiting for message if started with en empty queue", async () => {
    const logger = jest.fn();
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );
    await elevator.start();
    expect(logger).toHaveBeenCalledWith(
      "No one to convoy. Waiting for calls..."
    );
  });
  it("start to move if there is a message on queue", async () => {
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
    expectLogSequence(logger, [
      "Onboarding 1 people",
      "Move from 2 to 3",
      "Off-boarding 1 people",
      "No one to convoy. Waiting for calls...",
    ]);
  });

  it("starting from 0 floor, transport 1 people from 2 to 3", async () => {
    const convoyMessage1 = {
      messageId: 1,
      fromStage: 2,
      toStage: 3,
      nbPeople: 1,
    };

    const logger = jest.fn();
    const elevator = new OtisLeScribe(
      move,
      onboardPeople,
      offboardPeople,
      queueRepository,
      logger
    );
    await elevator.onMessage(convoyMessage1);
    expectLogSequence(logger, [
      "Move from 0 to 2",
      "Onboarding 1 people",
      "Move from 2 to 3",
      "Off-boarding 1 people",
    ]);
  });
});

function expectLogSequence(logger = jest.fn(), sequence: string[]) {
  sequence.forEach((step, index) =>
    expect(logger.mock.calls[index][0]).toEqual(step)
  );
}
