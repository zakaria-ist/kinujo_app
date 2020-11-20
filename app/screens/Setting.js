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
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
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
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioNext = win.width / 38 / 8;

function updateUser(user, field, value) {
  let obj = {};
  obj[field] = value;
  request
    .patch(user.url, obj)
    .then(function(response) {})
    .catch(function(error) {
      if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
        alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
      }
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

  if (!user.url) {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
          onEmailChanged(response.data.email);
          onPhoneNumberChanged(response.data.tel);
          onAddingFriendsByIDChanged(response.data.allowed_by_id);
          onAllowAddingFriendsByPhoneNumber(response.data.allowed_by_tel);
          onMessagedReceivedMobileChanged(
            response.data.message_notification_phone
          );
          onMessagedReceivedEmailChanged(
            response.data.message_notification_mail
          );
          onOtherNofiticationEmailChanged(
            response.data.other_notification_mail
          );
          onOtherNofiticationMobileChanged(
            response.data.other_notification_phone
          );
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
        });
    });
  }

  return (
    <ScrollView>
      <CustomHeader
        onFavoriteChanged="noFavorite"
        onBack={() => {
          props.navigation.pop();
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
                  updateUser(user, "password", password);
                  onPasswordChanged("********");
                }}
              />
              <TextInput
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
                  updateUser(user, "tel", phoneNumber);
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
                  updateUser(user, "email", email);
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
              thumbColor={Colors.D7CCA6}
              style={{ position: "absolute", right: 0 }}
              onValueChange={(value) => {
                onMessagedReceivedMobileChanged(value);
                request
                  .patch(user.url, {
                    message_notification_phone: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={messagedReceivedMobile}
            />
            <Switch
              trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
              thumbColor={Colors.D7CCA6}
              style={{ marginRight: widthPercentageToDP("17%") }}
              onValueChange={(value) => {
                onMessagedReceivedEmailChanged(value);
                request
                  .patch(user.url, {
                    message_notification_mail: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={messagedReceivedEmail}
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
              thumbColor={Colors.D7CCA6}
              style={{ position: "absolute", right: 0 }}
              onValueChange={(value) => {
                onOtherNofiticationMobileChanged(value);
                request
                  .patch(user.url, {
                    other_notification_phone: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={otherNofiticationMobile}
            />
            <Switch
              trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
              thumbColor={Colors.D7CCA6}
              style={{ marginRight: widthPercentageToDP("17%") }}
              onValueChange={(value) => {
                onOtherNofiticationEmailChanged(value);
                request
                  .patch(user.url, {
                    other_notification_mail: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={otherNofiticationEmail}
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
              thumbColor={Colors.D7CCA6}
              style={{ position: "absolute", right: 0 }}
              onValueChange={(value) => {
                onAddingFriendsByIDChanged(value);
                request
                  .patch(user.url, {
                    allowed_by_id: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={addingFriendsByID}
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
              thumbColor={Colors.D7CCA6}
              style={{ position: "absolute", right: 0 }}
              onValueChange={(value) => {
                onAllowAddingFriendsByPhoneNumber(value);
                request
                  .patch(user.url, {
                    allowed_by_tel: value ? 1 : 0,
                  })
                  .then(function(response) {})
                  .catch(function(error) {
                    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                    }
                  });
              }}
              value={allowAddingFriendsByPhoneNumber}
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
          <Text style={styles.textInContainerLeft}>{Translate.t("help")}</Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
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
    fontSize: RFValue(8),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("4%"),
    width: widthPercentageToDP("40%"),
  },
});
