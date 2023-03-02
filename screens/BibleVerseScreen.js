import { View, Text } from "react-native";
import React from "react";
import JournalEntry from "../components/JournalEntry";
import { useRoute } from "@react-navigation/native";

const BibleVerseScreen = () => {
  const route = useRoute();
  const verse = route.params.verse;
  const scripture = route.params.scripture;
  return (
    <JournalEntry
      isExistingDoc={false}
      verse={verse}
      scripture={scripture}
      isDailyVersePrompt={true}
    />
  );
};

export default BibleVerseScreen;
