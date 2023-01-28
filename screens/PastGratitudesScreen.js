import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigation } from "@react-navigation/native";

const PastGratitudesScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const JournalEntriesRef = collection(db, "journalentries");
  const [journalEntries, setJournalEntries] = useState([]);
  const navigation = useNavigation();

  const q = query(JournalEntriesRef, where("id", "==", user.uid));

  const getEntries = async () => {
    const entrySnapshot = await getDocs(q);

    return entrySnapshot.docs.map((entry) => entry.data());
  };

  useLayoutEffect(() => {
    getEntries()
      .then((newData) => {
        console.log(newData);
        const result = newData.reduce((accum, current) => {
          let dateGroup = accum.find((x) => x.monthYear === current.monthYear);
          if (!dateGroup) {
            dateGroup = { monthYear: current.monthYear, entries: [] };
            accum.push(dateGroup);
          }
          dateGroup.entries.push(current);
          return accum;
        }, []);
        console.log(result);
        setJournalEntries(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
