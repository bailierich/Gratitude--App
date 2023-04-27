import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import LoadingScreen from "../components/LoadingScreen";
import BooksAccordian from "../components/BooksAccordian";
import { SelectableText } from "@alentoma/react-native-selectable-text";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import useAuth from "../hooks/useAuth";

const BibleScreen = () => {
  const [book, setBook] = useState(0);
  // TODO create a way to store last viewed scripture or set to random
  const [chapter, setChapter] = useState(2);
  const [translation, setTranslation] = useState("KJV");
  const [text, setText] = useState("");
  const [bookModalVisable, setBookModalVisable] = useState(false);
  const [translationModalVisable, setTranslationModalVisable] = useState(false);
  const [highlightID, setHighlightID] = useState([]);
  const [bookmark, setBookmark] = useState();
  const [actionModalVisable, setActionModalVisable] = useState(false);
  const [permHighlight, setPermHightlight] = useState([]);
  const [noteModalVisable, setNoteModalVisable] = useState(false);
  const [databaseHighlights, setDatabaseHighlights] = useState();
  const { user } = useAuth();
  const NO_WIDTH_SPACE = " ";

  const highlightRef = collection(db, "biblehighlights");
  const q = query(highlightRef, where("user", "==", user.uid));

  // TODO Save PK and highlight color in database -- DONE
  // TODO Grab PK and highlight color and add them to the state variable getHighlights()
  // TODO add or statement to check if PK is in state variable that holds PK's from database
  // TODO add statement to highlight function to grab the color of the specific PK from the database...?? Object
  // ? How am I going to recognize a passage that's already highlighted and alllow it to be deleted

  //TODO APRL 20th try these functions and see what works -- add

  //FIX DELETE function -- figure out how to delete multiple highlight, maybe check how many ID's are in highlightID

  const isPermHighlightYellow = (element) => {
    return highlightID.includes(element.versePK) && element.color === "#EBB704";
  };

  const isPermHighlightGreen = (element) => {
    return highlightID.includes(element.versePK) && element.color === "#34B06A";
  };

  const isPermHighlightBlue = (element) => {
    return highlightID.includes(element.versePK) && element.color === "#2892D0";
  };

  const isPermHighlightPink = (element) => {
    return highlightID.includes(element.versePK) && element.color === "#E54686";
  };

  const deletePermHighlight = () => {
    let newHighlights;
    highlightID.forEach((highlightid) => {
      console.log(permHighlight);
      const selectedHighlight = permHighlight.find(
        (e) => e.versePK === highlightid
      );
      if (selectedHighlight) {
        console.log("selectedHighlight:" + selectedHighlight);
        deleteDoc(doc(db, "biblehighlights", selectedHighlight.id));
      }

      newHighlights = [...permHighlight];

      const indexOfHighlight = newHighlights.findIndex(
        (e) => e.versePK === highlightid
      );

      newHighlights.splice(indexOfHighlight, 1);

      setPermHightlight(newHighlights);
    });
    setDatabaseHighlights(newHighlights);
  };

  //? Maybe combine create and save highlight with update highlight, if highlight id isn't found in permhighlight then a new
  //? highlight will get created, if it is found the color will be updated to match the new color provided
  const createUpdateAndSaveHighlight = (color) => {
    console.log("these are the perm highlights" + permHighlight);
    highlightID.map((highlightId) => {
      console.log("highlight verse PK:" + highlightId);
      if (permHighlight.includes((e) => e.versePK === highlightId)) {
        console.log("I'm updating");
        const element = permHighlight.find((e) => e.versePK === highlightId);
        console.log(element);
        const docRef = doc(db, "biblehighlights", element.id);
        updateDoc(docRef, { color: color })
          .then(getHighlights())
          .then(console.log("color updated"))
          .catch((e) => console.log(e));
      } else {
        addDoc(collection(db, "biblehighlights"), {
          user: user.uid,
          versePK: highlightId,
          color: color,
          book: book,
          chapter: chapter,
        })
          .then(() => getHighlights())
          .catch((e) => console.log(e));
      }
    });
  };

  const getHighlights = () => {
    getDocs(q)
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPermHightlight(newData);
      })
      .then(console.log(permHighlight))
      .then(console.log("gothighlights"))
      .catch((e) => console.log(e));
  };

  const createAndSaveNote = (versePK, note, verseText) => {
    addDoc(collection(db, "biblenotes"), {
      id: user.uid,
      versePK: versePK,
      book: book,
      chapter: chapter,
      note: note,
      verseText: verseText,
    }).catch((e) => console.log(e));
  };

  const updateHighlightColor = (updatedColor, id) => {
    const docRef = doc(db, "biblehighlights", id);
    updateDoc(docRef, updatedColor)
      .then(getHighlights())
      .then(console.log("color updated"))
      .catch((e) => console.log(e));
  };

  // TODO need to create bookmark screen, bookmark screen book marks should be links and take user directly to verse
  const createAndSaveBookmark = () => {
    addDoc(collection(db, "biblebookmarks"), {
      id: user.uid,
      versePK: versePK,
      book: book,
      chapter: chapter,
      verseText: verseText,
    }).catch((e) => console.log(e));
  };

  //TODO change highlight function to take into account that permanant highlights are now created individually
  //TODO add logic for highlights that are clicked and permantly highlighted to also have underine in red
  const highlight = (string, versepk) => {
    if (permHighlight.some((e) => e.versePK === versepk)) {
      let currentPK = permHighlight.find((e) => e.versePK === versepk);
      let highlightColor = currentPK.color;

      console.log(currentPK);
      console.log(highlightColor);
      console.log(permHighlight);
      console.log(highlightID);

      if (highlightColor === "#EBB704") {
        return string.split(" ").map((word, i) => (
          <Text key={i}>
            <Text className="text-2xl" style={styles.highlightEBB704}>
              {word}{" "}
            </Text>
          </Text>
        ));
      } else if (highlightColor === "#34B06A") {
        return string.split(" ").map((word, i) => (
          <Text key={i}>
            <Text className="text-2xl" style={styles.highlight34B06A}>
              {word}{" "}
            </Text>
          </Text>
        ));
      } else if (highlightColor === "#2892D0") {
        return string.split(" ").map((word, i) => (
          <Text key={i}>
            <Text className="text-2xl" style={styles.highlight2892D0}>
              {word}{" "}
            </Text>
          </Text>
        ));
      } else if (highlightColor === "#E54686") {
        return string.split(" ").map((word, i) => (
          <Text key={i}>
            <Text className="text-2xl" style={styles.highlightE54686}>
              {word}{" "}
            </Text>
          </Text>
        ));
      }
    } else {
      console.log("im here");
      console.log(string);
      return string.split(" ").map((word, i) => (
        <Text key={i}>
          <Text className="text-2xl" style={styles.highlighted}>
            {word}{" "}
          </Text>
        </Text>
      ));
    }
  };

  const highlightAndOpenActionModal = (ID) => {
    if (highlightID.includes(ID)) {
      setHighlightID((oldValues) => {
        return oldValues.filter((value) => value !== ID);
      });
    } else {
      setHighlightID([...highlightID, ID]);
      setActionModalVisable(true);
    }
  };

  const books = [
    {
      bookName: "Genisis",
      bookNumber: 1,
      testament: "OT",
      chapters: 50,
    },
    {
      bookName: "Exodus",
      bookNumber: 2,
      testament: "OT",
      chapters: 40,
    },
    {
      bookName: "Leviticus",
      bookNumber: 3,
      testament: "OT",
      chapters: 27,
    },
    {
      bookName: "Numbers",
      bookNumber: 4,
      testament: "OT",
      chapters: 36,
    },
    {
      bookName: "Deuteronomy",
      bookNumber: 5,
      testament: "OT",
      chapters: 34,
    },
    {
      bookName: "Joshua",
      bookNumber: 6,
      testament: "OT",
      chapters: 24,
    },
    {
      bookName: "Judges",
      bookNumber: 7,
      testament: "OT",
      chapters: 21,
    },
    {
      bookName: "Ruth",
      bookNumber: 8,
      testament: "OT",
      chapters: 4,
    },
    {
      bookName: "1 Samuel",
      bookNumber: 9,
      testament: "OT",
      chapters: 31,
    },
    {
      bookName: "2 Samuel",
      bookNumber: 10,
      testament: "OT",
      chapters: 24,
    },
    {
      bookName: "1 Kings",
      bookNumber: 11,
      testament: "OT",
      chapters: 22,
    },
    {
      bookName: "2 Kings",
      bookNumber: 12,
      testament: "OT",
      chapters: 25,
    },
    {
      bookName: "1 Chronicles",
      bookNumber: 13,
      testament: "OT",
      chapters: 29,
    },
    {
      bookName: "2 Chronicales",
      bookNumber: 14,
      testament: "OT",
      chapters: 36,
    },
    {
      bookName: "Ezra",
      bookNumber: 15,
      testament: "OT",
      chapters: 10,
    },
    {
      bookName: "Nehemiah",
      bookNumber: 16,
      testament: "OT",
      chapters: 13,
    },
    {
      bookName: "Esther",
      bookNumber: 17,
      testament: "OT",
      chapters: 10,
    },
    {
      bookName: "Job",
      bookNumber: 18,
      testament: "OT",
      chapters: 42,
    },
    {
      bookName: "Psalms",
      bookNumber: 19,
      testament: "OT",
      chapters: 150,
    },
    {
      bookName: "Proverbs",
      bookNumber: 20,
      testament: "OT",
      chapters: 31,
    },
    {
      bookName: "Ecclesiastes",
      bookNumber: 21,
      testament: "OT",
      chapters: 12,
    },
    {
      bookName: "Song of Songs",
      bookNumber: 22,
      testament: "OT",
      chapters: 8,
    },
    {
      bookName: "Isaiah",
      bookNumber: 23,
      testament: "OT",
      chapters: 66,
    },
    {
      bookName: "Jeremiah",
      bookNumber: 24,
      testament: "OT",
      chapters: 52,
    },
    {
      bookName: "Lamentations",
      bookNumber: 25,
      testament: "OT",
      chapters: 5,
    },
    {
      bookName: "Ezekiel",
      bookNumber: 26,
      testament: "OT",
      chapters: 48,
    },
    {
      bookName: "Daniel",
      bookNumber: 27,
      testament: "OT",
      chapters: 12,
    },
    {
      bookName: "Hosea",
      bookNumber: 28,
      testament: "OT",
      chapters: 14,
    },
    {
      bookName: "Joel",
      bookNumber: 29,
      testament: "OT",
      chapters: 3,
    },
    {
      bookName: "Amos",
      bookNumber: 30,
      testament: "OT",
      chapters: 9,
    },
    {
      bookName: "Obadiah",
      bookNumber: 31,
      testament: "OT",
      chapters: 1,
    },
    {
      bookName: "Jonah",
      bookNumber: 32,
      testament: "OT",
      chapters: 4,
    },
    {
      bookName: "Micah",
      bookNumber: 33,
      testament: "OT",
      chapters: 7,
    },
    {
      bookName: "Nahum",
      bookNumber: 34,
      testament: "OT",
      chapters: 3,
    },
    {
      bookName: "Habakkuk",
      bookNumber: 35,
      testament: "OT",
      chapters: 3,
    },
    {
      bookName: "Zaphaniah",
      bookNumber: 36,
      testament: "OT",
      chapters: 3,
    },
    {
      bookName: "Haggai",
      bookNumber: 37,
      testament: "OT",
      chapters: 2,
    },
    {
      bookName: "Zachariah",
      bookNumber: 38,
      testament: "OT",
      chapters: 14,
    },
    {
      bookName: "Malachi",
      bookNumber: 39,
      testament: "OT",
      chapters: 4,
    },
    {
      bookName: "Matthew",
      bookNumber: 40,
      testament: "NT",
      chapters: 28,
    },
    {
      bookName: "Mark",
      bookNumber: 41,
      testament: "NT",
      chapters: 16,
    },
    {
      bookName: "Luke",
      bookNumber: 42,
      testament: "NT",
      chapters: 24,
    },
    {
      bookName: "John",
      bookNumber: 43,
      testament: "NT",
      chapters: 21,
    },
    {
      bookName: "Acts",
      bookNumber: 44,
      testament: "NT",
      chapters: 28,
    },
    {
      bookName: "Romans",
      bookNumber: 45,
      testament: "NT",
      chapters: 16,
    },
    {
      bookName: "1 Corinthians",
      bookNumber: 46,
      testament: "NT",
      chapters: 16,
    },
    {
      bookName: "2 Corinthians",
      bookNumber: 47,
      testament: "NT",
      chapters: 13,
    },
    {
      bookName: "Galatians",
      bookNumber: 48,
      testament: "NT",
      chapters: 6,
    },
    {
      bookName: "Ephesians",
      bookNumber: 49,
      testament: "NT",
      chapters: 6,
    },
    {
      bookName: "Philippians",
      bookNumber: 50,
      testament: "NT",
      chapters: 4,
    },
    {
      bookName: "Colossians",
      bookNumber: 51,
      testament: "NT",
      chapters: 4,
    },
    {
      bookName: "1 Thessalonians",
      bookNumber: 52,
      testament: "NT",
      chapters: 5,
    },
    {
      bookName: "2 Thessalonians",
      bookNumber: 53,
      testament: "NT",
      chapters: 3,
    },
    {
      bookName: "1 Timothy",
      bookNumber: 54,
      testament: "NT",
      chapters: 6,
    },
    {
      bookName: "2 Timothy",
      bookNumber: 55,
      testament: "NT",
      chapters: 4,
    },
    {
      bookName: "Titus",
      bookNumber: 56,
      testament: "NT",
      chapters: 3,
    },
    {
      bookName: "Philemon",
      bookNumber: 57,
      testament: "NT",
      chapters: 1,
    },
    {
      bookName: "Hebrews",
      bookNumber: 58,
      testament: "NT",
      chapters: 13,
    },
    {
      bookName: "James",
      bookNumber: 59,
      testament: "NT",
      chapters: 5,
    },
    {
      bookName: "1 Peter",
      bookNumber: 60,
      testament: "NT",
      chapters: 5,
    },
    {
      bookName: "2 Peter",
      bookNumber: 61,
      testament: "NT",
      chapters: 3,
    },
    {
      bookName: "1 John",
      bookNumber: 62,
      testament: "NT",
      chapters: 5,
    },
    {
      bookName: "2 John",
      bookNumber: 63,
      testament: "NT",
      chapters: 1,
    },
    {
      bookName: "3 John",
      bookNumber: 64,
      testament: "NT",
      chapters: 1,
    },
    {
      bookName: "Jude",
      bookNumber: 65,
      testament: "NT",
      chapters: 1,
    },
    {
      bookName: "Revelation",
      bookNumber: 66,
      testament: "NT",
      chapters: 22,
    },
  ];

  const translations = [
    {
      short_name: "YLT",
      full_name: "Young's Literal Translation (1898)",
      info: "http://wikipedia.org/wiki/Young%27s_Literal_Translation",
      updated: 1626349711821,
    },
    {
      short_name: "KJV",
      full_name: "King James Version 1769 with Apocrypha",
      info: "http://wikipedia.org/wiki/King_James_Version",
      updated: 1624014765325,
    },
    {
      short_name: "WEB",
      full_name: "World English Bible",
      info: "http://wikipedia.org/wiki/World_English_Bible",
      updated: 1591185595149,
    },
    {
      short_name: "RSV",
      full_name: "Revised Standard Version (1952)",
      info: "http://wikipedia.org/wiki/Revised_Standard_Version",
      updated: 1635188106109,
    },
    {
      short_name: "CJB",
      full_name: "The Complete Jewish Bible (1998)",
      info: "http://wikipedia.org/wiki/Messianic_Bible_translations#Complete_Jewish_Bible_(CJB)",
      updated: 1635188106109,
    },
    {
      short_name: "TS2009",
      full_name: "The Scriptures 2009",
      info: "http://isr-messianic.org/publications/the-scriptures.html",
      updated: 1635188106109,
    },
    {
      short_name: "LXXE",
      full_name: "English version of the Septuagint Bible, 1851",
      info: "http://ebible.org/eng-Brenton/",
      updated: 1635188106109,
    },
    {
      short_name: "TLV",
      full_name: "Tree of Life Version",
      info: "http://www.tlvbiblesociety.org/tree-of-life-version",
      updated: 1635188106109,
    },
    {
      short_name: "NASB",
      full_name: "New American Standard Bible (1995)",
      info: "http://wikipedia.org/wiki/New_American_Standard_Bible",
      updated: 1598253681687,
    },
    {
      short_name: "ESV",
      full_name: "English Standard Version 2001, 2016",
      info: "http://en.wikipedia.org/wiki/English_Standard_Version",
      updated: 1635188106109,
    },
    {
      short_name: "GNV",
      full_name: "Geneva Bible (1599)",
      info: "http://wikipedia.org/wiki/Geneva_Bible",
      updated: 1635188106109,
    },
    {
      short_name: "DRB",
      full_name: "Douay Rheims Bible",
      info: "http://en.wikipedia.org/wiki/Douay%E2%80%93Rheims_Bible",
      updated: 1591185595149,
    },
    {
      short_name: "NIV",
      full_name: "New International Version, 1984",
      info: "http://en.wikipedia.org/wiki/New_International_Version",
      updated: 1626349711821,
    },
    {
      short_name: "NLT",
      full_name: "New Living Translation, 2015",
      info: "http://en.wikipedia.org/wiki/New_Living_Translation",
      updated: 1635188106109,
    },
    {
      short_name: "NRSVCE",
      full_name: "New Revised Standard Version Catholic Edition, 1993",
      info: "http://en.wikipedia.org/wiki/New_Revised_Standard_Version_Catholic_Edition",
      updated: 1635188106109,
    },
    {
      short_name: "NET",
      full_name: "New English Translation, 2007",
      info: "http://en.wikipedia.org/wiki/New_English_Translation",
      updated: 1635188106109,
    },
    {
      short_name: "NJB1985",
      full_name: "New Jerusalem Bible, 1985",
      info: "http://en.wikipedia.org/wiki/New_Jerusalem_Bible",
      updated: 1635188106109,
    },
    {
      short_name: "AMP",
      full_name: "Amplified Bible, 2015",
      info: "http://en.wikipedia.org/wiki/Amplified_Bible",
      updated: 1673261959445,
    },
    {
      short_name: "MSG",
      full_name: "The Message, 2002",
      info: "http://messagebible.com/",
      updated: 1635188106109,
    },
    {
      short_name: "LSV",
      full_name: "Literal Standard Version",
      info: "http://www.lsvbible.com/",
      updated: 1635188106109,
    },
  ];

  const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
  };

  const chapterBefore = () => {
    setChapter((prevChapter) => prevChapter - 1);
  };

  const chapterAfter = () => {
    setChapter((prevChapter) => prevChapter + 1);
  };

  const getBibleChapter = () => {
    console.log("this ran");
    fetch(
      "https://bolls.life/get-text/" +
        translation +
        "/" +
        (book + 1) +
        "/" +
        chapter
    )
      .then((response) => response.json())
      .then((json) => setText(json))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getBibleChapter();
    getHighlights();
  }, [chapter, translation, databaseHighlights]);

  console.log(chapter);

  return text ? (
    <View className="bg-white">
      {/* Modal for Note Creation */}
      <Modal
        visible={noteModalVisable}
        animationType="slide"
        transparent={true}
      >
        <View className="justify-center flex-1 ">
          <View
            className=" mt-5 rounded-xl h-2/4"
            style={{ backgroundColor: "#FDF8E1" }}
          ></View>
        </View>
      </Modal>
      {/* Modal for Translation Selection */}
      <Modal
        visible={translationModalVisable}
        animationType="slide"
        transparent={true}
      >
        <View
          className="justify-center flex-1 "
          style={{ borderColor: "CDB64C", borderStyle: "solid" }}
        >
          <View
            className=" mt-5 rounded-xl h-5/6"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <View className="px-5 mt-5">
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={() => {
                    setTranslationModalVisable(!translationModalVisable);
                  }}
                >
                  <AntDesign name="closecircle" size={30} color="#CDB64C" />
                </TouchableOpacity>
              </View>
              <ScrollView className="mb-10">
                <Text className="text-center  font-bold text-2xl">
                  Translations
                </Text>
                <Text className="text-center mb-5 font-semibold text-sm">
                  Select A Bible Translation
                </Text>
                {translations.map((data) => {
                  return (
                    <View key={data.short_name}>
                      <TouchableOpacity
                        className=" bg-white rounded-xl p-3 my-3"
                        onPress={() => {
                          setTranslation(data.short_name);
                          setTranslationModalVisable(!translationModalVisable);
                        }}
                      >
                        {translation == data.short_name && (
                          <View
                            className="flex-row p-2 mb-4 justify-center rounded-xl"
                            style={{ backgroundColor: "#CDB64C" }}
                          >
                            <AntDesign
                              name="checkcircle"
                              size={20}
                              color="#FDF8E1"
                            />
                            <Text
                              className="ml-2 font-semibold"
                              style={{ color: "#FDF8E1" }}
                            >
                              Selected
                            </Text>
                          </View>
                        )}

                        <Text className="text-xs">
                          {data.full_name} - {data.short_name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Book Selection */}
      <Modal
        visible={bookModalVisable}
        animationType="slide"
        transparent={true}
      >
        <View
          className="justify-center flex-1 "
          style={{ borderColor: "CDB64C", borderStyle: "solid" }}
        >
          <View
            className=" mt-5 rounded-xl h-5/6"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <View className="px-5 mt-5">
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={() => {
                    setBookModalVisable(!bookModalVisable);
                  }}
                >
                  <AntDesign name="closecircle" size={30} color="#CDB64C" />
                </TouchableOpacity>
              </View>

              <ScrollView className="mb-10">
                <Text className="text-center font-bold text-2xl">Books</Text>
                {/* GOING TO IMPLEMENT ACCORDIAN HERE */}

                {books.map((data) => {
                  return (
                    <BooksAccordian
                      key={data.bookNumber}
                      bookName={data.bookName}
                      bookNumber={data.bookNumber}
                      setChapter={setChapter}
                      setBook={setBook}
                      chapters={data.chapters}
                      setBookModalVisable={setBookModalVisable}
                      bookModalVisable={bookModalVisable}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <View
        className="absolute top-0  h-32 w-full"
        style={{ backgroundColor: "#CDB64C" }}
      >
        <View className="flex-row  justify-between">
          <SafeAreaView className="flex-row justify-start">
            <View
              className="flex-row p-2 ml-6 mt-4 items-center  rounded-lg"
              style={{ backgroundColor: "#FCF8E3" }}
            >
              <TouchableOpacity
                onPress={() => setBookModalVisable(!bookModalVisable)}
              >
                <View className="flex-row items-center">
                  <Text className=" text-center">
                    {books[book].bookName} {chapter}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <View
                className="h-full mr-2"
                style={{
                  borderRightColor: "#00000",
                  borderRightWidth: 0.75,
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setTranslationModalVisable(!translationModalVisable)
                }
              >
                <View className="flex-row items-center">
                  <Text className=" text-center">{translation}</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <SafeAreaView>
            <View className="flex-row p-2 mt-4 mr-3">
              <TouchableOpacity className="mr-3">
                <FontAwesome name="search" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Entypo name="bookmarks" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
      <ScrollView className="mt-32 mx-5 ">
        <Text className="">
          {text.map((verse) => {
            let replace1 = replaceAll(verse.text, "<br/>", "\n");
            let replace2 = replaceAll(replace1, "<br>", " ");

            return (
              <Text
                onPress={() => highlightAndOpenActionModal(verse.pk)}
                key={verse.pk}
              >
                <View className="p-1">
                  <Text className="text-xs" style={{ color: "#CDB64C" }}>
                    {verse.verse}
                  </Text>
                </View>
                {highlightID.includes(verse.pk) ||
                permHighlight.some((e) => e.versePK === verse.pk) ? (
                  highlight(replace2, verse.pk)
                ) : (
                  <Text className="text-2xl">{replace2}</Text>
                )}
              </Text>
            );
          })}
        </Text>
      </ScrollView>
      <View className=" absolute w-full bottom-4 " style={{ opacity: 0.3 }}>
        <View className="flex-row mx-3">
          {chapter < books[book].chapters && chapter != 1 && (
            <TouchableOpacity
              className="absolute left-3 bottom-4"
              onPress={chapterBefore}
            >
              <Ionicons name="ios-arrow-back-circle" size={80} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="absolute right-3 bottom-4"
            onPress={chapterAfter}
          >
            <Ionicons name="arrow-forward-circle" size={80} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {actionModalVisable ? (
        <View className="absolute w-full  h-36 bottom-0 bg-gray-100">
          <View className="flex-row justify-end bg-black opacity-75">
            <View className="p-2 m-2 mb-4">
              <AntDesign
                name="close"
                onPress={() => {
                  setHighlightID([]);
                  setActionModalVisable(false);
                }}
                size={30}
                color="white"
              />
            </View>
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ paddingLeft: 4 }}
          >
            <View>
              <TouchableOpacity
                className="bg-black m-2 p-4 rounded-xl"
                onPress={() => {
                  setNoteModalVisable((prev) => !prev);
                  setActionModalVisable((prev) => !prev);
                }}
              >
                <Text className="text-white">Note</Text>
              </TouchableOpacity>
            </View>
            <View className="">
              <TouchableOpacity className="bg-black m-2 p-4 rounded-xl">
                <Text className="text-white">Bookmark</Text>
              </TouchableOpacity>
            </View>
            <View className="m-2">
              {permHighlight.some(isPermHighlightYellow) ? (
                //* delete highlight
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    deletePermHighlight();
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="times-circle" size={40} color="#EBB704" />
                </TouchableOpacity>
              ) : (
                // * create new highlight or change highlight color
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    createUpdateAndSaveHighlight("#EBB704", highlightID);
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="circle" size={40} color="#EBB704" />
                </TouchableOpacity>
              )}
            </View>
            <View className="m-2">
              {permHighlight.some(isPermHighlightGreen) ? (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    deletePermHighlight();
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="times-circle" size={40} color="#34B06A" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    createUpdateAndSaveHighlight("#34B06A", highlightID);
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="circle" size={40} color="#34B06A" />
                </TouchableOpacity>
              )}
            </View>
            <View className="m-2">
              {permHighlight.some(isPermHighlightBlue) ? (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    deletePermHighlight();
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="times-circle" size={40} color="#2892D0" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    createUpdateAndSaveHighlight("#2892D0", highlightID);
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="circle" size={40} color="#2892D0" />
                </TouchableOpacity>
              )}
            </View>
            <View className="m-2">
              {permHighlight.some(isPermHighlightPink) ? (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    deletePermHighlight();
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="times-circle" size={40} color="#E54686" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    createUpdateAndSaveHighlight("#E54686", highlightID);
                    setHighlightID([]);
                    setActionModalVisable(false);
                  }}
                >
                  <FontAwesome name="circle" size={40} color="#E54686" />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  ) : (
    <LoadingScreen />
  );
};

const styles = {
  highlighted: {
    padding: 2,
    textDecorationLine: "underline",
    textDecorationColor: "red",
    textDecorationStyle: "dotted",
  },
  highlightEBB704: {
    padding: 2,
    backgroundColor: "#EBB704",
  },
  highlight34B06A: {
    padding: 2,
    backgroundColor: "#34B06A",
  },
  highlight2892D0: {
    padding: 2,
    backgroundColor: "#2892D0",
  },
  highlightE54686: {
    padding: 2,
    backgroundColor: "#E54686",
  },
};

export default BibleScreen;
