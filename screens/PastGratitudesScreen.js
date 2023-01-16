import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import { collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

const PastGratitudesScreen = () => {
  const { user } = useAuth();
  const JournalEntriesRef = collection(db, "journalentries");
  const [journalEntries, setJournalEntries] = useState("");

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView>
        <View className="flex-row justify-center my-10 ">
          <Text className="text-2xl absolute font-bold">Journal</Text>
          <View className="left-40">
            <AntDesign name="addfile" size={24} color="black" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PastGratitudesScreen;
