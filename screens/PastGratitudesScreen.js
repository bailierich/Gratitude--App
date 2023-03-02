import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(false);
  const JournalEntriesRef = collection(db, "journalentries");
  const [journalEntries, setJournalEntries] = useState([]);
  const navigation = useNavigation();

  const q = query(JournalEntriesRef, where("userID", "==", user.uid));
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

  const getEntries = async () => {
    const entrySnapshot = await getDocs(q);

    return entrySnapshot.docs.map((entry) => entry.data());
  };
  const refreshList = () => {
    getEntries()
      .then((newData) => {
        console.log(newData);
        const result = newData.reduce((accum, current) => {
          let dateGroup = accum.find((x) => x.monthYear === current.monthYear);
          if (!dateGroup) {
            dateGroup = { monthYear: current.monthYear, data: [] };
            accum.push(dateGroup);
          }
          dateGroup.data.push(current);
          return accum;
        }, []);
        console.log(result);
        setJournalEntries(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getEntries()
      .then((newData) => {
        console.log(newData);
        const result = newData.reduce((accum, current) => {
          let dateGroup = accum.find((x) => x.monthYear === current.monthYear);
          if (!dateGroup) {
            dateGroup = { monthYear: current.monthYear, data: [] };
            accum.push(dateGroup);
          }
          dateGroup.data.push(current);
          return accum;
        }, []);
        console.log(result);

        /*   result.forEach(dateGroup => {
          dateGroup.data.sort()
          
        }); */
        setJournalEntries(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-row justify-center my-10 ">
        <Text className="text-2xl absolute font-bold">Journal</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Journal Entry")}
          className="left-40"
        >
          <AntDesign name="addfile" size={24} color="#e0ac00" />
        </TouchableOpacity>
      </View>

      <SectionList
        contentContainerStyle={{ marginBottom: 10, paddingVertical: 10 }}
        sections={journalEntries}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              onLongPress={() => {
                navigation.navigate(
                  "Edit Entry",

                  { entryID: item.id }
                );
              }}
            >
              <View
                className="p-4 m-5 rounded-lg"
                style={{
                  backgroundColor: "#FCEFB4",
                  borderColor: "#e0ac00",
                  borderWidth: 0.1,
                }}
              >
                <View className="flex-row rounded-lg  justify-start">
                  <View
                    className="flex-row items-center p-3 mb-2"
                    style={{
                      color: "black",
                      borderRadius: 12,
                      backgroundColor: "#FDF8E1",
                      overflow: "hidden",
                      borderColor: "#e0ac00",
                      borderWidth: 0.1,
                    }}
                  >
                    <Feather name="calendar" size={20} color="#E2C854" />
                    <Text className="ml-2 ">{item.date}</Text>
                  </View>
                </View>
                <Text className="m-2">{item.displayEntry}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View
            className="m-5 p-2 rounded-lg"
            style={{ backgroundColor: "#E2C854" }}
          >
            <Text className="text-lg font-bold text-center">
              {section.monthYear}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default PastGratitudesScreen;
