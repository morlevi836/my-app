import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const index = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-red-500 text-[100px]">index</Text>
      <StatusBar style="auto" />
      <Link href="profile" style={{ color: "blue" }}>
        Go to profile
      </Link>
    </View>
  );
};

export default index;
