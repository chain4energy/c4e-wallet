import {airDrop, AirDropRes} from "@/models/airdrop/airdrop";

export function mapAirDrop(airDrop: airDrop| undefined): airDrop  {
  if (airDrop === undefined) {
    throw new Error('mapAirDrop - airDrop absent');
  }
  return airDrop;
}
