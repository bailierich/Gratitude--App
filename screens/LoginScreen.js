import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { isSignInWithEmailLink, SignInMethod } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      className="w-full h-full"
      source={require("../images/2.png")}
    >
      <SafeAreaView className="flex-1 justify-center mx-11 ">
        <View className="flex-row justify-center">
          <Image
            className="h-64 w-64 mb-12"
            source={require("../images/GraciousAppLogo.png")}
          />
        </View>
        <View className="mt-28">
          <Text className="text-xl font-medium">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="text-lg mb-5"
            placeholder="Enter Your Email"
          />
          <Text className="text-xl font-medium">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            className="text-lg mb-5"
            placeholder="Enter Password"
          />
        </View>
        <TouchableOpacity
          className="flex-row justify-center bg-black p-2 my-5 rounded-md"
          onPress={() => signIn(email, password)}
        >
          <Text className="text-xl font-medium text-white">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-center"
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          <Text className="text-xl font-medium mt-2">Create An Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;
