// import { useGlobalContext } from "@/lib/global-provider";

import { Redirect } from "expo-router";

export default function Index() {
  // const { loading, isLoggedIn } = useGlobalContext();

  // if (loading) {
  //   return (
  //     <SafeAreaView className="bg-white h-full flex justify-center items-center">
  //       <ActivityIndicator className="text-primary-300" size="large" />
  //     </SafeAreaView>
  //   );
  // }

  // if (isLoggedIn) {
  //   return <Redirect href="/(root)/(tabs)" />;
  // }

  // return <Redirect href="/sign-in" />;

  return <Redirect href="/(root)/(tabs)" />;
}
