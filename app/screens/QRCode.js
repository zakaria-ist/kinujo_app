import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Animated,
  StatusBar,
  Button,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ratioBackArrow = width / 18 / 20;

export default function QRCode(props) {
  const [inviteShow, setInviteShow] = useState(false);
  const [popupQR, setPopupQR] = useState(false);
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <StatusBar
          style={{
            height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            left: 0,
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback>
            <Image
              style={{
                width: width / 18,
                height: 20 * ratioBackArrow,
                marginLeft: widthPercentageToDP("5%"),
              }}
              source={require("../assets/icons/close_white.svg")}
            />
          </TouchableWithoutFeedback>
        </View>
        <Text
          style={{
            justifyContent: "center",
            alignSelf: "center",
            color: "#FFF",
            fontSize: RFValue(15),
          }}
        >
          {inviteShow ? "App invitation QR code" : "QR Code"}
        </Text>
      </View>
      <View style={styles.qrcode_frame}>
        <View style={styles.scan_qr_frame}>
          <Image
            style={{
              height: "100%",
              width: "100%",
            }}
            source={require("../assets/icons/scan_qr.svg")}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.qrcode_button}>
        <View style={inviteShow ? styles.none : null}>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setPopupQR(true)}
            >
              <Text style={styles.submitText}>My QR code</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
            >
              <Text style={styles.submitText}>Read from photo</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.button_frame}>
            <TouchableHighlight
              onPress={() => props.navigation.navigate("")}
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
            >
              <Text style={styles.submitText}>Search friend by ID</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#D8CDA7",
                },
              ]}
              onPress={() => setInviteShow(true)}
            >
              <Text style={styles.submitText}>App invitation QR code</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              textAlign: "center",
              paddingTop: 20,
            }}
          >
            <Text>Scan the QR code</Text>
            <Text>You can use functions such as adding friends</Text>
          </View>
        </View>

        <View style={inviteShow ? null : styles.none}>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setPopupQR(true)}
            >
              <Text style={styles.submitText}>Generate user invitation</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
            >
              <Text style={styles.submitText}>Store account invitation</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.button_frame}>
            <TouchableHighlight
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setInviteShow(false)}
            >
              <Text style={styles.submitText}>My QR code</Text>
            </TouchableHighlight>
          </View>
        </View>

        <View style={popupQR ? styles.popup_qr : styles.none}>
          <View>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                left: 0,
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback onPress={() => setPopupQR(false)}>
                <Image
                  style={{
                    width: width / 18,
                    height: 20 * ratioBackArrow,
                    marginLeft: widthPercentageToDP("5%"),
                  }}
                  source={require("../assets/icons/close_black.svg")}
                />
              </TouchableWithoutFeedback>
            </View>
            <Text
              style={{
                justifyContent: "center",
                alignSelf: "center",
                color: "#000",
                fontSize: RFValue(15),
              }}
            >
              {inviteShow ? "App invitation QR code" : "My QR Code"}
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={[styles.qr_image]}>
                <Image
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  source={{
                    uri:
                      "https://boofcv.org/images/thumb/3/35/Example_rendered_qrcode.png/400px-Example_rendered_qrcode.png",
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: heightPercentageToDP("10%"),
    justifyContent: "space-evenly",
    backgroundColor: "#000",
  },
  qrcode_frame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height / 2 - heightPercentageToDP("5%"),
    backgroundColor: "#000",
  },
  scan_qr_frame: {
    width: 250,
    height: height / 2 - heightPercentageToDP("5%"),
  },
  qrcode_button: {
    height: height / 2 - heightPercentageToDP("5%"),
    backgroundColor: "#FFF",
    paddingTop: 10,
  },
  none: {
    display: "none",
  },
  button_frame: {
    width: "80%",
    marginLeft: "10%",
    marginTop: 10,
  },
  submit: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  submitText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: RFValue(10),
  },
  popup_qr: {
    backgroundColor: "#FFF",
    paddingTop: 20,
    color: "#000",
    width: "90%",
    height: height / 1.5,
    position: "relative",
    bottom: 0,
    left: "5%",
    right: "5%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qr_image: {
    width: widthPercentageToDP(60),
    height: height / 1.5 - heightPercentageToDP("10%"),
  },
});
