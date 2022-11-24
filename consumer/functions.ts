import { promisify } from "node:util";

/************************************* DO NOT MODIFY **********************************/

const delay = promisify(setTimeout);

// Number of people convoyed
let totalPeopleConvoyed = 0;
// Actual position of the elevator
let elevatorStage = 0;

// Move the elevator from given stage to target stage with 1 sec per stage.
export const move = async (fromStage: number, toStage: number) => {
  await delay(1 * Math.abs(fromStage - toStage) * 1000);
  console.log(`Elevator moved from stage ${fromStage} to stage ${toStage}`);
  elevatorStage = toStage;
};

// The elevator take a pause of 1 sec to let people enter
export const onboardPeople = async (nbPeople: number) => {
  await delay(1 * 1000);
  console.log(`${nbPeople} onboarded in the elevator`);
};

// The elevator take a pause of 1 sec to let people out
export const offboardPeople = async (nbPeople: number) => {
  await delay(1 * 1000);
  console.log(`${nbPeople} offboarded from the elevator`);
  totalPeopleConvoyed += nbPeople;
};

/**************************************************************************************/

/********************************* EXERCISE STARTS HERE ****************************/

export const getTotalPeopleConvoyed = () => totalPeopleConvoyed;
export const getElevatorStage = () => elevatorStage;
