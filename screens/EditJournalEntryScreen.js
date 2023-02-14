import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { db } from "../firebase.config";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import JournalEntry from "../components/JournalEntry";

export default function EditJournalEntry() {
  const route = useRoute();
  const entryID = route.params.entryID;
  const JournalEntriesRef = collection(db, "journalentries");

  const docRef = doc(db, "journalentries", entryID);
  const q = query(JournalEntriesRef, where("id", "==", entryID));
  /*  const JournalEntriesRef = collection(db, "journalentries");
  const [editableEntry, setEditableEntry] = useState();
  const [entryText, setEntryText] = useState();
  
  
  const docRef = doc(db, "journalentries", entryID);
  const navigation = useNavigation();

  const q = query(JournalEntriesRef, where("id", "==", entryID));
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

  const getJournalEntry = async () => {
    const editableEntrySnapshot = await getDocs(q);

    return editableEntrySnapshot.docs.map((entry) => entry.data());
  };

  const editJournalEntry = () => {
    const newDisplayText = truncate(entryText, 100, true);
    const newData = {
      entry: entryText,
      displayEntry: newDisplayText,
    };

    updateDoc(docRef, newData)
      .then(() => {
        console.log("Entry Saved");
        navigation.navigate("Journal");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  console.log(entryID);
  useEffect(() => {
    getJournalEntry()
      .then((newData) => {
        setEditableEntry(newData);
        console.log("running");
        setEntryText(newData[0].entry);
      })
      .catch((error) => console.log(error));
  }, []); */

  return (
    <JournalEntry docRef={docRef} q={q} entryID={entryID} existingDoc={true} />
    /*  <SafeAreaView className=" h-full w-full relative">
      <ScrollView keyboardDismissMode="on-drag">
        <TextInput
          multiline={true}
          textAlignVertical="top"
          value={entryText}
          onChangeText={setEntryText}
          returnKeyType="done"
          className="mt-12 h-full mx-8"
        />
      </ScrollView>
      <View className="absolute bottom-0 h-24 w-full bg-black">
        <View className="flex-row mt-4 justify-between ml-11 mr-8 ">
          <Entypo name="dots-three-horizontal" size={35} color="#e0ac00" />
          <TouchableOpacity
            className="px-5 py-2 rounded-md"
            style={{ backgroundColor: "#e0ac00" }}
            onPress={editJournalEntry}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView> */
  );
}
