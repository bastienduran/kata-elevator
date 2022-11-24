import { ConvoyMessage, MessageStatus, QueuedMessage } from "./Domain";
import { Elevator } from "./Elevator";
import { CallHandler } from "./Repository/CallHandler";

export class OtisLeScribe implements Elevator {
  constructor(
    readonly move: (fromStage: number, toStage: number) => Promise<void>,
    readonly onboardPeople: (nbPeople: number) => Promise<void>,
    readonly offboardPeople: (nbPeople: number) => Promise<void>,
    private eventHandler: CallHandler,
    private logger: any
  ) {}
  private _peopleOnboard: number = 0;
  private _currentFloor: number = 0;

  get peopleOnboard() {
    return this._peopleOnboard;
  }
  get currentFloor() {
    return this._currentFloor;
  }

  start() {
    // await this.handleQueue(this.queueRepository.getQueue());
    this.logger("No one to convoy. Waiting for calls...");
  }

  async handleQueue(currentQueue: QueuedMessage[]) {
    if (currentQueue.length) {
      const { messageId, nbPeople, fromStage, toStage } =
        this.eventHandler.getQueue()[0];
      await this.convoy({ nbPeople, fromStage, toStage });
      this.eventHandler.setStatus(messageId, MessageStatus.CONVOYED);
    }
  }

  onCall(message: ConvoyMessage) {
    this.eventHandler.saveMessageToQueue(message);
  }

  private async convoy({
    nbPeople,
    fromStage,
    toStage,
  }: {
    nbPeople: number;
    fromStage: number;
    toStage: number;
  }) {
    const currentFloor = this.currentFloor;
    if (currentFloor !== fromStage) {
      this.logger(`Move from ${currentFloor} to ${fromStage}`);
      await this.move(currentFloor, fromStage);
    }

    this.logger(`Onboarding ${nbPeople} people`);
    await this.onboardPeople(nbPeople);

    this.logger(`Move from 2 to 3`);
    await this.move(fromStage, toStage);

    this.logger(`Off-boarding ${nbPeople} people`);
    await this.offboardPeople(nbPeople);
  }
}
