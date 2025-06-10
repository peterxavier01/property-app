import { FlatList, Image } from "react-native";
import { Models } from "react-native-appwrite";

const Gallery = ({ property }: { property: Models.Document }) => {
  return (
    <FlatList
      data={property?.gallery}
      keyExtractor={(item) => item.$id}
      horizontal
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.image }}
          className="size-[118px] rounded-[10px]"
          resizeMode="cover"
        />
      )}
      contentContainerClassName="gap-[17px]"
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Gallery;
