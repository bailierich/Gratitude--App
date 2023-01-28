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
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import Swipeable from "react-native-gesture-handler/Swipeable";
import LoadingScreen from "../components/LoadingScreen";

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
        getGratitudes();
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
      setLoading(false);
    });
  };

  const deleteGratitude = async (id) => {
    await deleteDoc(doc(db, "gratitudes", id))
      .then(getGratitudes())
      .catch((error) => alert(error));
  };

  const RightActions = (id) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => deleteGratitude(id)}
          style={{
            margin: 10,
            borderRadius: 30,
            backgroundColor: "#ffdd32",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 20,
            padding: 5,
          }}
        >
          <Animated.Text
            style={{
              color: "black",
              fontWeight: "600",
              paddingHorizontal: 4,
            }}
          >
            delete
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

    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists) {
        navigation.navigate("Modal");

        console.log("this ran");
      } else {
        console.log("this is running");
      }
    });
    getGratitudes();
    return () => unsub();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <View className="bg-white flex-1">
      <SafeAreaView className="mx-5">
        <View className="flex-row justify-between mt-3">
          <TouchableOpacity onPress={logout}>
            <Ionicons name="md-log-out" size={35} color={"#ffdd32"} />
          </TouchableOpacity>

          <Image
            className="h-24 w-24"
            source={require("../images/GraciousInsignia.png")}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
            <Ionicons name="settings" size={30} color={"#ffdd32"} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center my-5">
          <Text className="text-xl font-bold">Hello {user.email}</Text>
        </View>

        <View className="flex-row items-middle justify-between mx-4 mt-5">
          <TextInput
            className="text-xl h-8"
            placeholder="Today I'm Grateful For..."
            value={gratitude}
            onChangeText={setGratitude}
          />
          <TouchableOpacity>
            <AntDesign
              name="pluscircle"
              color={"#ffdd32"}
              size={25}
              onPress={addGratitude}
            />
          </TouchableOpacity>
        </View>
        <ScrollView keyboardDismissMode="interactive" className="h-64 mt-10">
          {gratitudes.map((gratitude) => {
            return (
              <Swipeable
                key={gratitude.id}
                renderRightActions={() => RightActions(gratitude.id)}
              >
                <View
                  className="my-4 p-4 rounded-lg "
                  style={{ backgroundColor: "#fffae5" }}
                >
                  <Text className="text-sm ">
                    I'm Grateful For {gratitude.gratitude}
                  </Text>
                </View>
              </Swipeable>
            );
          })}
        </ScrollView>
        <View
          style={styles.shadow}
          className="top-7 justify-center p-8 rounded-lg"
        >
          <View>
            <Text className=" text-center text-base">
              {affirmation.affirmation}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: "#ffd400",
    shadowColor: "#fffae5",
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
