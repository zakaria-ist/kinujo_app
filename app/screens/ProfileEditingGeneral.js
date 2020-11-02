import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioCameraIcon = win.width / 12 / 25;
const ratioCameraIconInsideProfilePicture = win.width / 20 / 25;
const ratioProfileEditingIcon = win.width / 18 / 22;
const ratioNext = win.width / 38 / 8;
const ratioEditIcon = win.width / 24 / 17;
const ratioCancelIcon = win.width / 20 / 15;

function updateUser(user, field, value){
  let obj = {};
  obj[field] = value;
  request
  .patch(user.url, obj)
  .then(function (response) {})
  .catch(function (error) {
    if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
      alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
    }
  });
}

export default function ProfileEditingGeneral(props) {
  const [password, onPasswordChanged] = React.useState("********");
  const [phoneNumber, onPhoneNumberChanged] = React.useState("");
  const [email, onEmailChanged] = React.useState("")
  const [editPassword, onEditPasswordChanged] = React.useState(false);
  const [editPhoneNumber, onEditPhoneNumberChanged] = React.useState(false);
  const [editEmail, onEditEmailChanged] = React.useState(false);
  const [show, onShowChanged] = React.useState(false);
  const [addingFriendsByID, onAddingFriendsByIDChanged] = React.useState(false);
  const [
    allowAddingFriendsByPhoneNumber,
    onAllowAddingFriendsByPhoneNumber,
  ] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  
  if (!user.url) {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          onPhoneNumberChanged(response.data.tel)
          onEmailChanged(response.data.email)
          onAddingFriendsByIDChanged(response.data.allowed_by_id);
          onAllowAddingFriendsByPhoneNumber(response.data.allowed_by_tel);
        })
        .catch(function (error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
          }
        });
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {show == true ? (
        <Modal
          visible={true}
          transparent={false}
          presentationStyle="overFullScreen"
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: "#7d7d7d",
            borderColor: "white",
            margin: widthPercentageToDP("2%"),
          }}
        >
          <SafeAreaView
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginHorizontal: widthPercentageToDP("3%"),
                marginTop: heightPercentageToDP("3%"),
                height: heightPercentageToDP("5%"),
              }}
            >
              <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
                <Image
                  style={{
                    width: win.width / 20,
                    height: 15 * ratioCancelIcon,
                  }}
                  source={require("../assets/Images/cancelIcon.png")}
                />
              </TouchableWithoutFeedback>
              <Text
                style={{
                  fontSize: RFValue(15),
                  color: "white",
                  alignSelf: "flex-end",
                }}
              >
                0/500
              </Text>
              <TouchableWithoutFeedback>
                <Text style={{ fontSize: RFValue(17), color: "white" }}>
                  保存
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                height: "100%",
                marginTop: heightPercentageToDP("15%"),
              }}
            >
              <TextInput
                placeholder="入力してください"
                placeholderTextColor="white"
                maxLength={255}
                multiline={true}
                style={{
                  width: widthPercentageToDP("90%"),
                  height: heightPercentageToDP("70%"),
                  paddingHorizontal: widthPercentageToDP("2%"),
                  fontSize: RFValue(18),
                  color: "white",
                  textAlign: "center",
                }}
              ></TextInput>
            </View>
          </SafeAreaView>
        </Modal>
      ) : (
        ""
      )}
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("profile")}
      />
      <View>
        <ImageBackground
          style={{
            width: widthPercentageToDP("100%"),
            height: heightPercentageToDP("30%"),
          }}
          source={require("../assets/Images/profileEditingIcon.png")}
        >
          <Image
            style={{
              position: "absolute",
              right: 0,
              marginRight: widthPercentageToDP("5%"),
              marginTop: heightPercentageToDP("1%"),
              width: win.width / 12,
              height: 23 * ratioCameraIcon,
            }}
            source={require("../assets/Images/cameraIcon.png")}
          />
        </ImageBackground>
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
              backgroundColor: "white",
              borderColor: Colors.E6DADE,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          >
            <Image
              style={styles.cameraIconInsideProfilePicture}
              source={require("../assets/Images/cameraIcon.png")}
            />
          </ImageBackground>
          <View
            style={{
              width: "100%",
              marginLeft: widthPercentageToDP("5%"),
            }}
          >
            <TouchableWithoutFeedback onPress={() => onShowChanged(true)}>
              <Image
                style={{
                  width: win.width / 24,
                  height: 17 * ratioEditIcon,
                  position: "absolute",
                  right: 0,
                  fontSize: RFValue(10),
                }}
                source={require("../assets/Images/editIcon.png")}
              />
            </TouchableWithoutFeedback>
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
                marginBottom: heightPercentageToDP(".5%"),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                }}
              >
                {user.real_name ? user.real_name : user.nickname}
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

        {/* ALL TABS CONTAINER */}
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
                  onEditPhoneNumberChanged(false)
                  updateUser(user, 'tel', phoneNumber);
                }}
              />
              <TextInput
                value={phoneNumber}
                onChangeText={(value) => onPhoneNumberChanged(value)}
                style={{ borderWidth: 1, borderColor: "black" }}
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
                onPress={() => onEditPhoneNumberChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{phoneNumber}</Text>
            </View>
          )}
        </View>
        <View style={styles.tabContainer}>
          <Text style={styles.textInContainerLeft}>
            {Translate.t("profileEditEmail")}
          </Text>
          {editEmail == true ? (
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
                  onEditEmailChanged(false)
                  updateUser(user, 'email', email);
                }}
              />
              <TextInput
                value={email}
                onChangeText={(value) => onEmailChanged(value)}
                style={{ borderWidth: 1, borderColor: "black" }}
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
                onPress={() => onEditEmailChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{email}</Text>
            </View>
          )}
        </View>
        <View style={styles.tabContainer}>
          <Text style={styles.textInContainerLeft}>
            {Translate.t("profileEditPassword")}
          </Text>
          {editPassword == true ? (
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
                  onEditPasswordChanged(false)
                  updateUser(user, 'password', password);
                  onPasswordChanged("********");
                }}
              />
              <TextInput
                value={password}
                onChangeText={(value) => {
                  onPasswordChanged(value);
                }}
                style={{ borderWidth: 1, borderColor: "black" }}
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
                onPress={() => {
                  onEditPasswordChanged(true);
                  onPasswordChanged("");
                }}
              />
              <Text style={{ fontSize: RFValue(12) }}>{password}</Text>
            </View>
          )}
        </View>
        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.navigate("ProfileInformation", {
              is_store: true,
            })
          }
        >
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("personalInformation")}
            </Text>
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
              <Text
                style={{
                  marginRight: widthPercentageToDP("5%"),
                  fontSize: RFValue(10),
                }}
              >
                {Translate.t("allIdentityInfo")}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.tabContainer}>
          <Text style={styles.textInContainerLeft}>
            {Translate.t("profileEditAllowAddFriendByID")}
          </Text>
          <Switch
            trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
            thumbColor={Colors.D7CCA6}
            style={styles.switch}
            onValueChange={(value) => {
              onAddingFriendsByIDChanged(value);
              request
                .patch(user.url, {
                  allowed_by_id: value ? 1 : 0,
                })
                .then(function (response) {})
                .catch(function (error) {
                  if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                    alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
                  }
                });
            }}
            value={addingFriendsByID}
          />
        </View>
        <View style={styles.tabContainer}>
          <Text style={styles.textInContainerLeft}>
            {Translate.t("profileEditAllowAddFriendByPhoneNum")}
          </Text>
          <Switch
            trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
            thumbColor={Colors.D7CCA6}
            style={styles.switch}
            onValueChange={(value) => {
              onAllowAddingFriendsByPhoneNumber(value);
              request
                .patch(user.url, {
                  allowed_by_tel: value ? 1 : 0,
                })
                .then(function (response) {})
                .catch(function (error) {
                  if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                    alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
                  }
                });
            }}
            value={allowAddingFriendsByPhoneNumber}
          />
        </View>
      </View>
    </SafeAreaView>
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
    borderColor: Colors.F0EEE9
  },
  editTabContainer: {
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
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  textInContainerRight: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(12),
  },
  textInContainerLeft: {
    fontSize: RFValue(12),
  },
  switch: {
    backgroundColor: Colors.F0EEE9,
    color: Colors.F0EEE9,
    position: "absolute",
    right: 0,
  },
  cameraIconInsideProfilePicture: {
    position: "absolute",
    left: 0,
    bottom: 0,
    marginLeft: widthPercentageToDP("1%"),
    marginBottom: heightPercentageToDP("1%"),
    width: win.width / 20,
    height: 23 * ratioCameraIconInsideProfilePicture,
  },
});
