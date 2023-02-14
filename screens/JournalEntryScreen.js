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
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuid } from "uuid";
import JournalEntry from "../components/JournalEntry";

const JournalEntryScreen = () => {
  /*   const [entry, setEntry] = useState();
  const { user } = useAuth();
  const JournalEntriesRef = collection(db, "journalentries");
  const navigation = useNavigation();

  const d = new Date();
  const date = d.toLocaleDateString();
  const month = d.getMonth();
  const year = d.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const truncate = (str, n, useWordBoundary) => {
    if (str.length <= n) {
      return str.slice(0, str.lastIndexOf(" "));
    }
    const substring = str.slice(0, n - 1);

    return (
      (useWordBoundary
        ? substring.slice(0, substring.lastIndexOf(" "))
        : substring) + "..."
    );
  };
  const addJournalEntries = () => {
    const displayEntry = truncate(entry, 100, true);
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 8);

    setDoc(doc(db, "journalentries", small_id), {
      userID: user.uid,
      date: date,
      Year: year,
      entry: entry,
      month: monthNames[month],
      monthYear: monthNames[month] + " - " + year,
      displayEntry: displayEntry,
      id: small_id,
    })
      .then(() => {
        console.log("Entry Saved");
        navigation.navigate("Journal");
      })
      .catch((error) => {
        alert(error.message);
      });
  }; */

  return (
    <JournalEntry existingDoc={false} />

    /*  <SafeAreaView className=" h-full w-full relative">
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
          <Entypo name="dots-three-horizontal" size={35} color="#e0ac00" />
          <TouchableOpacity
            className="px-5 py-2 rounded-md"
            style={{ backgroundColor: "#e0ac00" }}
            onPress={addJournalEntries}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView> */
  );
};

export default JournalEntryScreen;
