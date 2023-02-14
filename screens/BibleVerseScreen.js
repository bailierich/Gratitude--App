import { View, Text } from "react-native";
import React from "react";
import JournalEntry from "../components/JournalEntry";

const verse = route.params.verse;
const scripture = route.params.scripture;


const BibleVerseScreen = () => {
  return (
    <JournalEntry isExistingDoc={false} verse={verse} scripture={scripture} isDailyVersePropmt={true}/>
  );
};

export default BibleVerseScreen;
