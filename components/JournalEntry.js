import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const JournalEntry = (props) => {
  // still kind of confused as to if i should raise the state up higher than this

  const [entry, setEntry] = useState();
  const JournalEntriesRef = collection(db, "journalentries");
  const [editableEntry, setEditableEntry] = useState();
  const [entryText, setEntryText] = useState();
  const route = useRoute();
  const entryID = route.params.entryID;
  const verse = route.params.verse;
  const scripture = route.params.scripture;
  const docRef = doc(db, "journalentries", entryID);
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
    getJournalEntry()
      .then((newData) => {
        setEditableEntry(newData);
        console.log("running");
        setEntryText(newData[0].entry);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(editableEntry);

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
  const [isDailyVersePrompt, setDailyVersePrompt] = useState(
    props.isDailyVersePrompt
  );
  const [hasSelectedPrompt, setHasSelectedPrompt] = useState(false);

  const [promptType, setPromptType] = (useState = useState());

  return !props.existingDoc ? (
    <SafeAreaView className=" h-full w-full relative">
      <ScrollView keyboardDismissMode="on-drag">
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
      <View className="absolute bottom-0 h-24 w-full bg-black">
        <View className="flex-row mt-4 justify-between ml-11 mr-8 ">
          <Entypo name="dots-three-horizontal" size={35} color="#e0ac00" />
          <TouchableOpacity
            className="px-5 py-2 rounded-md"
            style={{ backgroundColor: "#e0ac00" }}
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
    </SafeAreaView>
  );
};

export default JournalEntry;
