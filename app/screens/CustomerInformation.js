import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Modal,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import QRCodeIcon from "react-native-qrcode-svg";
import CloseBlackIcon from "../assets/icons/close_black.svg";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { useIsFocused } from "@react-navigation/native";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const chatRef = db.collection("chat");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioChatIcon = win.width / 12 / 21;
const ratioQRIcon = win.width / 13 / 21;
const ratioBackArrow = win.width / 18 / 20;
const ratioNext = win.width / 38 / 8;
const ratioProfileEditingIcon = win.width / 18 / 22;
const ratioCameraIconInsideProfilePicture = win.width / 20 / 25;
let chatPersonID;
let ownUserID;
let groupName;
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
async function buildLink(userId, is_store) {
  const link = await dynamicLinks().buildLink(
    {
      link:
        "https://kinujo.page.link?userId=" + userId + "&is_store=" + is_store,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: "https://kinujo.page.link",
      android: {
        packageName: "com.example.kinujo",
      },
      ios: {
        appStoreId: "123123123",
        bundleId: "com.example.kinujo",
      },
    },
    dynamicLinks.ShortLinkType.UNGUESSABLE
  );
  console.log(link + "&kinujoId=" + userId);
  return link + "&kinujoId=" + userId;
}
export default function CustomerInformation(props) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const [inviteShow, setInviteShow] = useState(false);
  const [firebaseUser, onFirebaseUserChanged] = React.useState({});
  const [userId, onUserIdChanged] = React.useState("");
  const [customerId, onCustomerIdChanged] = React.useState("");
  const [memo, onMemoChanged] = React.useState("");
  const [modal, onModalChanged] = React.useState(false);
  const [popupQR, setPopupQR] = useState(false);
  const [storeLink, onStoreLinkChanged] = useState("");
  const [existsFlag, onExistsFlag] = React.useState(false);
  const [store, onStoreChanged] = useState(0);
  const [userLink, onUserLinkChanged] = useState("");
  React.useEffect(() => {
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
      onUserIdChanged(userId);
    });

    return () => {};
  }, []);
  React.useEffect(() => {
    setPopupQR(false);
  }, [!isFocused]);
  chatPersonID = user.id;
  groupName = user.real_name;
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      onUserIdChanged(userId);

      let customerUrls = props.route.params.url.split("/");
      customerUrls = customerUrls.filter((url) => {
        return url;
      });
      let customerId = customerUrls[customerUrls.length - 1];
      onCustomerIdChanged(customerId);

      const subscriber = db
        .collection("users")
        .doc(userId)
        .collection("customers")
        .doc(customerId)
        .onSnapshot((documentSnapshot) => {
          if (documentSnapshot.data()) {
            onFirebaseUserChanged(documentSnapshot.data());
            onMemoChanged(documentSnapshot.data().memo);
          } else {
            onFirebaseUserChanged({
              memo: "",
              displayName: "",
              secret_mode: false,
              block: false,
            });
          }
        });
    });
  }, []);
  if (!user.url) {
    request
      .get(props.route.params.url)
      .then(function (response) {
        onUserChanged(response.data);
      })
      .catch(function (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          Object.keys(error.response.data).length > 0
        ) {
          alert.warning(
            error.response.data[Object.keys(error.response.data)[0]][0] +
              "(" +
              Object.keys(error.response.data)[0] +
              ")"
          );
        }
      });
  }
  const sendMessageHandler = () => {
    let groupID;
    let groupName;
    chatRef
      .where("users", "array-contains", ownUserID)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            if (users[i] == chatPersonID) {
              groupID = snapShot.doc.id;
              groupName = snapShot.doc.data().groupName;
            }
          }
        });
        if (groupID != null) {
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: user.real_name,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + ownUserID;
          let friendMessageUnseenField = "unseenMessageCount_" + chatPersonID;
          let ownTotalMessageReadField = "totalMessageRead_" + ownUserID;
          let friendTotalMessageReadField = "totalMessageRead_" + chatPersonID;
          chatRef
            .add({
              groupName: user.real_name,
              users: [String(ownUserID), String(chatPersonID)],
              totalMessage: 0,
              [ownMessageUnseenField]: 0,
              [friendMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              [friendTotalMessageReadField]: 0,
            })
            .then(function (docRef) {
              props.navigation.navigate("ChatScreen", {
                groupID: docRef.id,
                groupName: user.real_name,
              });
            });
        }
      });
  };
  AsyncStorage.getItem("user").then(function (url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    ownUserID = urls[urls.length - 1];
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("customerInformation")}
      />
      <View>
        <ImageBackground
          style={{
            width: widthPercentageToDP("100%"),
            height: heightPercentageToDP("30%"),
          }}
          source={require("../assets/Images/profileEditingIcon.png")}
        ></ImageBackground>
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
                  store
                    ? storeLink
                      ? storeLink
                      : "waiting"
                    : userLink
                    ? userLink
                    : "waiting"
                }
              />
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: heightPercentageToDP("-7%"),
          width: widthPercentageToDP("100%"),
          left: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginLeft: widthPercentageToDP("5%"),
          }}
        >
          <ImageBackground
            style={{
              width: widthPercentageToDP("22%"),
              height: widthPercentageToDP("22%"),
              borderWidth: 1,
              borderColor: Colors.E6DADE,
              backgroundColor: "white",
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          ></ImageBackground>
          <View
            style={{
              width: "100%",
              marginLeft: widthPercentageToDP("5%"),
              marginTop: heightPercentageToDP("1%"),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12),
                color: Colors.white,
              }}
            >
              {user.word}
            </Text>
            <View
              style={{
                alignItems: "center",
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                }}
              >
                {user.nickname}
              </Text>
              <Image
                style={{
                  width: win.width / 18,
                  height: 25 * ratioProfileEditingIcon,
                  marginLeft: widthPercentageToDP("3%"),
                }}
                source={require("../assets/Images/profileEditingIcon.png")}
              />
            </View>
          </View>
        </View>
        <Text
          style={{
            fontSize: RFValue(10),
            marginLeft: widthPercentageToDP("5%"),
            marginTop: heightPercentageToDP("1.5%"),
          }}
        >
          KINUJO ID : {user.user_code}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            onModalChanged(true);
          }}
        >
          <Text style={styles.notes}>
            {Translate.t("note")}：{firebaseUser.memo}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("CreateFolder")}
        >
          <View style={styles.firstTabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("folderSetting")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("Contact")}
        >
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("sharingGroup")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                right: 0,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginRight: widthPercentageToDP("10%"),
                  fontSize: RFValue(12),
                }}
              >
                QQ
              </Text>
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.navigate("AdvanceSetting", {
              url: props.route.params.url,
            })
          }
        >
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainer}>
              {Translate.t("advancedSetting")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginTop: heightPercentageToDP("10%"),
          }}
        >
          <TouchableWithoutFeedback onPress={sendMessageHandler}>
            <View style={{ alignItems: "center" }}>
              <Image
                style={{
                  width: win.width / 12,
                  height: 18 * ratioChatIcon,
                }}
                source={require("../assets/Images/chatIcon.png")}
              />
              <Text style={styles.textForQRandMessage}>
                {Translate.t("sendAMessage")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setPopupQR(true)}>
            <View style={{ alignItems: "center" }}>
              <Image
                style={{
                  width: win.width / 13,
                  height: 21 * ratioQRIcon,
                }}
                source={require("../assets/Images/QRIcon.png")}
              />
              <Text style={styles.textForQRandMessage}>
                {Translate.t("QRCode")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholderTextColor="gray"
              backgroundColor="white"
              placeholder="入力してください"
              maxLength={500}
              multiline={true}
              value={memo}
              onChangeText={(value) => {
                onMemoChanged(value);
              }}
              style={{
                fontSize: RFValue(16),
                color: "black",
                alignSelf: "center",
                width: widthPercentageToDP("50%"),
                height: heightPercentageToDP("50%"),
                marginLeft: widthPercentageToDP("2%"),
                marginTop: heightPercentageToDP("5%"),
              }}
            ></TextInput>
            <TouchableWithoutFeedback
              onPress={() => {
                onModalChanged(false);
                db.collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(customerId)
                  .set({
                    secretMode: firebaseUser.secretMode
                      ? firebaseUser.secretMode
                      : false,
                    blockMode: firebaseUser.blockMode
                      ? firebaseUser.blockMode
                      : false,
                    displayName: firebaseUser.displayName
                      ? firebaseUser.displayName
                      : "",
                    memo: memo,
                  });
              }}
            >
              <View
                backgroundColor="#E6DADE"
                style={{
                  width: widthPercentageToDP("50%"),
                  alignSelf: "center",
                  color: "white",
                  textAlign: "center",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                  }}
                >
                  Save
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notes: {
    marginHorizontal: widthPercentageToDP("5%"),
    marginTop: heightPercentageToDP("2%"),
    fontSize: RFValue(12),
  },
  tabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("5.2%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: widthPercentageToDP("4%"),
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
  },
  firstTabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("5.2%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("4%"),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  textInContainer: {
    fontSize: RFValue(12),
  },
  textForQRandMessage: {
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP("2%"),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  cameraIconInsideProfilePicture: {
    position: "absolute",
    left: 0,
    bottom: 0,
    marginLeft: widthPercentageToDP("2.5%"),
    marginBottom: heightPercentageToDP("1%"),
    width: win.width / 20,
    height: 23 * ratioCameraIconInsideProfilePicture,
  },
  popup_qr: {
    // position: "absolute",
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
    // b`ackgroundColor: "orange",
  },
  qr_image: {
    width: widthPercentageToDP(60),
    height: height / 2,
  },
  none: {
    display: "none",
  },
});
