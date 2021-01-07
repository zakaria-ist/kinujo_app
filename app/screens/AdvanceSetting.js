import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Icon } from "react-native-elements";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { block } from "react-native-reanimated";
import { Alert } from "react-native";
const request = new Request();
const alert = new CustomAlert();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const updateDeleteUser = (ownUserID, chatPersonID) => {
  let groupID;
  let groupName;
  db.collection("chat")
    .where("users", "array-contains", ownUserID)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.docChanges().forEach((snapShot) => {
        let users = snapShot.doc.data().users;
        if(users.length == 2){
          for (var i = 0; i < users.length; i++) {
            if (users[i] == chatPersonID) {
              groupID = snapShot.doc.id;
              groupName = snapShot.doc.data().groupName;
            }
          }
        }
      });
      update["delete_" + ownUserID] = true;
      update["popup_addfriend_" + chatPersonID] = true;
      if (groupID != null) {
        db.collection("chat").doc(groupID).set(update, {
          merge: true,
        });
      }
      db.collection("users").doc(String(ownUserID)).collection("friends").doc(String(chatPersonID)).set({
        delete: true
      }, {
        merge: true,
      });
    });
};
export default function AdvanceSetting(props) {
  const [userId, onUserIdChanged] = React.useState("");
  const [customerId, onCustomerIdChanged] = React.useState("");
  const [customer, setCustomer] = React.useState({});
  const [firebaseUser, onFirebaseUserChanged] = React.useState({});
  const [secretMode, onSecretModeChanged] = React.useState(false);
  const [blockMode, onBlockModeChanged] = React.useState(false);
  const [editDisplayName, onEditDisplayNameChanged] = React.useState(false);
  const [displayName, onDisplayNameChanged] = React.useState("");
  const [firstLoaded, onFirstLoadedChanged] = React.useState(false);
  const [showDeletePopUp, onShowDeletePopUp] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];

      let customerUrls = props.route.params.url.split("/");
      customerUrls = customerUrls.filter((url) => {
        return url;
      });
      let customerId = customerUrls[customerUrls.length - 1];
      onUserIdChanged(userId);
      onCustomerIdChanged(customerId);

      request.get("profiles/" + customerId).then((response) => {
        console.log(response.data);
        setCustomer(response.data);

        const subscriber = db
          .collection("users")
          .doc(userId)
          .collection("customers")
          .doc(customerId)
          .onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()) {
              let tmpUser = documentSnapshot.data();
              onFirebaseUserChanged(documentSnapshot.data());
              if (!firstLoaded) {
                onBlockModeChanged(tmpUser.blockMode);
                onSecretModeChanged(tmpUser.secretMode);
                if (!tmpUser.displayName) {
                  onDisplayNameChanged(
                    response.data.nickname ? response.data.nickname : ""
                  );
                } else {
                  onDisplayNameChanged(tmpUser.displayName);
                }
              }
              onFirstLoadedChanged(true);
            } else {
              onFirebaseUserChanged({
                memo: "",
                displayName: "",
                secret_mode: false,
                block: false,
              });
              if (!firstLoaded) {
                onBlockModeChanged(false);
                onSecretModeChanged(false);
                onDisplayNameChanged("");
              }
              onFirstLoadedChanged(true);
            }
          });
      });
    });
  }, []);

  if (!userId) {
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="详细设定"
        onBack={() => {
          props.navigation.goBack();
        }}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
      <View>
        <View style={styles.firstTabContainer}>
          <Text style={styles.textInTabs}>Edit display name</Text>
          {editDisplayName == true ? (
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Icon
                reverse
                name="check"
                type="font-awesome"
                size={RFValue("12")}
                underlayColor="transparent"
                color="transparent"
                reverseColor="black"
                onPress={() => {
                  onEditDisplayNameChanged(false);
                  db.collection("users")
                    .doc(userId)
                    .collection("customers")
                    .doc(customerId)
                    .set({
                      blockMode: blockMode,
                      secretMode: secretMode,
                      displayName: displayName,
                      memo: firebaseUser.memo,
                    });
                }}
              />
              <TextInput
                value={displayName}
                onChangeText={(value) => onDisplayNameChanged(value)}
                style={styles.textInputEdit}
              />
            </View>
          ) : (
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Icon
                reverse
                name="pencil"
                type="font-awesome"
                size={RFValue("12")}
                underlayColor="transparent"
                color="transparent"
                reverseColor="black"
                onPress={() => onEditDisplayNameChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{displayName}</Text>
            </View>
          )}
        </View>
        <View style={styles.tabContainer}>
          <Text style={styles.textInTabs}>Secret mode</Text>
          <Switch
            trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
            thumbColor={secretMode ? Colors.D7CCA6 : "grey"}
            style={{
              position: "absolute",
              right: 0,
            }}
            onValueChange={(value) => {
              let deleted = "delete_" + userId;
              db.collection("users")
                .doc(userId)
                .collection("customers")
                .doc(customerId)
                .set({
                  secretMode: value,
                  blockMode: blockMode,
                  displayName: displayName,
                  memo: firebaseUser.memo,
                });
              db.collection("chat")
                .where("users", "array-contains", String(userId))
                .get()
                .then((querySnapshot) => {
                  querySnapshot.docChanges().forEach((snapShot) => {
                    let users = snapShot.doc.data().users;
                    let chatRoomID;
                    for (var i = 0; i < users.length; i++) {
                      if (users[i] == customerId && users.length == 2) {
                        chatRoomID = snapShot.doc.id;
                        console.log(chatRoomID);
                      }
                    }
                    if (chatRoomID) {
                      console.log(value);
                      db.collection("chat")
                        .doc(chatRoomID)
                        .set(
                          {
                            [deleted]: value,
                          },
                          {
                            merge: true,
                          }
                        );
                    }
                  });
                });
              onSecretModeChanged(value);
            }}
            value={secretMode}
          />
        </View>
        <View style={styles.tabContainer}>
          <Text style={styles.textInTabs}>Block</Text>
          <Switch
            trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
            thumbColor={blockMode ? Colors.D7CCA6 : "grey"}
            style={{
              position: "absolute",
              right: 0,
            }}
            onValueChange={(value) => {
              db.collection("users")
                .doc(userId)
                .collection("customers")
                .doc(customerId)
                .set({
                  blockMode: value,
                  secretMode: secretMode,
                  displayName: displayName,
                  memo: firebaseUser.memo,
                });
              onBlockModeChanged(value);
            }}
            value={blockMode}
          />
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          Alert.alert(
            Translate.t("warning"),
            Translate.t("cannotUndone"),
            [
              {
                text: "YES",
                onPress: () => {
                  db.collection("users")
                    .doc(userId)
                    .collection("customers")
                    .doc(customerId)
                    .delete();
                  updateDeleteUser(userId, customerId);
                  request
                    .post("removeReferral/", {
                      userId: customerId,
                      parentId: userId,
                    })
                    .then(function (response) {
                      props.navigation.navigate("CustomerList");
                    });
                },
              },
              {
                text: "NO",
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
          // db.collection("users")
          //   .doc(userId)
          //   .collection("customers")
          //   .doc(customerId)
          //   .delete();
          // request
          //   .post("removeReferral/", {
          //     userId: customerId,
          //     parentId: userId,
          //   })
          //   .then(function (response) {});
        }}
      >
        <View
          style={{
            backgroundColor: Colors.D7CCA6,
            marginHorizontal: widthPercentageToDP("3%"),
            justifyContent: "center",
            alignItems: "center",
            height: heightPercentageToDP("5%"),
            borderRadius: 5,
            marginTop: heightPercentageToDP("10%"),
          }}
        >
          <Text style={{ fontSize: RFValue(14), color: "white" }}>Delete</Text>
        </View>
      </TouchableWithoutFeedback>
      {showDeletePopUp == true ? (
        <View
          style={{
            position: "absolute",
            alignSelf: "center",
            justifyContent: "center",
            backgroundColor: "white",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            flex: 1,
            marginHorizontal: widthPercentageToDP("15%"),
            marginVertical: heightPercentageToDP("37%"),
            borderWidth: 1,
            borderColor: Colors.D7CCA6,
          }}
        >
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: RFValue(12),
                marginLeft: widthPercentageToDP("1%"),
                // marginTop: heightPercentageToDP("3%"),
              }}
            >
              Warning: {Translate.t("cannotUndone")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: heightPercentageToDP("6%"),
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  db.collection("users")
                    .doc(userId)
                    .collection("customers")
                    .doc(customerId)
                    .delete();
                  request
                    .post("removeReferral/", {
                      userId: customerId,
                      parentId: userId,
                    })
                    .then(function (response) {});
                }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    paddingVertical: heightPercentageToDP("1%"),
                    paddingHorizontal: widthPercentageToDP("8%"),
                    backgroundColor: Colors.D7CCA6,
                  }}
                >
                  <Text>Yes</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => onShowDeletePopUp(false)}
              >
                <View
                  style={{
                    borderRadius: 5,
                    paddingVertical: heightPercentageToDP("1%"),
                    paddingHorizontal: widthPercentageToDP("8%"),
                    backgroundColor: Colors.D7CCA6,
                  }}
                >
                  <Text>No</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInTabs: {
    fontSize: RFValue(14),
    color: "black",
  },
  firstTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.E6DADE,
    // height: heightPercentageToDP("8%"),
    marginHorizontal: widthPercentageToDP("5%"),
    paddingTop: heightPercentageToDP("3%"),
    paddingBottom: heightPercentageToDP("3%"),
  },
  tabContainer: {
    marginTop: heightPercentageToDP("1%"),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.E6DADE,
    marginHorizontal: widthPercentageToDP("5%"),
    paddingTop: heightPercentageToDP("3%"),
    paddingBottom: heightPercentageToDP("3%"),
  },
  textInputEdit: {
    borderRadius: 10,
    fontSize: RFValue(12),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("30%"),
  },
});
