import { ConvoyMessage, MessageStatus, QueuedMessage } from "../Domain";
import { Elevator } from "../Elevator";
import { CallHandler } from "../CallHandler/CallHandler";

export class OtisLeScribe implements Elevator {
  constructor(
    readonly move: (fromStage: number, toStage: number) => Promise<void>,
    readonly onboardPeople: (nbPeople: number) => Promise<void>,
    readonly offboardPeople: (nbPeople: number) => Promise<void>,
    private callHandler: CallHandler,
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
    this.callHandler.subscribe(async () => {
      await this.handleQueue(this.callHandler.getQueue());
    });
  }

  async handleQueue(currentQueue: QueuedMessage[]) {
    const workingQueue = currentQueue
      .filter(({ status }) => status === MessageStatus.PENDING)
      .forEach(async (message) => {
        const { messageId, nbPeople, fromStage, toStage } = message;
        await this.convoy({ nbPeople, fromStage, toStage });
        this.callHandler.setStatus(messageId, MessageStatus.CONVOYED);
      });
  }

  onCall(message: ConvoyMessage) {
    this.callHandler.saveMessageToQueue(message);
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

    this.logger(`Move from ${fromStage} to ${toStage}`);
    await this.move(fromStage, toStage);

    this.logger(`Off-boarding ${nbPeople} people`);
    await this.offboardPeople(nbPeople);
  }
}
