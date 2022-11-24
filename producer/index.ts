import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "elevator",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionalId: "uniqueProducerId",
});

const sendPayload = async (data: any) => {
  try {
    const message = JSON.stringify(data);
    await producer.send({
      topic: "elevator",
      messages: [{ key: "Hi!", value: message }],
    });
    console.log("Sending :", message);
  } catch (e) {
    console.error("Caught Error while sending:", e);
  }
};

const getRandomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomExceptMe = (min: number, max: number, me: number): number => {
  let res = getRandomIntBetween(min, max);
  if (res === me) {
    return getRandomExceptMe(min, max, me);
  } else {
    return res;
  }
};

const main = async () => {
  await producer.connect();
  let fromStage = 0;
  let toStage = 0;
  let cpt = 1;
  try {
    setInterval(async () => {
      cpt;
      fromStage = getRandomIntBetween(0, 10);
      toStage = getRandomExceptMe(0, 10, fromStage);
      await sendPayload({
        elevatorId: cpt++,
        fromStage: fromStage,
        toStage: toStage,
        nbPeople: getRandomIntBetween(1, 5),
      });
    }, getRandomIntBetween(5, 10) * 1000);
  } catch (e) {
    console.error(e);
  }
};

main();
