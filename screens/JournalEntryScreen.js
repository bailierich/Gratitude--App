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
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const JournalEntryScreen = () => {
  const [entry, setEntry] = useState();
  const { user } = useAuth();
  const JournalEntriesRef = collection(db, "journalentries");
  const navigation = useNavigation();

  const d = new Date();
  const date = d.toLocaleDateString();
  const month = d.getMonth();
  const year = d.getFullYear();
  const monthYear = month + 1 + "/" + year;

  const addJournalEntries = () => {
    addDoc(JournalEntriesRef, {
      id: user.uid,
      date: date,
      monthYear: monthYear,
      entry: entry,
    })
      .then(() => {
        console.log("Entry Saved");
        navigation.navigate("Journal");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView className=" h-full w-full relative">
      <ScrollView keyboardDismissMode="on-drag">
        <TextInput
          multiline={true}
          textAlignVertical="top"
          value={entry}
          onChangeText={setEntry}
          returnKeyType="done"
          className="mt-12 h-96 mx-8"
          placeholder="What do you need to say..."
        />
      </ScrollView>
      <View className="absolute bottom-0 h-24 w-full bg-black">
        <View className="flex-row mt-4 justify-between ml-11 mr-8 ">
          <Entypo name="dots-three-horizontal" size={35} color="white" />
          <TouchableOpacity
            className="px-5 py-2 rounded-md bg-white"
            onPress={addJournalEntries}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JournalEntryScreen;
