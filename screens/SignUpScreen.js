import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { SafeAreaView } from "react-native";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const navigation = useNavigation();

  const incompleteForm = !name || !email || !password || !confirmPassword;
  const passwordsMatch = password === confirmPassword;
  let showMessage = false;

  const { signUp, user } = useAuth();

  const validateAndSignUp = () => {
    if (passwordsMatch) {
      signUp(email, password);
      // updateUserProfile();
    } else {
      showMessage = true;
    }
  };

  return (
    <ImageBackground
      className="w-full h-full"
      source={require("../images/gradient.png")}
    >
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-auto justify-center mx-11"
      >
        <View className="flex-row justify-center">
          <Text className="text-5xl font-bold mb-10">Sign Up</Text>
        </View>
        <View>
          <Text className="text-xl font-medium">Name</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={"gray"}
          />
          <Text className="text-xl font-medium">Email</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={"gray"}
          />
          <Text className="text-xl font-medium">Password</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholderTextColor={"gray"}
          />
          <Text className="text-xl font-medium">Confirm Password</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Confirm Pasword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholderTextColor={"gray"}
          />
          {showMessage && <Text> Passwords Dont Match</Text>}
        </View>

        <TouchableOpacity
          className={
            incompleteForm
              ? "flex-row justify-center bg-gray-300 p-2 my-5 rounded-md "
              : "flex-row justify-center bg-black p-2 my-5 rounded-md "
          }
          onPress={validateAndSignUp}
          disabled={incompleteForm}
        >
          <Text className="text-xl font-bold text-white"> Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row justify-center"
        >
          <Text className="text-lg font-medium mt-2">
            Already Have An Account?
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUpScreen;
