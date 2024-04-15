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
  getDoc,
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
  const [affirmation, setAffirmation] = useState(null);
  const currentDate = new Date();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const userRef = collection(db, "users");
  const userQ = query(userRef, where("id", "==", user.uid));

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;

  const gratitudesRef = collection(db, "gratitudes");
  const q = query(
    gratitudesRef,
    where("date", "==", dateString),
    where("user", "==", user.uid)
  );

  const fetchScripture = () => {
    const options = { method: "GET", headers: { accept: "application/json" } };
    fetch(
      "https://beta.ourmanna.com/api/v1/get?format=json&order=random",
      options
    )
      .then((response) => response.json())
      .then((json) => setAffirmation(json))
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  };

  const addGratitude = () => {
    addDoc(collection(db, "gratitudes"), {
      user: user.uid,
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
    });
  };

  const getUserData = async () => {
    await getDocs(userQ)
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setUserData(newData);
      })
      .catch((error) => console.log(error));
  };

  const deleteGratitude = (id) => {
    deleteDoc(doc(db, "gratitudes", id))
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
    getGratitudes();

    fetchScripture();

    /*  return () => unsub(); */
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <View className="bg-white flex-1">
      <SafeAreaView className="mx-5">
        <View className="flex-row justify-between mt-3">
          <TouchableOpacity onPress={logout}>
            <Ionicons name="md-log-out" size={35} color={"#e0ac00"} />
          </TouchableOpacity>

          <Image
            className="h-24 w-24"
            source={require("../images/GraciousInsignia.png")}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
            <Ionicons name="settings" size={30} color={"#e0ac00"} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-middle justify-between  mt-5 p-4">
          <TextInput
            className="text-base h-8"
            placeholder="Today I'm Grateful For..."
            placeholderTextColor={"grey"}
            value={gratitude}
            onChangeText={setGratitude}
          />
          <TouchableOpacity>
            <AntDesign
              name="pluscircle"
              color={"#e0ac00"}
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
                  style={{ backgroundColor: "#FCEFB4" }}
                >
                  <Text className="text-sm ">
                    I'm Grateful For {gratitude.gratitude}
                  </Text>
                </View>
              </Swipeable>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          onLongPress={() => {
            navigation.navigate("DailyBibleVerseScreen", {
              scripture: affirmation.verse.details.text,
              verse: affirmation.verse.details.reference,
            });
          }}
        >
          <View
            style={styles.shadow}
            className="top-8
             justify-center p-8 rounded-lg"
          >
            <Text className=" text-white text-center text-sm">
              "{affirmation.verse.details.text}"
            </Text>
            <Text className=" text-gray-100 top-4 text-center text-sm">
              {affirmation.verse.details.reference}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: "black",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,

    elevation: 2,
  },
});

export default HomeScreen;
