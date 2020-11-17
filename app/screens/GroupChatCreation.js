import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const win = Dimensions.get("window");
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let friendIds = [];
let memberCount = 0;
let friendNames = [];
let tmpUserHtml = [];
let userId;
export default function GroupChatCreation(props) {
  const isFocused = useIsFocused();
  const [userHtml, onUserHtmlChanged] = React.useState(<View></View>);
  const [groupName, setGroupName] = React.useState("");
  const [loaded, onLoaded] = React.useState(false);
  if (!isFocused) {
    AsyncStorage.removeItem("ids").then(function() {
      tmpUserHtml = [];
      onUserHtmlChanged([]);
      friendNames = [];
      friendIds = null;
    });
  }
  AsyncStorage.getItem("user").then((url) => {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    userId = urls[urls.length - 1];
  });
  React.useEffect(() => {
    AsyncStorage.getItem("ids")
      .then((val) => {
        friendIds = JSON.parse(val);
        dbFriendIds = JSON.parse(val);
        if (friendIds != null) {
          memberCount = friendIds.length;
        }
      })
      .then(function() {
        request
          .get("user/byIds/", {
            ids: friendIds,
          })
          .then(function(response) {
            response.data.users.map((user) => {
              let found =
                tmpUserHtml.filter((html) => {
                  return html.key == user.id;
                }).length > 0;
              if (!found) {
                friendNames.push(
                  user.real_name ? user.real_name : user.nickname
                );
                tmpUserHtml.push(
                  <TouchableWithoutFeedback key={user.id}>
                    <View style={styles.memberTabsContainer}>
                      <Image
                        style={{
                          width: RFValue(38),
                          height: RFValue(38),
                          borderRadius: win.width / 2,
                          backgroundColor: Colors.DCDCDC,
                        }}
                      />
                      <Text style={styles.folderText}>
                        {user.real_name ? user.real_name : user.nickname}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }
            });
            onUserHtmlChanged(tmpUserHtml);
          });
        onLoaded(true);
      });
  }, [isFocused]);

  function groupCreate() {
    if (friendIds) {
      db.collection("users")
        .doc(userId)
        .collection("groups")
        .add({
          users: friendIds,
          usersName: friendNames,
          groupName: groupName,
        });
      setGroupName("");
      props.navigation.navigate("GroupFolderCreateCompletion", {
        groupName: groupName,
        friendNames: friendNames,
        friendIds: friendIds,
        ownUserID: userId,
      });
    }
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("groupChatCreate")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <TouchableWithoutFeedback onPress={() => groupCreate()}>
        <Text
          style={{
            fontSize: RFValue(14),
            right: 0,
            position: "absolute",
            marginTop: heightPercentageToDP("10%"),
            marginRight: widthPercentageToDP("8%"),
          }}
        >
          {Translate.t("create")}
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          marginTop: heightPercentageToDP("8%"),
          marginHorizontal: widthPercentageToDP("4%"),
        }}
      >
        <View style={styles.createFolderContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
              backgroundColor: Colors.DCDCDC,
            }}
          />
          <TextInput
            value={groupName}
            onChangeText={(value) => setGroupName(value)}
            style={styles.searchInput}
            placeholder={Translate.t("groupName")}
          ></TextInput>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              marginTop: heightPercentageToDP("3%"),
            }}
          >
            <Text style={{ fontSize: RFValue(12) }}>
              {Translate.t("member")}
            </Text>
            <Text style={{ fontSize: RFValue(12) }}>
              {"  "}({memberCount})
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("GroupChatMember")}
          >
            <View style={styles.memberListContainer}>
              <Image
                style={{
                  width: RFValue(38),
                  height: RFValue(38),
                  borderRadius: win.width / 2,
                  backgroundColor: Colors.E6DADE,
                }}
                source={require("../assets/Images/addMemberIcon.png")}
              />
              <Text style={styles.folderText}>{Translate.t("addMember")}</Text>
            </View>
          </TouchableWithoutFeedback>

          <ScrollView>{userHtml}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  memberTabsContainer: {
    marginTop: heightPercentageToDP("2%"),
    flexDirection: "row",
  },
  memberListContainer: {
    marginTop: heightPercentageToDP("5%"),
    flexDirection: "row",
  },
  createFolderContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Colors.D7CCA6,
    paddingBottom: heightPercentageToDP("1%"),
  },
  folderText: {
    fontSize: RFValue(12),
    alignSelf: "center",
    marginLeft: widthPercentageToDP("5%"),
  },
  searchInput: {
    fontSize: RFValue(12),
    alignSelf: "center",
    flex: 1,
    marginLeft: widthPercentageToDP("3%"),
  },
});
