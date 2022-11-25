// import { promisify } from "node:util";
import { Kafka } from "kafkajs";
import { ConvoyMessage } from "../Elevator/Domain/ConvoyMessage";
import { OtisLeScribe } from "../Elevator/OtisLeScribe/OtisLeScribe";
import { getTotalPeopleConvoyed } from "./functions";

// /************************************* DO NOT MODIFY **********************************/

// const delay = promisify(setTimeout);

// // Number of people convoyed
// let totalPeopleConvoyed = 1;
// // Actual position of the elevator
// let elevatorStage = 0;

// // Move the elevator from given stage to target stage with 1 sec per stage.
// const move = async (fromStage: number, toStage: number) => {
//   await delay(1 * Math.abs(fromStage - toStage) * 1000);
//   console.log(`Elevator moved from stage ${fromStage} to stage ${toStage}`);
//   elevatorStage = toStage;
// };

// // The elevator take a pause of 1 sec to let people enter
// const onboardPeople = async (nbPeople: number) => {
//   await delay(1 * 1000);
//   console.log(`${nbPeople} onboarded in the elevator`);
// };

// // The elevator take a pause of 1 sec to let people out
// const offboardPeople = async (nbPeople: number) => {
//   await delay(1 * 1000);
//   console.log(`${nbPeople} offboarded from the elevator`);
//   totalPeopleConvoyed += nbPeople;
// };

// /**************************************************************************************/

// /********************************* EXERCISE STARTS HERE ****************************/

// export const getTotalPeopleConvoyed = () => totalPeopleConvoyed;
// export const getElevatorStage = () => elevatorStage;

// Example of event handling with Kafka
const kafka = new Kafka({
  clientId: "elevator",
  brokers: ["localhost:29092"],
});

const consumer = kafka.consumer({ groupId: "elevator" });
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "elevator", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log("Received: ", {
      //   partition,
      //   offset: message.offset,
      //   value: message.value?.toString(),
      // });
      const { messageId, fromStage, toStage, nbPeople }: ConvoyMessage =
        JSON.parse(message.value?.toString() || "");
      // await move(order.fromStage, order.toStage);
      const elevator = new OtisLeScribe();
      await elevator.convoy({ messageId, nbPeople, fromStage, toStage });
      console.log(`Total convoyed people: ${getTotalPeopleConvoyed()}`);
    },
  });
};
run().catch(console.error);
