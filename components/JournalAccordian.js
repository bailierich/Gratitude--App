import { View, Text, LayoutAnimation } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
const JournalAccordian = (props) => {
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
          {props.monthYear}
        </Text>
        <AntDesign
          name={expanded ? "upcircle" : "downcircle"}
          color="white"
          size={24}
        />
      </TouchableOpacity>
      <View>
        {expanded && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(
                "Edit Entry",

                { entryID: item.id }
              );
            }}
          >
            <View
              className="p-4 m-5 rounded-lg"
              style={{
                backgroundColor: "#FCEFB4",
                borderColor: "#e0ac00",
                borderWidth: 0.1,
              }}
            >
              <View className="flex-row rounded-lg  justify-start">
                <View
                  className="flex-row items-center p-3 mb-2"
                  style={{
                    color: "black",
                    borderRadius: 12,
                    backgroundColor: "#FDF8E1",
                    overflow: "hidden",
                    borderColor: "#e0ac00",
                    borderWidth: 0.1,
                  }}
                >
                  <Feather name="calendar" size={20} color="#E2C854" />
                  <Text className="ml-2 ">{item.date}</Text>
                </View>
              </View>
              <Text className="m-2">{item.displayEntry}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default JournalAccordian;
