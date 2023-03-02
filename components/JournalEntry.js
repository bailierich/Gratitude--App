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
import Prompt from "./Prompt";
import { v4 as uuid } from "uuid";
import useAuth from "../hooks/useAuth";

const JournalEntry = (props) => {
  const { user } = useAuth();
  const promptData = [
    {
      key: "1",
      title: "SOAP Bible Study Prompt",
      mainText:
        "Scripture - Write down the scripture. \nObserve - What do you see in the verses your reading. \nApplication - How can you apply this reading personally. \nPrayer - Pray about it, take God's word back to him.  .",
      promptType: "SOAP",
    },
    {
      key: "2",
      title: "Self Reflection Prompt",
      mainText:
        "dive deeper into yourself and gain a better understanding of who you are and who you want to be",
      promptType: "JournalPrompt",
    },
    {
      key: "3",
      title: "Reflect On a Scripture",
      mainText: "Dive Deeper Into Gods Word",
      promptType: "ScriptureReflect",
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
    if (promptType == "SOAP") {
      const newText =
        "S: " +
        soapScripture +
        "\nO: " +
        soapObservation +
        "\nA: " +
        soapApplication +
        "\nP: " +
        soapPrayer;

      const displayEntry = truncate(newText, 100, true);
      const unique_id = uuid();
      const small_id = unique_id.slice(0, 8);

      setDoc(doc(db, "journalentries", small_id), {
        userID: user.uid,
        date: date,
        Year: year,
        entry: newText,
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
    } else {
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
    }
  };

  // function for creating prompt(s)
  const isDailyVersePrompt = props.isDailyVersePrompt;
  const [modalVisable, setModalVisable] = useState(false);

  const [hasSelectedPrompt, setHasSelectedPrompt] = useState(false);

  const [promptType, setPromptType] = useState();

  const showBlankDoc = !hasSelectedPrompt && !isDailyVersePrompt;

  const [savedScripture, setSavedScripture] = useState();
  const [soapScripture, setSoapScripture] = useState();
  const [soapObservation, setSoapObservation] = useState();
  const [soapApplication, setSoapApplication] = useState();
  const [soapPrayer, setSoapPrayer] = useState();

  const [selfReflectPrompt, setSelfReflectPrompt] = useState();
  const [randomBibleVerse, setRandomBibleVerse] = useState();

  // validation
  let enableButton = true;

  if (hasSelectedPrompt) {
    if (promptType == "SOAP") {
      enableButton =
        soapScripture || soapApplication || soapObservation || soapPrayer;
    } else {
      if (entry) {
        enableButton = false;
      }
    }
  } else {
    if (entry) {
      enableButton = false;
    }
  }
  console.log(selfReflectPrompt);
  console.log(promptType);
  console.log(soapPrayer);

  const handlePromptSelection = (promptType) => {
    setPromptType(promptType);
    setModalVisable(!modalVisable);
    setHasSelectedPrompt(true);
  };
  console.log(promptType);

  return !props.existingDoc ? (
    <View className="bg-white">
      <SafeAreaView className=" h-full w-full relative">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisable}
          onRequestClose={() => {
            setModalVisable(!modalVisable);
          }}
        >
          <SafeAreaView
            className="justify-center flex-1 "
            style={{ borderColor: "CDB64C", borderStyle: "solid" }}
          >
            <View
              className=" mt-10 mx-3 rounded-xl h-3/4"
              style={{ backgroundColor: "#FDF8E1" }}
            >
              <View className="px-5 mt-5">
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisable(!modalVisable);
                    }}
                  >
                    <AntDesign name="closecircle" size={30} color="#CDB64C" />
                  </TouchableOpacity>
                </View>
                <Text className="text-center font-bold text-2xl m-5">
                  Choose A Prompt
                </Text>
                {/* GOING TO IMPLEMENT ACCORDIAN HERE */}
                {promptData.map((data) => {
                  return (
                    <Accordian
                      key={data.key}
                      title={data.title}
                      mainText={data.mainText}
                      handleOnClick={handlePromptSelection}
                      promptType={data.promptType}
                    />
                  );
                })}
              </View>
            </View>
          </SafeAreaView>
        </Modal>

        {isDailyVersePrompt && (
          <Prompt
            verse={verse}
            scripture={scripture}
            entry={entry}
            setEntry={setEntry}
          />
        )}

        {hasSelectedPrompt && (
          <Prompt
            promptType={promptType}
            entry={entry}
            setEntry={setEntry}
            soapScripture={soapScripture}
            setSoapScripture={setSoapScripture}
            soapObservation={soapObservation}
            setSoapObservation={setSoapObservation}
            soapApplication={soapApplication}
            setSoapApplication={setSoapApplication}
            soapPrayer={soapPrayer}
            setSoapPrayer={setSoapPrayer}
            setSelfReflectPrompt={setSelfReflectPrompt}
            selfReflectPrompt={selfReflectPrompt}
          />
        )}

        {showBlankDoc && (
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
        )}

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
              disabled={enableButton}
            >
              <Text className="text-black font-bold text-base">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
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
            style={{ backgroundColor: "white" }}
            onPress={editJournalEntry}
            disabled={enableButton}
          >
            <Text className="text-black font-bold text-base">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JournalEntry;
