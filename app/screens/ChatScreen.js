import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavigationTab from "../assets/BottomNavigationTab";
export default function ChatScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Area */}
        <SafeAreaView style={styles.topContainer}>
          <Image
            style={styles.backButton}
            source={require("../assets/Images/back.png")}
          />
          <Image
            style={styles.kinujoTitle}
            source={require("../assets/Images/kinu.png")}
          />

          <Text style={styles.chatScreenTitle}>チャット</Text>
          <Image
            style={styles.cartButton}
            source={require("../assets/Images/cart.png")}
          />
        </SafeAreaView>
        {/* Below The Most Top */}
        <View
          style={{
            backgroundColor: "#F0EEE9",
            height: "10%",
            flexDirection: "row",
          }}
        >
          <Image
            style={{
              borderRadius: 150 / 2,
              alignSelf: "center",
              left: 30,
              width: 50,
              height: 50,
            }}
            source={require("../assets/favicon.png")}
          />
          <Text style={{ alignSelf: "center", marginLeft: 40 }}>
            相手またはグループの名前
          </Text>
        </View>
        {/* Chat Area */}
        <LinearGradient
          height="65%"
          colors={["#E4DBC0", "#C2A059"]}
          start={[0, 0]}
          end={[1, 0.6]}
        >
          {/* Left Chat */}
          <View
            style={{
              height: "25%",
              marginTop: "5%",
            }}
          >
            <Text style={{ alignSelf: "center" }}>9/14</Text>
            <View
              style={{
                height: "60%",
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <Image
                style={{
                  marginLeft: "5%",
                  borderRadius: 150 / 2,
                  width: 35,
                  height: 35,
                }}
                source={require("../assets/Images/add.png")}
              />
              <Text
                style={{
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "60%",
                  height: "100%",
                  marginLeft: 10,
                  backgroundColor: "white",
                }}
              >
                hi
              </Text>
              <Text style={{ alignSelf: "flex-end", marginLeft: 10 }}>
                0:00
              </Text>
            </View>
          </View>
          {/* Right Chat */}
          <View
            style={{
              height: "25%",
            }}
          >
            <Text style={{ alignSelf: "center" }}>9/14</Text>
            <View
              style={{
                height: "60%",
                marginTop: 10,
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  paddingLeft: 10,
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "60%",
                  height: "100%",
                  marginRight: "5%",
                  backgroundColor: "#E6DADE",
                }}
              >
                hi
              </Text>
              <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>
                0:00
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Bottom Area */}
        <View
          style={{
            height: "8%",
            backgroundColor: "#F0EEE9",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            style={{ marginLeft: "3%", width: 35, height: 35 }}
            source={require("../assets/Images/add.png")}
          ></Image>
          <View
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextInput style={styles.userTextInput}></TextInput>
            <Image
              style={{
                position: "absolute",
                left: "75%",
              }}
              source={require("../assets/Images/emoji.png")}
            ></Image>
          </View>
          <Image
            style={{ marginRight: "5%", width: 35, height: 35 }}
            source={require("../assets/Images/send.png")}
          ></Image>
        </View>

        <BottomNavigationTab />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "10%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    marginLeft: "5%",
    width: 30,
    height: 30,
  },
  chatScreenTitle: {
    right: "60%",
  },
  kinujoTitle: {
    right: 30,
    width: 100,
  },
  cartButton: {
    marginRight: "5%",
    width: 30,
    height: 30,
    alignItems: "flex-end",
  },
  userTextInput: {
    color: "black",
    paddingLeft: 10,
    borderWidth: 1,
    color: "white",
    height: "60%",
    width: "70%",
    borderRadius: 35,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
