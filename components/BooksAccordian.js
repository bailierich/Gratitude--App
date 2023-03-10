import { View, Text, LayoutAnimation } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import ChapterButton from "./ChapterButton";

const BooksAccordian = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((expanded) => !expanded);
  };
  return (
    <View className="">
      <TouchableOpacity
        className="flex-row rounded-xl justify-between items-center px-5 h-12 my-2"
        style={{ backgroundColor: "#CDB64C" }}
        onPress={() => toggleExpand()}
      >
        <Text className="text-black text-base font-semibold">
          {props.bookName}
        </Text>
        <AntDesign
          name={expanded ? "upcircle" : "downcircle"}
          color="white"
          size={24}
        />
      </TouchableOpacity>
      <View>
        {expanded && (
          <View style={styles.app}>
            {Array(props.chapters)
              .fill(props.chapters)
              .map((_, i) => (
                <View key={i} style={styles.item}>
                  <ChapterButton
                    book={props.bookNumber - 1}
                    setChapter={props.setChapter}
                    setBook={props.setBook}
                    chapter={i + 1}
                    setBookModalVisable={props.setBookModalVisable}
                    bookModalVisable={props.bookModalVisable}
                  />
                </View>
              ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  app: {
    width: 400,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",

    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    minWidth: 75,
    maxWidth: 75,
    height: 75,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",

    // my visual styles; not important for grid
    padding: 10,
    backgroundColor: "white",
  },
};

export default BooksAccordian;
