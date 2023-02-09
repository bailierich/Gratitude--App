import "react-native-gesture-handler";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PastGratitudesScreen from "./screens/PastGratitudesScreen";
import SignUpScreen from "./screens/SignUpScreen";
import useAuth from "./hooks/useAuth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import JournalEntryScreen from "./screens/JournalEntryScreen";
import EditJournalEntryScreen from "./screens/EditJournalEntryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Daily Gratitude") {
            iconName = focused ? "smileo" : "smile-circle";
          } else if (route.name === "Journal") {
            iconName = focused ? "journal" : "journal-outline";
          }

          // You can return any component that you like here!
          return route.name === "Daily Gratitude" ? (
            <AntDesign name={iconName} size={size} color={color} />
          ) : (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarStyle: { height: 100, backgroundColor: "#CDB64C" },
      })}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Daily Gratitude"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Journal"
        component={PastGratitudesScreen}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen
              name="HomeGroup"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Journal Entry" component={JournalEntryScreen} />
            <Stack.Screen
              name="Edit Entry"
              component={EditJournalEntryScreen}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={SettingsScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
