import { View, Text, Image } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import LottieView from "lottie-react-native";

const LoadingScreen = () => {
  const { user } = useAuth();
  return (
    <View
      className="flex-1 justify-center"
      style={{ backgroundColor: "#ffdd32" }}
    >
      <View className="flex-row justify-center">
        <Image
          className="h-48 w-48"
          source={require("../images/GraciousAppLogo.png")}
        />
      </View>
    </View>
  );
};

export default LoadingScreen;
