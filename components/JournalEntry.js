import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Accordian from "./Accordian";
const JournalEntry = (props) => {
  const promptData = [
    {
      title: "SOAP Bible Study Prompt",
      mainText:
        "Scripture Read and write down the scripture as per the verse of the day following this SOAP guide. Observation Pray the prayer “God, why did You write this?” Write down what you hear. Application Pray and ask “God how would You like me to apply this verse into my life?” Write down what you hear.  Prayer Write out a prayer to God based on what you just learned and ask him to help you apply this truth in your life.",
    },
    {
      title: "Self Reflection Prompt",
      mainText:
        "dive deeper into yourself and gain a better understanding of who you are and who you want to be",
    },
    {
      title: "Reflect On a Scripture",
      mainText: "Dive Deeper Into Gods Word",
    },
  ];

  // still kind of confused as to if i should raise the state up higher than this

  const [entry, setEntry] = useState();

  const [editableEntry, setEditableEntry] = useState();
  const [entryText, setEntryText] = useState();

  // these route params are going to be moved

  const entryID = props.entryID;

  const verse = props.verse;
  const scripture = props.scripture;

  const docRef = props.docRef;
  const q = props.q;

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

  //functions for editing a journal entry

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
    if (entryID) {
      getJournalEntry()
        .then((newData) => {
          setEditableEntry(newData);
          console.log("running");
          setEntryText(newData[0].entry);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  //functions for adding a new journal entry

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
  };

  // function for creating prompt(s)
  const isDailyVersePrompt = props.isDailyVersePrompt;
  const [modalVisable, setModalVisable] = useState(false);

  const [hasSelectedPrompt, setHasSelectedPrompt] = useState(false);

  const [promptType, setPromptType] = useState();

  return !props.existingDoc ? (
    <SafeAreaView className=" h-full w-full relative">
      <ScrollView keyboardDismissMode="on-drag">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisable}
          onRequestClose={() => {
            setModalVisable(!modalVisable);
          }}
        >
          <SafeAreaView className="justify-center  flex-1 ">
            <View
              className=" mt-10 mx-3 rounded-xl h-3/4"
              style={{ backgroundColor: "#FFFAEB" }}
            >
              <View className="px-5 mt-5">
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisable(!modalVisable);
                    }}
                  >
                    <AntDesign name="closecircle" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <Text className="text-center font-bold text-lg">
                  Choose A Prompt
                </Text>
                {/* GOING TO IMPLEMENT ACCORDIAN HERE */}
                {promptData.map((data) => {
                  return (
                    <Accordian title={data.title} mainText={data.mainText} />
                  );
                })}

                {/*  <View className="  mt-5">
                  <Text className="font-semibold">
                    The SOAP Bible Study Method
                  </Text>

                  <Text className="mt-3 text-xs">
                    Scripture Read and write down the scripture as per the verse
                    of the day following this SOAP guide. Observation Pray the
                    prayer “God, why did You write this?” Write down what you
                    hear. Application Pray and ask “God how would You like me to
                    apply this verse into my life?” Write down what you hear.
                    Prayer Write out a prayer to God based on what you just
                    learned and ask him to help you apply this truth in your
                    life.
                  </Text>
                  <TouchableOpacity className="bg-black mt-5 p-2 rounded-lg">
                    <Text className=" text-center text-white">Select</Text>
                  </TouchableOpacity>
                </View>
                <View className="  mt-5">
                  <Text className="font-semibold">Self Reflection Prompt</Text>

                  <Text className="mt-3 text-xs">
                    Dive deeper into yourself and who you are as a person.
                  </Text>
                  <TouchableOpacity className="bg-black mt-5 p-2 rounded-lg">
                    <Text className=" text-center text-white">Select</Text>
                  </TouchableOpacity>
                </View>
                <View className="  mt-5">
                  <Text className="font-semibold">Reflect On A Scripture</Text>

                  <Text className="mt-3 text-xs">
                    Dive deeper into yourself and who you are as a person.
                  </Text>
                  <TouchableOpacity className="bg-black mt-5 p-2 rounded-lg">
                    <Text className=" text-center text-white">Select</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {isDailyVersePrompt && (
          <Prompt promptType={promptType} verse={verse} scripture={scripture} />
        )}

        {hasSelectedPrompt ? (
          <Prompt promptType={promptType} entry={entry} setEntry={setEntry} />
        ) : (
          <TextInput
            multiline={true}
            textAlignVertical="top"
            value={entry}
            onChangeText={setEntry}
            returnKeyType="done"
            className="mt-12 h-96 mx-8"
            placeholder="What do you need to say..."
          />
        )}
      </ScrollView>
      <View
        className="absolute bottom-0 h-24 w-full"
        style={{ backgroundColor: "#CDB64C" }}
      >
        <View className="flex-row mt-4 justify-between ml-11 mr-8 ">
          <TouchableOpacity>
            <Entypo
              name="dots-three-horizontal"
              size={35}
              color="white"
              onPress={() => setModalVisable(true)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="px-5 py-2 rounded-md"
            style={{ backgroundColor: "white" }}
            onPress={addJournalEntries}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView className=" h-full w-full relative">
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
      <View
        className="absolute bottom-0 h-24 w-full"
        style={{ backgroundColor: "#CDB64C" }}
      >
        <View className="flex-row mt-4 justify-end ml-11 mr-8 ">
          <TouchableOpacity
            className="px-5 py-2 rounded-md"
            style={{ backgroundColor: "#e0ac00" }}
            onPress={editJournalEntry}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JournalEntry;
