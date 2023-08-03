// Interface Imports
import { ProgressDataInterface } from "../../interfaces";

const progressCallback = (progressData: ProgressDataInterface) => {
  let percentageDone: number =
    100 - progressData?.total / progressData?.uploaded;

  percentageDone?.toFixed(2);

  console.log("percentageDone: ", percentageDone);
};

export { progressCallback };
