import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
  LayoutAnimation,
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LoadingScreen from "../components/LoadingScreen";
import { MaterialIcons } from "@expo/vector-icons";
import JournalAccordian from "../components/JournalAccordian";

const PastGratitudesScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const JournalEntriesRef = collection(db, "journalentries");
  const [journalEntries, setJournalEntries] = useState([]);
  const navigation = useNavigation();
  const [filterNewest, setFilterNewest] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [openMonth, setOpenMonth] = useState(); // create function to get most recent month

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpanded((expanded) => !expanded);
  };

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

  const getEntriesFromFireB = async () => {
    const entrySnapshot = await getDocs(q);

    return entrySnapshot.docs.map((entry) => entry.data());
  };
  const refreshList = () => {
    getEntriesFromFireB()
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

  useFocusEffect(
    React.useCallback(() => {
      getEntriesFromFireB()
        .then((newData) => {
          const result = newData.reduce((accum, current) => {
            let dateGroup = accum.find(
              (x) => x.monthYear === current.monthYear
            );
            if (!dateGroup) {
              dateGroup = { monthYear: current.monthYear, data: [] };
              accum.push(dateGroup);
            }
            dateGroup.data.push(current);
            return accum;
          }, []);

          let result1 = result.reverse();

          for (let i = 0; i < result1.length; i++) {
            const month = result1[i];
            filterNewest
              ? month.data.sort((e1, e2) =>
                  e1.day < e2.day ? 1 : e1.day > e2.day ? -1 : 0
                )
              : month.data.sort((e1, e2) =>
                  e1.day > e2.day ? 1 : e1.day < e2.day ? -1 : 0
                );
          }
          setJournalEntries(result1);
          console.log("run");
        })
        .catch((error) => {
          console.log(error);
        });
    }, [])
  );

  useEffect(() => {
    getEntriesFromFireB()
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

        let result1 = result.reverse();

        for (let i = 0; i < result1.length; i++) {
          const month = result1[i];
          filterNewest
            ? month.data.sort((e1, e2) =>
                e1.day < e2.day ? 1 : e1.day > e2.day ? -1 : 0
              )
            : month.data.sort((e1, e2) =>
                e1.day > e2.day ? 1 : e1.day < e2.day ? -1 : 0
              );
        }
        setOpenMonth(result1[0].monthYear);
        setExpanded(true);
        setJournalEntries(result1);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [filterNewest]);

  return journalEntries ? (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-row justify-center my-10 ">
        <Text className="text-2xl absolute font-bold">Journal</Text>
      </View>
      <View className="flex-row pl-6 justify-between pr-6 mt-5">
        <View className>
          {filterNewest ? (
            <TouchableOpacity
              className="pl-4 pr-4 pt-2 pb-2 flex-row rounded-lg items-center"
              style={{ backgroundColor: "black" }}
              onPress={() => setFilterNewest(!filterNewest)}
            >
              <Text className="text-white">Newest</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="pl-4 pr-4 pt-2 pb-2 flex-row rounded-lg"
              style={{ backgroundColor: "black" }}
              onPress={() => setFilterNewest(!filterNewest)}
            >
              <Text className="text-white">Oldest</Text>
              <MaterialIcons name="keyboard-arrow-up" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Journal Entry")}
          className="flex-row align-middle"
        >
          <AntDesign name="addfile" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <SectionList
        contentContainerStyle={{ marginBottom: 10, paddingVertical: 10 }}
        sections={journalEntries}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View>
            {expanded && item.monthYear === openMonth && (
              <TouchableOpacity
                onPress={() => {
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
                    borderColor: "#E2C854",
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
                        borderColor: "#E2C854",
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
            )}
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View
            className="m-5 p-2 rounded-lg"
            style={{ backgroundColor: "#E2C854" }}
          >
            <TouchableOpacity
              className="flex-row justify-between items-center m-2"
              onPress={() => {
                setOpenMonth(section.monthYear);
                toggleExpand();
              }}
            >
              <Text className="text-lg font-bold text-center">
                {section.monthYear}
              </Text>
              <AntDesign
                name={expanded ? "upcircle" : "downcircle"}
                color="white"
                size={24}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

export default PastGratitudesScreen;
