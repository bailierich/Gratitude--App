import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import Swipeable from "react-native-gesture-handler/Swipeable";

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [gratitude, setGratitude] = useState("");
  const [gratitudes, setGratitudes] = useState([]);
  const [affirmation, setAffirmation] = useState([]);
  const currentDate = new Date();
  const [loading, setLoading] = useState(true);

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;

  const gratitudesRef = collection(db, "gratitudes");
  const q = query(
    gratitudesRef,
    where("date", "==", dateString),
    where("id", "==", user.uid)
  );
  const addGratitude = () => {
    addDoc(collection(db, "gratitudes"), {
      id: user.uid,
      date: dateString,
      gratitude: gratitude,
    })
      .then(() => {
        console.log("Gratitude Saved");
        setGratitude("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  const getGratitudes = async () => {
    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGratitudes(newData);
      console.log(gratitudes);
    });
  };

  const RightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <TouchableOpacity
          style={{
            margin: 10,
            borderRadius: 30,
            backgroundColor: "#0A014F",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 20,
            padding: 5,
          }}
        >
          <Animated.Text
            style={{
              color: "white",
              fontWeight: "600",
              paddingHorizontal: 4,
            }}
          >
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </>
    );
  };

  useEffect(() => {
    fetch("https://www.affirmations.dev")
      .then((response) => response.json())
      .then((json) => setAffirmation(json))
      .catch((error) => console.error(error));

    getGratitudes();

    console.log(affirmation);
  }, []);

  return (
    <View className="bg-white flex-1">
      <SafeAreaView className="mx-5">
        <View className="flex-row justify-between mt-3">
          <TouchableOpacity onPress={logout}>
            <AntDesign name="logout" size={30} />
          </TouchableOpacity>

          <Image
            className="h-24 w-24"
            source={require("../images/GraciousInsignia.png")}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
            <AntDesign name="setting" size={30} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center my-5">
          <Text className="text-xl font-bold">Hello {user.email}</Text>
        </View>

        <View className="flex-row items-middle justify-between mt-5">
          <TextInput
            className="text-xl h-8"
            placeholder="Today I'm Grateful For..."
            value={gratitude}
            onChangeText={setGratitude}
          />
          <TouchableOpacity>
            <AntDesign name="plus" size={25} onPress={addGratitude} />
          </TouchableOpacity>
        </View>
        <ScrollView className="h-64 mt-10">
          {gratitudes.map((gratitude, index) => {
            return (
              <View>
                <Swipeable renderRightActions={RightActions}>
                  <View
                    className="my-4 p-4 rounded-lg bg-purple-50"
                    key={gratitude.id}
                  >
                    <Text className="text-sm ">
                      I'm Grateful For {gratitude.gratitude}
                    </Text>
                  </View>
                </Swipeable>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={styles.shadow}
          className="top-7 bg-white border-purple-50 border-solid border-2 p-8 rounded-lg"
        >
          <View>
            <Text className="text-base">{affirmation.affirmation}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default HomeScreen;
