import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChapterButton = (props) => {
  const handlePress = () => {
    props.setChapter(props.chapter);
    props.setBook(props.book);
    props.setBookModalVisable(!props.bookModalVisable);
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <Text className="text-lg font-semibold">{props.chapter}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChapterButton;
