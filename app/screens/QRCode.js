import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  // Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  // KeyboardAvoidingView,
  // TextInput,
  Platform,
  // Animated,
  // Button,
  // Linking,
  SafeAreaView,
  ScrollView,
  PermissionsAndroid
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import RNFS from "react-native-fs";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import RNQRGenerator from "rn-qr-generator";
import { Buffer } from "buffer";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Share from "react-native-share";
import Clipboard from "@react-native-community/clipboard";
import CustomAlert from "../lib/alert";
import Translate from "../assets/Translates/Translate";
import jsQR from "jsqr";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { Alert } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import ImagePicker from "react-native-image-picker";
import Request from "../lib/request";
import { useIsFocused } from "@react-navigation/native";
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
const request = new Request();
const alert = new CustomAlert();
const db = firebase.firestore();

const ratioBackArrow = width / 18 / 20;

function findParams(data, param) {
  if (data) {
    let tmps = data.split("?");
    if (tmps.length > 0) {
      let tmp = tmps[1];
      if (tmp) {
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
    }
  }
  return "";
}

async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

async function buildLink(userId, is_store) {
  const link = await dynamicLinks().buildLink(
    {
      link:
        "https://kinujo-link.c2sg.asia" + is_store + "store?userId=" + userId + "&store=" + is_store,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: "https://kinujo-link.c2sg.asia",
      android: {
        packageName: "net.c2sg.kinujo",
      },
      ios: {
        appStoreId: "123123123",
        bundleId: "net.c2sg.kinujo",
      },
    },
    dynamicLinks.ShortLinkType.UNGUESSABLE
  );
  return link + "&kinujoId=" + userId;
}

export default function QRCode(props) {
  const isFocused = useIsFocused();
  const [inviteShow, setInviteShow] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const [popupQR, setPopupQR] = useStateIfMounted(false);
  const [userId, onUserIDChanged] = useStateIfMounted(false);
  const [store, onStoreChanged] = useStateIfMounted(0);
  const [storeLink, onStoreLinkChanged] = useStateIfMounted("");
  const [userLink, onUserLinkChanged] = useStateIfMounted("");
  const [interacted, setInteracted] = useState(false);
  const [cameraTimeout, setCameraTimeout] = useState(0);
  let qrImage = "";
  React.useEffect(() => {
    if(!isFocused){
      setInviteShow(false);
      setInteracted(false);
      setCameraTimeout(10);
    }

    InteractionManager.runAfterInteractions(() => {
      setInteracted(true);
      setCameraTimeout(0);
      AsyncStorage.getItem("user").then(function (url) {
        request.get(url).then((response) => {
          onUserChanged(response.data);
        });
      });
    });
  }, [isFocused]);
  React.useEffect(() => {
    setPopupQR(false);
    setInviteShow(false);
    setInteracted(false);
    setCameraTimeout(10);
  }, [!isFocused]);

  const onSuccess = (e) => {
    const code = findParams(e.data, "kinujoId");
    if (code) {
      // alert.warning(userId.toString());

      // request.addFriend(userId, code).then(() => {
      //   request.addFriend(code, userId).then(() => {
      //     Alert.alert(
      //       Translate.t("information"),
      //       Translate.t("friendAdded"),
      //       [
      //         {
      //           text: "OK",
      //           onPress: () => {},
      //         },
      //       ],
      //       { cancelable: false }
      //     );
      //   });
      // });
      db.collection("users")
        .doc(String(userId))
        .collection("friends")
        .get()
        .then((querySnapshot) => {
          let existing_friend = 'no';
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.data())
            if (documentSnapshot.data().id.toString() == code.toString()) {
              if(documentSnapshot.data().delete == true) {
                db.collection("users")
                  .doc(String(userId))
                  .collection("friends")
                  .doc(documentSnapshot.id.toString())
                  .set(
                    {
                      delete: false,
                    },
                    {
                      merge: true,
                    }
                  )
                  .then(() => {
                    existing_friend = 'deleted';
                    Alert.alert(
                      Translate.t("information"),
                      Translate.t("friendAdded"),
                      [
                        {
                          text: "OK",
                          onPress: () => {},
                        },
                      ],
                      { cancelable: false }
                    );
                  });
              } else {
                existing_friend = 'yes';
              }
            }
          });

          if(existing_friend == 'yes') {
            alert.warning(Translate.t('friendAlreadyExist'));
          } else if(existing_friend == 'no'){
            request.addFriend(userId, code).then(() => {
              request.addFriend(code, userId).then(() => {
                Alert.alert(
                  Translate.t("information"),
                  Translate.t("friendAdded"),
                  [
                    {
                      text: "OK",
                      onPress: () => {},
                    },
                  ],
                  { cancelable: false }
                );
              });
            });
          }
        })
    } else {
      alert.warning(Translate.t("invalidQRcode"));
    }
  };

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];

        buildLink(userId, "1").then(function (link) {
          console.log(link);
          onStoreLinkChanged(link);
        });
        buildLink(userId, "0").then(function (link) {
          console.log(link);
          onUserLinkChanged(link);
        });
        onUserIDChanged(userId);
      });
    });
    return () => {};
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {<QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        reactivate={interacted}
        reactivateTimeout={5000}
        cameraTimeout={cameraTimeout}
        buttonPositive={Translate.t("ok")}
        cameraStyle={
          {
            height: heightPercentageToDP("50%")
          }
        }
        cameraTimeoutView={
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
              backgroundColor: 'black',
            }}
          >
            <Text style={{ color: 'white' }}>{Translate.t("tapForCamera")}</Text>
          </View>
        }
        customMarker={
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {inviteShow ? (<TouchableWithoutFeedback onPress={()=>{
              setInviteShow(false);
            }}>
              <CloseWhiteIcon
                style={{
                  position: "absolute",
                  alignSelf: "flex-start",
                  width: width / 18,
                  height: 20 * ratioBackArrow,
                  bottom: 45,
                  // top: 10,
                  marginLeft: widthPercentageToDP("5%"),
                  marginTop: widthPercentageToDP("5%"),
                }}
              />
            </TouchableWithoutFeedback>) : (<View></View>)}
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
                {inviteShow
                  ? Translate.t("appInviteQR")
                  : Translate.t("QRCode")}
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
       />}
        <ScrollView style={{top:heightPercentageToDP("30%")}}>
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
                <Text style={styles.submit_text}>{Translate.t("myQR")}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button_frame}>
              <TouchableOpacity
                onPress={() => {
                  const options = {
                    // noData: true,
                    includeBase64: true,
                    mediaType: "photo",
                    allowsEditing: true
                  };
                  ImagePicker.launchImageLibrary(options, (response) => {
                    if(response.uri){if(response && response.type && response.type.includes("image")){
                      RNQRGenerator.detect({
                        base64: response.data,
                        // uri: Platform.OS === "android"
                        // ? response.uri
                        // : response.uri.replace("file://", ""), // local path of the image. Can be skipped if base64 is passed.
                      })
                        .then((response) => {
                          const { values } = response; // Array of detected QR code values. Empty if nothing found.
                          const code = findParams(values[0], "kinujoId");
                          if (code) {
                            // request.addFriend(userId, code).then(() => {
                            //   Alert.alert(
                            //     Translate.t("information"),
                            //     Translate.t("friendAdded"),
                            //     [
                            //       {
                            //         text: "OK",
                            //         onPress: () => {},
                            //       },
                            //     ],
                            //     { cancelable: false }
                            //   );
                            // });
                            db.collection("users")
                              .doc(String(userId))
                              .collection("friends")
                              .get()
                              .then((querySnapshot) => {
                                let existing_friend = []
                                querySnapshot.forEach(documentSnapshot => {
                                  existing_friend.push(documentSnapshot.data().id)
                                });

                                if(existing_friend.includes(code.toString())) {
                                  alert.warning(Translate.t('friendAlreadyExist'));
                                } else {
                                  request.addFriend(userId, code).then(() => {
                                    Alert.alert(
                                      Translate.t("information"),
                                      Translate.t("friendAdded"),
                                      [
                                        {
                                          text: "OK",
                                          onPress: () => {},
                                        },
                                      ],
                                      { cancelable: false }
                                    );
                                  });
                                }
                              })
                          } else {
                            alert.warning(Translate.t("invalidQRcode"));
                          }
                        })
                        .catch((error) =>
                          console.log("Cannot detect QR code in image", error)
                        );
                      } else {
                        alert.warning(Translate.t("image_allowed"))
                      }
                    }
                  });
                }}
                style={[
                  styles.submit,
                  {
                    backgroundColor: "#E6DADE",
                  },
                ]}
              >
                <Text style={styles.submit_text}>
                  {Translate.t("readFromPhoto")}
                </Text>
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
                <Text style={styles.submit_text}>
                  {Translate.t("searchFriend")}
                </Text>
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
                <Text style={styles.submit_text}>
                  {Translate.t("appInviteQR")}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                textAlign: "center",
                alignItems: "center",
                paddingTop: RFValue(10),
              }}
            >
              <Text style={styles.notice_text}>{Translate.t("scanQR")}</Text>
              <Text style={styles.notice_text}>
                {Translate.t("qrDescription")}
              </Text>
            </View>
          </View>

          <View style={inviteShow ? null : styles.none}>
            <View style={styles.button_frame_invite}>
            <TouchableNativeFeedback onPress={() => setInviteShow(false)}>
              <CloseBlackIcon
                  style={{
                    position: "absolute",
                    alignSelf: "flex-start",
                    width: width / 18,
                    height: 20 * ratioBackArrow,
                    bottom: 55,
                    marginLeft: -(heightPercentageToDP("3%")),
                    // marginTop: widthPercentageToDP("12%"),
                  }}
                />
              </TouchableNativeFeedback>
              <TouchableOpacity
                style={[
                  styles.submit,
                  {
                    backgroundColor: "#E6DADE",
                  },
                ]}
                onPress={() => {
                  onStoreChanged(0);
                  setPopupQR(true)
                }}
              >
                <Text style={styles.submit_text}>
                  {Translate.t("generalUserInvite")}
                </Text>
              </TouchableOpacity>
            </View>
            {user && user.authority && (user.authority.id == 1 || user.authority.id == 3) ? (
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
                  <Text style={styles.submit_text}>
                    {Translate.t("storeAccInvite")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View></View>
            )}
            {/* <View style={styles.button_frame}>
              <TouchableOpacity
                style={[
                  styles.submit,
                  {
                    backgroundColor: "#E6DADE",
                  },
                ]}
                onPress={() => setInviteShow(false)}
              >
                <Text style={styles.submit_text}>{Translate.t("myQR")}</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
        </ScrollView>
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
              {inviteShow ? Translate.t("appInviteQR") : Translate.t("QRCode")}
            </Text>
            <View
              style={{
                marginTop: heightPercentageToDP(5),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={[styles.qr_image]}>
                <QRCodeIcon
                  getRef={(ref) => (qrImage = ref)}
                  size={
                    widthPercentageToDP(50)
                  }
                  value={
                    store
                      ? storeLink
                        ? storeLink
                        : "waiting"
                      : userLink
                      ? userLink
                      : "waiting"
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
            <View
              style={{
                marginTop: heightPercentageToDP(38),
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => {
                    let link = store ? storeLink : userLink;
                    Clipboard.setString(link);
                    Alert.alert(
                      Translate.t("information"),
                      Translate.t("urlCopied"),
                      [
                        {
                          text: "OK",
                          onPress: () => {},
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  <Image
                    style={[styles.image]}
                    source={require("../assets/Images/url-link-512.png")}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    let link = store ? storeLink : userLink;
                    const shareOptions = {
                      title: "",
                      message: link,
                    };
                    Share.open(shareOptions)
                      .then((res) => {})
                      .catch((err) => {});
                  }}
                >
                  <Image
                    style={[styles.image]}
                    source={require("../assets/Images/button_share-512.png")}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === "android" && !(hasAndroidPermission())) {
                      return;
                    }
                    qrImage.toDataURL((data) => {
                      RNFS.writeFile(RNFS.CachesDirectoryPath+"/qrImage.png", data, 'base64')
                        .then((success) => {
                          return CameraRoll.save(RNFS.CachesDirectoryPath+"/qrImage.png", 'photo');
                        })
                        .then(() => {
                          Alert.alert(
                            Translate.t("information"),
                            Translate.t("qrImageSaved"),
                            [
                              {
                                text: "OK",
                                onPress: () => {},
                              },
                            ],
                            { cancelable: false }
                          );
                        })
                    });
                  }}
                >
                  <Image
                    style={[styles.image]}
                    source={require("../assets/Images/download-png.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40
  },
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
    paddingTop: RFValue(15),
  },
  qrcode_frame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height / 2 - heightPercentageToDP("20%"),
    width: "100%",
    backgroundColor: "transparent",
    paddingBottom: heightPercentageToDP("10%"),
  },
  scan_qr_frame: {
    width: height / 2 - heightPercentageToDP("20%"),
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
    marginTop: RFValue(10),
  },
  button_frame_invite: {
    width: "80%",
    marginLeft: "10%",
    marginTop: RFValue(50),
  },
  submit: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  submit_text: {
    color: "#FFF",
    textAlign: "center",
    fontSize: RFValue(10),
  },
  notice_text: {
    color: "#000",
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
    flex: 1,
    alignItems: "center",
  },
});
