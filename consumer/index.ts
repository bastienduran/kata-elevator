import { Kafka } from "kafkajs";

/************************************* DO NOT MODIFY **********************************/

// Number of people convoyed
let totalPeopleConvoyed = 0;
// Actual position of the elevator
let elevatorStage = 0;

// Move the elevator from given stage to target stage with 1 sec per stage.
const move = async (fromStage: number, toStage: number) => {
  setTimeout(() => {
    console.log(`Elevator moved from stage ${fromStage} to stage ${toStage}`);
    elevatorStage = toStage;
  }, 1 * Math.abs(fromStage - toStage) * 1000);
};

// The elevator take a pause of 1 sec to let people enter
const onboardPeople = async (nbPeople: number) => {
  setTimeout(() => {
    console.log(`${nbPeople} onboarded in the elevator`);
  }, 1 * 1000);
};

// The elevator take a pause of 1 sec to let people out
const offboardPeople = async (nbPeople: number) => {
  setTimeout(() => {
    console.log(`${nbPeople} offboarded from the elevator`);
    totalPeopleConvoyed += nbPeople;
  }, 1 * 1000);
};

/**************************************************************************************/

/********************************* EXERCISE STARTS HERE ****************************/

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
      console.log("Received: ", {
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
      const order = JSON.parse(message.value?.toString() || "");
      await move(order.fromStage, order.toStage);
    },
  });
};
run().catch(console.error);
