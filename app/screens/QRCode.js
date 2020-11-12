import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Animated,
  StatusBar,
  Button,
  Linking,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import jsQR from "jsqr";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";

import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import ImagePicker from 'react-native-image-picker'

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
import CloseWhiteIcon from "../assets/icons/close_white.svg";
import CloseBlackIcon from "../assets/icons/close_black.svg";
import QRFrameIcon from "../assets/icons/scan_qr.svg";
import firebase from "firebase/app";
import "firebase/firestore";
import QRCodeIcon from "react-native-qrcode-svg";
import { firebaseConfig } from "../../firebaseConfig.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const ratioBackArrow = width / 18 / 20;

function findParams(data, param) {
  let tmps = data.split("?");
  if (tmps.length > 0) {
    let tmp = tmps[1];
    let params = tmp.split("&");
    let searchParams = params.filter((tmpParam) => {
      return tmpParam.indexOf(param) >= 0;
    });
    if (searchParams.length > 0) {
      let foundParam = searchParams[0];
      let foundParams = foundParam.split("=");
      if (foundParams.length > 0) {
        return foundParams[1];
      }
    }
  }
  return "";
}
export default function QRCode(props) {
  const [inviteShow, setInviteShow] = useState(false);
  const [popupQR, setPopupQR] = useState(false);
  const [userId, onUserIDChanged] = useState(false);
  const [store, onStoreChanged] = useState(0);
  const onSuccess = (e) => {
    const code = findParams(e.data, "kinujoId");
    if (code) {
      firestore()
        .collection("users")
        .doc(userId)
        .collection("friends")
        .where("id", "==", code)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot && querySnapshot.data()) {
          } else {
            db.collection("users")
              .doc(userId)
              .collection("friends")
              .add({
                type: "user",
                id: code,
              });
          }
          alert.warning("Friend Added");
        });
    } else {
      alert.warning("Invalid QR Code");
    }
  };

  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function(url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onUserIDChanged(userId);
    });
  }, []);

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        customMarker={
          <View style={{ width: "100%", height: "100%" }}>
            <View style={styles.header}>
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  left: 0,
                  alignItems: "center",
                }}
              ></View>
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
                <QRFrameIcon
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        }
        flashMode={RNCamera.Constants.FlashMode.off}
        topViewStyle={styles.none}
        bottomViewStyle={styles.none}
      />
      <View style={styles.qrcode_button}>
        <View style={inviteShow ? styles.none : null}>
          <View style={styles.button_frame}>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setPopupQR(true)}
            >
              <Text style={styles.submitText}>My QR code</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity
              onPress={() => {
                ImagePicker.launchImageLibrary(options, (response) => {
                  var i = new Image();
                  i.onload = function() {
                    const code = findParams(
                      jsQR(response.data, i.width, i.height),
                      "kinujoId"
                    );
                    if (code) {
                      firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("friends")
                        .where("id", "==", code)
                        .get()
                        .then((querySnapshot) => {
                          if (querySnapshot && querySnapshot.data()) {
                          } else {
                            db.collection("users")
                              .doc(userId)
                              .collection("friends")
                              .add({
                                type: "user",
                                id: code,
                              });
                          }
                          alert.warning("Friend Added");
                        });
                    } else {
                      alert.warning("Invalid QR Code.");
                    }
                  };

                  i.src = response.data;
                });
              }}
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
            >
              <Text style={styles.submitText}>Read from photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("FriendSearch")}
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
            >
              <Text style={styles.submitText}>Search friend by ID</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor: "#D8CDA7",
                },
              ]}
              onPress={() => setInviteShow(true)}
            >
              <Text style={styles.submitText}>App invitation QR code</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              textAlign: "center",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <Text>Scan the QR code</Text>
            <Text>You can use functions such as adding friends</Text>
          </View>
        </View>

        <View style={inviteShow ? null : styles.none}>
          <View style={styles.button_frame}>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setPopupQR(true)}
            >
              <Text style={styles.submitText}>Generate user invitation</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => {
                onStoreChanged(1);
                setPopupQR(true);
              }}
            >
              <Text style={styles.submitText}>Store account invitation</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button_frame}>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor: "#E6DADE",
                },
              ]}
              onPress={() => setInviteShow(false)}
            >
              <Text style={styles.submitText}>My QR code</Text>
            </TouchableOpacity>
          </View>
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
              zIndex: 10,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                onStoreChanged(0);
                setPopupQR(false);
              }}
            >
              <CloseBlackIcon
                style={{
                  width: width / 18,
                  height: 20 * ratioBackArrow,
                  marginLeft: widthPercentageToDP("5%"),
                }}
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
              marginTop: heightPercentageToDP(10),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={[styles.qr_image]}>
              <QRCodeIcon
                size={widthPercentageToDP(60)}
                value={
                  "shortlink://kinujo?kinujoId=" + userId + "&is_store=" + store
                }
              />
              {/* <Image
                source={{
                  uri:
                    "https://boofcv.org/images/thumb/3/35/Example_rendered_qrcode.png/400px-Example_rendered_qrcode.png",
                }}
                resizeMode="contain"
              /> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: heightPercentageToDP("10%"),
    width: "100%",
    justifyContent: "space-evenly",
    backgroundColor: "transparent",
    paddingTop: 15,
  },
  qrcode_frame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height / 2 - heightPercentageToDP("10%"),
    backgroundColor: "transparent",
    paddingBottom: heightPercentageToDP("5%"),
  },
  scan_qr_frame: {
    width: 200,
    height: "100%",
  },
  qrcode_button: {
    height: height / 2 - heightPercentageToDP("12%"),
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
    height: height / 2 + heightPercentageToDP("5%"),
    position: "absolute",
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
    zIndex: 1,
  },
  qr_image: {
    width: widthPercentageToDP(60),
    height: height / 2,
  },
});

//AppRegistry.registerComponent('default', () => ScanScreen);
