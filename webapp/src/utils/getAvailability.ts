import {ChargePointEvseStatusResponse, ChargePointEvseStatusType} from "@/models/chargePointEvse";

export const getAvailability = (status: ChargePointEvseStatusResponse | undefined): AvailabilityEnum => {
  if (!status) return AvailabilityEnum.UNAVAILABLE;
  if (status.deviceStatus.status === ChargePointEvseStatusType.AVAILABLE && status.availabilityStatus.available) return AvailabilityEnum.AVAILABLE;
  else return AvailabilityEnum.CHARGING;
}

export enum AvailabilityEnum  {
  AVAILABLE = 'AVAILABLE',
  CHARGING = 'CHARGING',
  UNAVAILABLE = 'UNAVAILABLE'
}
