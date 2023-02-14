import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-web";

let content;

if (props.promptType == "bibleVerse") {
  content = (
    <View>
      <Text>Prompt</Text>
    </View>
  );
} else if (props.promptType == "SOAP") {
  content = <View></View>;
} else if (props.promptType == "selfHelp") {
  content = <View></View>;
}

const Prompt = (props) => {
  return <SafeAreaView>{content}</SafeAreaView>;
};

export default Prompt;
