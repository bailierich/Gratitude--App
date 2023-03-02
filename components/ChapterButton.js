import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChapterButton = (props) => {
  return (
    <TouchableOpacity>
      <View>
        <Text>{props.chapterName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChapterButton;
