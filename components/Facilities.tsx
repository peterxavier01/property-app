import { Image, Text, View } from "react-native";

import { getFacilityIcon } from "@/lib/utils";

const Facilities = ({ facilities }: { facilities: string[] }) => {
  return (
    <View className="flex-row flex-wrap gap-6">
      {facilities.map((item: string, index: number) => (
        <View key={index} className="items-center gap-1.5 w-max">
          <View className="bg-primary-100 size-[60px] items-center justify-center rounded-full p-3">
            <Image source={getFacilityIcon(item)} className="size-7" />
          </View>
          <Text
            numberOfLines={1}
            className="text-sm font-rubik text-black-300 w-full text-center"
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Facilities;
