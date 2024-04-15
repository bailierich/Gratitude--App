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

  return (
    <JournalEntry docRef={docRef} q={q} entryID={entryID} existingDoc={true} />
  );
}
