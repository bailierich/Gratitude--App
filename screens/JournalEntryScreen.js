import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { collection } from "firebase/firestore";
import { db } from "../firebase.config";
import { Entypo } from "@expo/vector-icons";

const JournalEntryScreen = () => {
  const [entry, setEntry] = useState();
  const { user } = useAuth();
  const JournalEntriesRef = collection(db, "journalentries");

  return (
    <SafeAreaView className=" h-full w-full relative">
      <ScrollView keyboardDismissMode="on-drag">
        <TextInput
          multiline={true}
          textAlignVertical="top"
          returnKeyType="done"
          className="mt-12 h-5/6 mx-8"
          placeholder="What do you need to say..."
        />
      </ScrollView>
      <View className="absolute bottom-0 h-24 w-full bg-black">
        <View className="flex-row mt-4 justify-between ml-11 mr-8 ">
          <Entypo name="dots-three-horizontal" size={35} color="white" />
          <TouchableOpacity className="px-5 py-2 rounded-md bg-white">
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JournalEntryScreen;
