import { ReduxCallHandler } from "../CallHandler/ReduxCallHandler";
import { move, offboardPeople, onboardPeople } from "../../consumer/functions";
import { OtisLeScribe } from "./OtisLeScribe";
import { promisify } from "node:util";
import { ConvoyMessage } from "../Domain";

const delay = promisify(setTimeout);

describe("OtisLeScribe lift welcome!", () => {
  let queueRepository: ReduxCallHandler;
  beforeEach((): void => {
    queueRepository = new ReduxCallHandler();
  });

  xit("log when there is no one to convoy", async () => {
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
  });

  it("convoy 1 people from 0 to 1", async () => {
    const logger = jest.fn(console.warn);
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
    // await delay(5000);
    jest.setTimeout(testDuration([call1]));
    await delay(testDuration([call1]));
    expectLogSequence(logger, [
      // "No one to convoy. Waiting for calls...",
      "Onboarding 1 people",
      "Move from 0 to 1",
      "Off-boarding 1 people",
      // "No one to convoy. Waiting for calls...",
    ]);
  });
});

function expectLogSequence(logger = jest.fn(), sequence: string[]) {
  sequence.forEach((step, index) =>
    expect(logger.mock.calls[index][0]).toEqual(step)
  );
}

function testDuration(callStack: ConvoyMessage[]): number {
  const durationOffset = 1000;
  let duration = callStack.reduce(
    (result, { fromStage, toStage, nbPeople }) => {
      let dur = result + (toStage - fromStage) * 1000;
      console.log({ nbPeople });
      if (nbPeople > 0) {
        dur = dur + 2000;
      }
      return dur;
    },
    durationOffset
  );
  console.log({ duration });
  return duration;
}
