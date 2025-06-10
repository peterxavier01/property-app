import icons from "@/constants/icons";
import { ImageSourcePropType } from "react-native";

const facilityIconMap: Record<string, string> = {
  Laundry: icons.laundry,
  "Car Parking": icons.carPark,
  "Sports Center": icons.run,
  Cutlery: icons.cutlery,
  Gym: icons.dumbell,
  "Swimming Pool": icons.swim,
  Wifi: icons.wifi,
  "Pet Center": icons.dog,
};

export function getFacilityIcon(facility: string) {
  return facilityIconMap[facility] as ImageSourcePropType;
}
