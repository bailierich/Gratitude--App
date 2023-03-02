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
    <View className="">
      <TouchableOpacity
        className="flex-row rounded-xl justify-between items-center px-5 h-12 my-5 "
        style={{ backgroundColor: "#CDB64C" }}
        onPress={() => toggleExpand()}
      >
        <Text className="text-black text-base font-semibold">
          {props.title}
        </Text>
        <AntDesign
          name={expanded ? "upcircle" : "downcircle"}
          color="white"
          size={24}
        />
      </TouchableOpacity>
      <View>
        {expanded && (
          <View>
            <View className="bg-white rounded-xl p-5">
              <Text className="text-xs">{props.mainText}</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: "#CDB64C" }}
              className=" p-2 rounded-xl mt-5"
              onPress={() => props.handleOnClick(props.promptType)}
            >
              <Text className="text-center text-black font-semibold text-sm">
                Select Prompt
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Accordian;
