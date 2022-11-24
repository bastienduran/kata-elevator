import { ConvoyMessage } from "./Domain";
import { Elevator } from "./Elevator";
import { QueueRepository } from "./Repository/QueueRepository";

export class OtisLeScribe implements Elevator {
  constructor(
    private move: (fromStage: number, toStage: number) => Promise<void>,
    private onboardPeople: (nbPeople: number) => Promise<void>,
    private offboardPeople: (nbPeople: number) => Promise<void>,
    private queueRepository: QueueRepository,
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

  async start() {
    if (this.queueRepository.getQueue().length) {
      await this.convoy(this.queueRepository.getQueue()[0]);
    }
    this.logger("No one to convoy. Waiting for calls...");
  }

  private async convoy({ nbPeople, fromStage, toStage }: ConvoyMessage) {
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

  async onMessage(message: ConvoyMessage) {
    this.queueRepository.saveMessageToQueue(message);

    const currentQueue = this.queueRepository.getQueue();
    if (currentQueue) {
      //handle first message
      await this.convoy(currentQueue[0]);
      //delete message in queue
      this.queueRepository.setConvoyed(message.messageId);
    }
  }
}
