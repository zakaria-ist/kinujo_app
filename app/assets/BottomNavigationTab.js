import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../screens/ChatScreen";
import LoginScreen from "../screens/LoginScreen11";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
export default function BottomNavigationTab() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,

          style: { height: 60 },
        }}
      >
        {/* Home Screen */}
        <Tab.Screen
          name="Home"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationHome.png")}
              />
            ),
          }}
        />
        {/* Profile Screen */}
        <Tab.Screen
          name="Profile"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationProfile.png")}
              />
            ),
          }}
        />
        {/* Chat Screen */}
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationChat.png")}
              />
            ),
          }}
        />
        {/* Payment Screen */}
        <Tab.Screen
          name="Payment"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationPayment.png")}
              />
            ),
          }}
        />
        {/* Picture Screen */}
        <Tab.Screen
          name="Picture"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationPicture.png")}
              />
            ),
          }}
        />
        {/* Others Screen */}
        <Tab.Screen
          name="Others"
          component={LoginScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../assets/Images/bottomNavigationOthers.png")}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
