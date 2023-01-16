import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { SafeAreaView } from "react-native";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

const SignUpScreen = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const incompleteForm = !name || !email || !password || !confirmPassword;
  const passwordsMatch = password === confirmPassword;
  let showMessage = false;

  const { signUp, user } = useAuth();

  /*  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: name,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("name has saved");
      })
      .catch((error) => {
        alert(error.message);
      });
  }; */

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
      source={require("../images/2.png")}
    >
      <SafeAreaView className="flex-auto justify-center mx-11">
        <View className="flex-row justify-center">
          <Text className="text-5xl font-bold mb-10">Sign Up</Text>
        </View>
        <View>
          <Text className="text-xl font-bold">Name</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
          />
          <Text className="text-xl font-bold">Email</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text className="text-xl font-bold">Password</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Text className="text-xl font-bold">Confirm Password</Text>
          <TextInput
            className="text-lg mb-10"
            placeholder="Confirm Pasword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
          {showMessage && <Text> Passwords Dont Match</Text>}
        </View>

        <TouchableOpacity
          className={
            incompleteForm
              ? "flex-row justify-center bg-gray-500 p-2 my-5 rounded-md "
              : "flex-row justify-center bg-black p-2 my-5 rounded-md "
          }
          onPress={validateAndSignUp}
          disabled={incompleteForm}
        >
          <Text className="text-xl font-bold text-white"> Create Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignUpScreen;
