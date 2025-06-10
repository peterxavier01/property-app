import { Image, ImageSourcePropType, Text, View } from "react-native";
import { Models } from "react-native-appwrite";

import icons from "@/constants/icons";

const Stat = ({
  icon,
  value,
}: {
  icon: ImageSourcePropType;
  value: string;
}) => {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className="bg-primary-100 size-10 items-center justify-center rounded-full p-3">
        <Image source={icon} className="size-4" />
      </View>
      <Text className="text-sm font-rubik-medium text-black-300">{value}</Text>
    </View>
  );
};

const Stats = ({ property }: { property: Models.Document }) => {
  return (
    <View className="flex-row flex-wrap gap-6">
      <Stat icon={icons.bed} value={`${property.bedrooms} beds`} />
      <Stat icon={icons.bath} value={`${property.bathrooms} bath`} />
      <Stat icon={icons.area} value={`${property.area} sqft`} />
    </View>
  );
};

export default Stats;
