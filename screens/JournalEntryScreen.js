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
  return <JournalEntry existingDoc={false} />;
};

export default JournalEntryScreen;
