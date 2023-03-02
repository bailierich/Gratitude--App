import { View, Text, SafeAreaView } from "react-native";
import React, { useState } from "react";

const BibleScreen = () => {
  const [book, setBook] = useState(1);
  const [chapter, setChapter] = useState(1);

  const books = [
    {
      bookName: "Genisis",
      bookNumber: 1,
      testament: "OT",
    },
    {
      bookName: "Exodus",
      bookNumber: 2,
      testament: "OT",
    },
    {
      bookName: "Leviticus",
      bookNumber: 3,
      testament: "OT",
    },
    {
      bookName: "Numbers",
      bookNumber: 4,
      testament: "OT",
    },
    {
      bookName: "Deuteronomy",
      bookNumber: 5,
      testament: "OT",
    },
    {
      bookName: "Joshua",
      bookNumber: 6,
      testament: "OT",
    },
    {
      bookName: "Judges",
      bookNumber: 7,
      testament: "OT",
    },
    {
      bookName: "Ruth",
      bookNumber: 8,
      testament: "OT",
    },
    {
      bookName: "1 Samuel",
      bookNumber: 9,
      testament: "OT",
    },
    {
      bookName: "2 Samuel",
      bookNumber: 10,
      testament: "OT",
    },
    {
      bookName: "1 Kings",
      bookNumber: 11,
      testament: "OT",
    },
    {
      bookName: "2 Kings",
      bookNumber: 12,
      testament: "OT",
    },
    {
      bookName: "1 Chronicles",
      bookNumber: 13,
      testament: "OT",
    },
    {
      bookName: "2 Chronicales",
      bookNumber: 14,
      testament: "OT",
    },
    {
      bookName: "Ezra",
      bookNumber: 15,
      testament: "OT",
    },
    {
      bookName: "Nehemiah",
      bookNumber: 16,
      testament: "OT",
    },
    {
      bookName: "Esther",
      bookNumber: 17,
      testament: "OT",
    },
    {
      bookName: "Job",
      bookNumber: 18,
      testament: "OT",
    },
    {
      bookName: "Psalms",
      bookNumber: 19,
      testament: "OT",
    },
    {
      bookName: "Proverbs",
      bookNumber: 20,
      testament: "OT",
    },
    {
      bookName: "Ecclesiastes",
      bookNumber: 21,
      testament: "OT",
    },
    {
      bookName: "Song of Songs",
      bookNumber: 22,
      testament: "OT",
    },
    {
      bookName: "Isaiah",
      bookNumber: 23,
      testament: "OT",
    },
    {
      bookName: "Jeremiah",
      bookNumber: 24,
      testament: "OT",
    },
    {
      bookName: "Lamentations",
      bookNumber: 25,
      testament: "OT",
    },
    {
      bookName: "Ezekiel",
      bookNumber: 26,
      testament: "OT",
    },
    {
      bookName: "Daniel",
      bookNumber: 27,
      testament: "OT",
    },
    {
      bookName: "Hosea",
      bookNumber: 28,
      testament: "OT",
    },
    {
      bookName: "Joel",
      bookNumber: 29,
      testament: "OT",
    },
    {
      bookName: "Amos",
      bookNumber: 30,
      testament: "OT",
    },
    {
      bookName: "Obadiah",
      bookNumber: 31,
      testament: "OT",
    },
    {
      bookName: "Jonah",
      bookNumber: 32,
      testament: "OT",
    },
    {
      bookName: "Micah",
      bookNumber: 33,
      testament: "OT",
    },
    {
      bookName: "Nahum",
      bookNumber: 34,
      testament: "OT",
    },
    {
      bookName: "Habakkuk",
      bookNumber: 35,
      testament: "OT",
    },
    {
      bookName: "Zaphaniah",
      bookNumber: 36,
      testament: "OT",
    },
    {
      bookName: "Haggai",
      bookNumber: 37,
      testament: "OT",
    },
    {
      bookName: "Zachariah",
      bookNumber: 38,
      testament: "OT",
    },
    {
      bookName: "Malachi",
      bookNumber: 39,
      testament: "OT",
    },
  ];

  return (
    <SafeAreaView>
      <Text>Books</Text>
    </SafeAreaView>
  );
};

export default BibleScreen;
