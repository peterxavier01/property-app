import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import Facilities from "@/components/Facilities";
import Gallery from "@/components/Gallery";
import Stats from "@/components/Stats";

import { getPropertyById } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/use-appwrite";

import icons from "@/constants/icons";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const windowHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Get status bar height cross-platform
  const getStatusBarHeight = () => {
    if (Platform.OS === "ios") {
      return insets.top;
    } else {
      // For Android, use StatusBar.currentHeight or fallback to insets.top
      return StatusBar.currentHeight || insets.top;
    }
  };

  const statusBarHeight = getStatusBarHeight();

  // Set status bar style when this screen is focused, reset when unfocused
  useFocusEffect(
    useCallback(() => {
      // Set translucent status bar when screen is focused
      StatusBar.setBarStyle("dark-content", true);
      StatusBar.setBackgroundColor("transparent", true);
      StatusBar.setTranslucent(true);

      return () => {
        // Reset to default when screen is unfocused
        StatusBar.setBarStyle("dark-content", true);
        StatusBar.setBackgroundColor("#ffffff", true);
        StatusBar.setTranslucent(false);
      };
    }, [])
  );

  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  if (loading || !property)
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );

  const {
    name,
    type,
    rating,
    facilities,
    reviews,
    image,
    agent,
    description,
    gallery,
  } = property;

  return (
    <View className="bg-white h-full">
      <ScrollView
        className=""
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 relative" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: image }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />

          <View
            className="absolute flex-row justify-between w-full px-5"
            style={{ marginTop: statusBarHeight + 10 }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.backArrow} className="size-7" />
            </TouchableOpacity>

            <View className="flex-row gap-5">
              <Image source={icons.heartBlack} className="size-7" />
              <Image source={icons.send} className="size-7" />
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <View>
            <Text className="text-2xl font-rubik-bold text-black-300">
              {name}
            </Text>

            <View className="flex-row items-center gap-2.5 my-4">
              <View className="bg-primary-100 px-2.5 py-1.5 rounded-[20px]">
                <Text className="uppercase text-primary-300 text-[10px] font-rubik-semibold">
                  {type}
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5">
                <Image source={icons.star} className="size-5" />
                <Text className="font-rubik-medium text-sm text-black-200">
                  {rating?.toFixed(1)} ({`${reviews?.length} reviews`})
                </Text>
              </View>
            </View>

            <Stats property={property} />
          </View>

          <View className="w-full h-px bg-primary-100 my-[30px]" />

          <View>
            <Text className="mb-4 text-xl font-rubik-semibold text-black-300">
              Agent
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-5">
                <Image
                  source={{ uri: agent.avatar }}
                  className="rounded-full size-[60px]"
                />
                <View className="gap-1">
                  <Text className="text-lg font-rubik-semibold text-black-300">
                    {agent.name}
                  </Text>
                  <Text className="text-sm text-black-200 font-rubik-medium">
                    Owner
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-5">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          <View className="my-[30px]">
            <Text className="mb-4 text-xl font-rubik-semibold text-black-300">
              Overview
            </Text>
            <Text className="text-black-200 text-base font-rubik">
              {description}
            </Text>
          </View>

          <View className="my-[30px]">
            <Text className="mb-4 text-xl font-rubik-semibold text-black-300">
              Facilities
            </Text>
            <Facilities facilities={facilities} />
          </View>

          {gallery && gallery.length !== 0 ? (
            <View className="my-[30px]">
              <Text className="mb-4 text-xl font-rubik-semibold text-black-300">
                Gallery
              </Text>
              <Gallery property={property} />
            </View>
          ) : null}

          <View className="my-[30px]">
            <Text className="mb-4 text-xl font-rubik-semibold text-black-300">
              Location
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Property;
