import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import { collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigation } from "@react-navigation/native";

const PastGratitudesScreen = () => {
  const { user } = useAuth();
  const JournalEntriesRef = collection(db, "journalentries");
  const [journalEntries, setJournalEntries] = useState("");
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <View className="flex-row justify-center my-10 ">
          <Text className="text-2xl absolute font-bold">Journal</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Journal Entry")}
            className="left-40"
          >
            <AntDesign name="addfile" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PastGratitudesScreen;
