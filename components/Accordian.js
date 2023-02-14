import { View, Text, LayoutAnimation } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
const Accordian = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((expanded) => !expanded);
  };
  return (
    <View>
      <TouchableOpacity
        className="flex-row justify-between items-center px-5 h-5 bg-black"
        onPress={() => toggleExpand()}
      >
        <Text className="text-white">{props.title}</Text>
        <AntDesign name={expanded ? "upcircle" : "downcircle"} color="white" />
      </TouchableOpacity>
      <View>
        {expanded && (
          <View>
            <Text>{props.mainText}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Accordian;
