import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigation } from "@react-navigation/native";

const HideKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const SettingsScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const incompleteForm = !name && !birthday;
  const userRef = collection(db, "users");
  const navigation = useNavigation();

  const saveUserData = () => {
    addDoc(userRef, {
      name: name,
      birthday: birthday,
      id: user.uid,
    });

    navigation.goBack();
  };

  return (
    <HideKeyboard>
      <View className="h-full" style={{ backgroundColor: "#fff8d6" }}>
        <SafeAreaView className=" mt-12 mx-6">
          <View className="flex-row justify-center mb-8">
            <Image
              className="h-36 w-36"
              source={require("../images/graciousInsigniaYellow-01.png")}
            />
          </View>

          <View className="flex-row justify-center">
            <Text className="text-5xl mb-2 font-bold">User Info</Text>
          </View>
          <View className="flex-row justify-center">
            <Text className="text-xl mb-14 font-base">
              Tell us a little about yourself
            </Text>
          </View>
          <View className="my-10 bg-white p-8 rounded-lg">
            <Text className="text-xl font-bold">Name</Text>
            <TextInput
              className="text-lg mb-10"
              placeholder="Enter Your Name"
              value={name}
              onChangeText={setName}
            />

            <Text className="text-xl font-bold">Birthday</Text>
            <TextInput
              className="text-lg"
              placeholder="MM/DD/YYYY"
              value={birthday}
              onChangeText={setBirthday}
            />
          </View>

          <View>
            <TouchableOpacity
              className={"flex-row justify-center p-2 my-5 rounded-md "}
              style={
                incompleteForm
                  ? { backgroundColor: "#ffee99" }
                  : { backgroundColor: "#e0ac00" }
              }
              disabled={incompleteForm}
              onPress={saveUserData}
            >
              <Text className="text-xl font-bold text-white"> Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </HideKeyboard>
  );
};

export default SettingsScreen;
