import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Switch,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
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
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Icon } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioNext = win.width / 38 / 8;

function updateUser(user, field, value) {
  if (!value) return;
  let obj = {};
  obj[field] = value;
  request
    .patch(user.url, obj)
    .then(function (response) {})
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

function promptUpdate(props, user, field, value) {
  AsyncStorage.setItem(
    "update-data",
    JSON.stringify({
      type: field,
      value: value,
    })
  ).then(() => {
    props.navigation.navigate("SMSAuthentication", {
      username: field == "tel" ? value : user.tel,
      type: field,
    });
  });
}

export default function Setting(props) {
  const [editPassword, onEditPasswordChanged] = React.useState(false);
  const [password, onPasswordChanged] = React.useState("********");
  const [phoneNumber, onPhoneNumberChanged] = React.useState("");
  const [email, onEmailChanged] = React.useState("");
  const [editPhoneNumber, onEditPhoneNumberChanged] = React.useState(false);
  const [editEmailAddress, onEditEmailAddressChanged] = React.useState(false);
  const [addingFriendsByID, onAddingFriendsByIDChanged] = React.useState(false);
  const [
    messagedReceivedMobile,
    onMessagedReceivedMobileChanged,
  ] = React.useState(false);
  const [
    messagedReceivedEmail,
    onMessagedReceivedEmailChanged,
  ] = React.useState(false);
  const [
    otherNofiticationEmail,
    onOtherNofiticationEmailChanged,
  ] = React.useState(false);
  const [
    otherNofiticationMobile,
    onOtherNofiticationMobileChanged,
  ] = React.useState(false);
  const [
    allowAddingFriendsByPhoneNumber,
    onAllowAddingFriendsByPhoneNumber,
  ] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const isFocused = useIsFocused();

  async function load() {
    let url = await AsyncStorage.getItem("user");
    let updateData = await AsyncStorage.getItem("update-data");
    let verified = await AsyncStorage.getItem("verified");
    if(updateData){
      updateData = JSON.parse(updateData);
    }
    let response = await request.get(url);
    onUserChanged(response.data);
    if (updateData && updateData["type"] == "email" && verified == "1") {
      onEmailChanged(updateData["value"]);
      request.post("user/change-email", {
        tel: response.data.tel,
        email: updateData["value"],
      });
      await AsyncStorage.removeItem("update-data");
      await AsyncStorage.removeItem("verified");
    } else {
      onEmailChanged(response.data.email);
    }
    if (updateData && updateData["type"] == "tel" && verified == "1") {
      onPhoneNumberChanged(updateData["value"]);
      request.post("user/change-phone", {
        tel: response.data.tel,
        phone: updateData["value"],
      });
      await AsyncStorage.removeItem("update-data");
      await AsyncStorage.removeItem("verified");
    } else {
      onPhoneNumberChanged(response.data.tel);
    }
    if (updateData && updateData["type"] == "password" && verified == "1") {
      request.post("password/reset", {
        tel: response.data.tel,
        password: updateData["value"],
        confirm_password: updateData["value"],
      });
      await AsyncStorage.removeItem("update-data");
      await AsyncStorage.removeItem("verified");
    }
    onAddingFriendsByIDChanged(response.data.allowed_by_id);
    onAllowAddingFriendsByPhoneNumber(response.data.allowed_by_tel);
    onMessagedReceivedMobileChanged(response.data.message_notification_phone);
    onMessagedReceivedEmailChanged(response.data.message_notification_mail);
    onOtherNofiticationEmailChanged(response.data.other_notification_mail);
    onOtherNofiticationMobileChanged(response.data.other_notification_phone);
  }

  React.useEffect(() => {
    load();
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <CustomHeader
          onFavoriteChanged="noFavorite"
          onBack={() => {
            props.navigation.goBack();
          }}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          text={Translate.t("setting")}
        />
        <CustomSecondaryHeader
          name={user.nickname}
          accountType={
            props.route.params.is_store ? Translate.t("storeAccount") : ""
          }
        />
        <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
          <View style={styles.firstTabContainer}>
            <Text style={styles.textInContainerLeft}>KINUJO ID</Text>
            <Text style={styles.textInContainerRight}>{user.user_code}</Text>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("password")}
            </Text>
            {editPassword == true ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-3%"),
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
                    onEditPasswordChanged(false);
                    let tmpPassword = password;
                    onPasswordChanged("********")
                    promptUpdate(props, user, "password", tmpPassword);
                  }}
                />
                <TextInput
                  secureTextEntry={true}
                  value={password}
                  onChangeText={(value) => onPasswordChanged(value)}
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
                  marginRight: widthPercentageToDP("-3%"),
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
                  onPress={() => {
                    onEditPasswordChanged(true);
                    onPasswordChanged("");
                  }}
                />
                <Text style={{ fontSize: RFValue(12) }}>{password}</Text>
              </View>
            )}
            {/* <Text style={styles.textInContainerRightText> */}
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("profileEditPhoneNumber")}
            </Text>
            {editPhoneNumber == true ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-3%"),
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
                    onEditPhoneNumberChanged(false);
                    promptUpdate(props, user, "tel", phoneNumber);
                  }}
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={(value) => onPhoneNumberChanged(value)}
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
                  marginRight: widthPercentageToDP("-3%"),
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
                  onPress={() => onEditPhoneNumberChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{phoneNumber}</Text>
              </View>
            )}
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("emailAddress")}
            </Text>
            {editEmailAddress == true ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-3%"),
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
                    onEditEmailAddressChanged(false);
                    promptUpdate(props, user, "email", email);
                  }}
                />
                <TextInput
                  value={email}
                  onChangeText={(value) => onEmailChanged(value)}
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
                  marginRight: widthPercentageToDP("-3%"),
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
                  onPress={() => onEditEmailAddressChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{email}</Text>
              </View>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              if (props.route.params.is_store) {
                props.navigation.navigate("StoreInformation");
              } else {
                props.navigation.navigate("ProfileInformation");
              }
            }}
          >
            <View style={styles.tabContainer}>
              <Text style={styles.textInContainerLeft}>
                {Translate.t("personalInformation")}
              </Text>
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    marginRight: widthPercentageToDP("5%"),
                    fontSize: RFValue(6.5),
                    alignSelf: "center",
                  }}
                >
                  {Translate.t("storeName,PersonInCharge,Address")}
                </Text>
                <Image
                  style={styles.nextIcon}
                  source={require("../assets/Images/next.png")}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              flexDirection: "row",
              height: heightPercentageToDP("5.2%"),
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginHorizontal: widthPercentageToDP("4%"),
              borderBottomWidth: 1,
              borderColor: Colors.F0EEE9,
            }}
          >
            <Text
              style={{
                position: "absolute",
                right: 0,
                fontSize: RFValue(10),
                marginRight: widthPercentageToDP("5%"),
                marginBottom: heightPercentageToDP("1%"),
              }}
            >
              {Translate.t("profileEditEmail")}
            </Text>
            <Text
              style={{
                position: "absolute",
                right: 0,
                fontSize: RFValue(10),
                marginRight: widthPercentageToDP("22%"),
                marginBottom: heightPercentageToDP("1%"),
              }}
            >
              {Translate.t("mobile")}
            </Text>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("messageReceivedNotification")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                height: heightPercentageToDP("5.2%"),
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("4%"),
                borderBottomWidth: 1,
                borderColor: Colors.F0EEE9,
                position: "absolute",
                right: 0,
              }}
            >
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  messagedReceivedEmail == 1 ? Colors.D7CCA6 : Colors.grey
                }
                style={{ position: "absolute", right: 0 }}
                onValueChange={(value) => {
                  onMessagedReceivedEmailChanged(value);

                  request
                    .patch(user.url, {
                      message_notification_mail: value ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={messagedReceivedEmail}
              />
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  messagedReceivedMobile == 0 ? Colors.D7CCA6 : "grey"
                }
                style={{ marginRight: widthPercentageToDP("17%") }}
                onValueChange={(value) => {
                  onMessagedReceivedMobileChanged(!value);
                  request
                    .patch(user.url, {
                      message_notification_phone: value == true ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={!messagedReceivedMobile}
              />
            </View>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("otherNotifications")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                height: heightPercentageToDP("5.2%"),
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("4%"),
                borderBottomWidth: 1,
                borderColor: Colors.F0EEE9,
                position: "absolute",
                right: 0,
              }}
            >
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  otherNofiticationMobile == 0 ? Colors.D7CCA6 : Colors.grey
                }
                style={{ position: "absolute", right: 0 }}
                onValueChange={(value) => {
                  onOtherNofiticationMobileChanged(!value);
                  request
                    .patch(user.url, {
                      other_notification_phone: value == true ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={!otherNofiticationMobile}
              />
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  otherNofiticationEmail == 0 ? Colors.D7CCA6 : Colors.grey
                }
                style={{ marginRight: widthPercentageToDP("17%") }}
                onValueChange={(value) => {
                  onOtherNofiticationEmailChanged(!value);
                  request
                    .patch(user.url, {
                      other_notification_mail: value == true ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={!otherNofiticationEmail}
              />
            </View>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("profileEditAllowAddFriendByID")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                height: heightPercentageToDP("5.2%"),
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("4%"),
                borderBottomWidth: 1,
                borderColor: Colors.F0EEE9,
                position: "absolute",
                right: 0,
              }}
            >
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  addingFriendsByID == 0 ? Colors.D7CCA6 : Colors.grey
                }
                onValueChange={(value) => {
                  onAddingFriendsByIDChanged(!value);
                  request
                    .patch(user.url, {
                      allowed_by_id: value == true ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={!addingFriendsByID}
              />
            </View>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("profileEditAllowAddFriendByPhoneNum")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                height: heightPercentageToDP("5.2%"),
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("4%"),
                borderBottomWidth: 1,
                borderColor: Colors.F0EEE9,
                position: "absolute",
                right: 0,
              }}
            >
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={
                  allowAddingFriendsByPhoneNumber == 0
                    ? Colors.D7CCA6
                    : Colors.grey
                }
                onValueChange={(value) => {
                  onAllowAddingFriendsByPhoneNumber(!value);
                  request
                    .patch(user.url, {
                      allowed_by_tel: value == true ? 0 : 1,
                    })
                    .then(function (response) {})
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0] +
                            "(" +
                            Object.keys(error.response.data)[0] +
                            ")"
                        );
                      }
                    });
                }}
                value={!allowAddingFriendsByPhoneNumber}
              />
            </View>
          </View>
          <View style={styles.tabContainer}></View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("versionInformation")}
            </Text>
            <Text style={styles.textInContainerRight}>version 1.09.08</Text>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("help")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("8%"),
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
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("4%"),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
  },
  textInContainerRight: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(11),
  },
  textInContainerLeft: {
    fontSize: RFValue(11),
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },

  textInputEdit: {
    borderRadius: 10,
    fontSize: RFValue(11),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("40%"),
  },
});
