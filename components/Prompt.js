import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

const Prompt = (props) => {
  let content;

  //FETCH NEW JOURNAL PROMPT
  const fetchPrompt = () => {
    fetch("https://randomjournalprompt-api.onrender.com")
      .then((response) => response.json())
      .then((json) => props.setSelfReflectPrompt(json.prompt))
      .catch((err) => console.log(err));
  };

  //GENERATE NEW SCRIPTURE
  const fetchScripture = () => {
    const options = { method: "GET", headers: { accept: "application/json" } };
    fetch(
      "https://beta.ourmanna.com/api/v1/get?format=json&order=random",
      options
    )
      .then((response) => response.json())
      .then((json) =>
        props.setSoapScripture(
          '"' +
            json.verse.details.text +
            '"' +
            "\n\n" +
            "-" +
            json.verse.details.reference
        )
      )
      .catch((error) => console.log(error));
  };

  //SOAP VALIDATION
  const scriptureMess = "Enter a scripture or generate a new one...";
  const observationMess = "Enter an observation about this scripture...";
  const applicationMess = "Enter an application of this scripture...";
  const prayerMess = "Enter a prayer about this message...";

  const [showScriptureMess, setShowScriptureMess] = useState(false);
  const [showObservationMess, setShowObservationMess] = useState(false);
  const [showApplicationMess, setShowApplicationMess] = useState(false);
  const [showPrayerMess, setShowPrayerMess] = useState(false);

  const scriptureEmptyCheck = () => {
    if (!props.soapScripture) {
      setShowScriptureMess(true);
    } else {
      setShowScriptureMess(false);
    }
  };

  const observationEmptyCheck = () => {
    if (!props.soapObservation) {
      setShowObservationMess(true);
    } else {
      setShowObservationMess(false);
    }
  };

  const applicationEmptyCheck = () => {
    if (!props.soapApplication) {
      setShowApplicationMess(true);
    } else {
      setShowApplicationMess(false);
    }
  };

  const prayerEmptyCheck = () => {
    if (!props.soapPrayer) {
      setShowPrayerMess(true);
    } else {
      setShowPrayerMess(false);
    }
  };

  useEffect(() => {
    scriptureEmptyCheck();
    observationEmptyCheck();
    applicationEmptyCheck();
    prayerEmptyCheck();
  }, [
    props.soapScripture,
    props.soapObservation,
    props.soapApplication,
    props.soapPrayer,
  ]);

  useEffect(() => {
    fetchPrompt();
  }, []);

  console.log(props.selfReflectPrompt);
  console.log(showScriptureMess);
  console.log(props.soapScripture);
  if (props.promptType == "ScriptureReflect") {
    content = (
      <ScrollView>
        <View className="p-5 rounded-lg" style={{ backgroundColor: "#FDF8E1" }}>
          <Text>{props.verse}</Text>
          <Text>{props.scripture}</Text>
        </View>
      </ScrollView>
    );
  } else if (props.promptType == "SOAP") {
    content = (
      <ScrollView className="bg-white mb-5">
        <Text className="text-2xl font-bold text-center my-8">
          SOAP Bible Study
        </Text>
        <View className="p-5">
          <View
            className="p-5 rounded-lg"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold">Scripture</Text>
              <TouchableOpacity>
                <Ionicons
                  onPress={fetchScripture}
                  name="refresh-circle"
                  size={30}
                  color="#CDB64C"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-xs">
              Write the scripture your studying today.
            </Text>
          </View>
          <View>
            <TextInput
              className="mt-3 p-5 h-48 "
              placeholder="start here..."
              multiline={true}
              value={props.soapScripture}
              onChangeText={props.setSoapScripture}
            />

            {showScriptureMess && (
              <View className="bg-red-300 flex-row justify-start items-center rounded-lg p-4 my-5">
                <View className="m-2">
                  <Ionicons name="alert-circle" size={24} color="#991B1B" />
                </View>
                <Text className=" text-xs text-red-800 font-bold ">
                  {scriptureMess}
                </Text>
              </View>
            )}
          </View>
          <View
            className="p-5 rounded-lg"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <Text className="text-lg font-bold">Observation</Text>
            <Text className="text-xs">
              What is the main lesson? What's standing out to you? Who's the
              audience?
            </Text>
          </View>
          <View>
            <TextInput
              className="mt-3 p-5 h-48"
              placeholder="start here..."
              multiline={true}
              value={props.soapObservation}
              onChangeText={props.setSoapObservation}
            />
            {showObservationMess && (
              <View className="bg-red-300 flex-row justify-start items-center rounded-lg p-4 my-5">
                <View className="m-2">
                  <Ionicons name="alert-circle" size={24} color="#991B1B" />
                </View>
                <Text className=" text-xs text-red-800 font-bold ">
                  {observationMess}
                </Text>
              </View>
            )}
          </View>
          <View
            className="p-5 rounded-lg"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <Text className="text-lg font-bold">Application</Text>
            <Text className="text-xs">
              How can this scripture be applied to your life? Is this scripture
              convicting you of anything that you currently need to work on
            </Text>
          </View>
          <View>
            <TextInput
              className="mt-3 p-5 h-48"
              placeholder="start here..."
              multiline={true}
              value={props.soapApplication}
              onChangeText={props.setSoapApplication}
            />
            {showApplicationMess && (
              <View className="bg-red-300 flex-row justify-start items-center rounded-lg p-4 my-5">
                <View className="m-2">
                  <Ionicons name="alert-circle" size={24} color="#991B1B" />
                </View>
                <Text className=" text-xs text-red-800 font-bold ">
                  {applicationMess}
                </Text>
              </View>
            )}
          </View>
          <View
            className="p-5 rounded-lg"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <Text className="text-lg font-bold">Prayer</Text>
            <Text className="text-xs">
              Talk to God about what he's revealed to you.
            </Text>
          </View>
          <View>
            <TextInput
              className="mt-3 p-5 h-48"
              placeholder="start here..."
              multiline={true}
              value={props.soapPrayer}
              onChangeText={props.setSoapPrayer}
            />
          </View>
          {showPrayerMess && (
            <View className="bg-red-300 flex-row justify-start items-center rounded-lg p-4 my-10">
              <View className="m-2">
                <Ionicons name="alert-circle" size={24} color="#991B1B" />
              </View>
              <Text className=" text-xs text-red-800 font-bold ">
                {prayerMess}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  } else if (props.promptType == "JournalPrompt") {
    if (props.selfReflectPrompt) {
      content = (
        <View>
          <View
            className="p-5 rounded-lg m-4"
            style={{ backgroundColor: "#FDF8E1" }}
          >
            <View className="flex-row justify-between">
              <Text className="text-lg">Journal Prompt</Text>
              <TouchableOpacity>
                <Ionicons
                  onPress={fetchPrompt}
                  name="refresh-circle"
                  size={30}
                  color="#CDB64C"
                />
              </TouchableOpacity>
            </View>
            <View
              className="my-4"
              style={{
                borderBottomColor: "#CDB64C",
                borderBottomWidth: 0.4,
              }}
            />
            <Text className="text-sm text-black">
              {props.selfReflectPrompt}
            </Text>
          </View>
          <ScrollView>
            <TextInput
              className="mt-3 p-7 h-48"
              placeholder="what would you like to say..."
              multiline={true}
              value={props.entry}
              onChangeText={props.setEntry}
            />
          </ScrollView>
        </View>
      );
    } else {
      content = <LoadingScreen />;
    }
  } else {
    content = (
      <View>
        <View className="p-5 rounded-lg" style={{ backgroundColor: "#FDF8E1" }}>
          <Text>{props.verse}</Text>
          <Text>{props.scripture}</Text>
        </View>
        <TextInput
          className="mt-3 p-5 h-48"
          placeholder="what would you like to say..."
          multiline={true}
          value={props.entry}
          onChangeText={props.setEntry}
        />
      </View>
    );
  }
  return <View className=" h-full w-full relative">{content}</View>;
};

export default Prompt;
