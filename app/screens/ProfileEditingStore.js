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
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { NavigationEvents } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
var uuid = require("react-native-uuid");
import Translate from "../assets/Translates/Translate";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import ImagePicker from "react-native-image-picker";
import { Icon } from "react-native-elements";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioCameraIcon = win.width / 12 / 25;
const ratioCameraIconInsideProfilePicture = win.width / 20 / 25;
const ratioProfileEditingIcon = win.width / 18 / 22;
const ratioNext = win.width / 38 / 8;
const ratioEditIcon = win.width / 24 / 17;
const ratioApprovedIcon = win.width / 22 / 19;
const ratioCancelIcon = win.width / 20 / 15;

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

export default function ProfileEditingGeneral(props) {
  const [password, onPasswordChanged] = React.useState("********");
  const [word, setWord] = React.useState("");
  const [phoneNumber, onPhoneNumberChanged] = React.useState("");
  const [email, onEmailChanged] = React.useState("");
  const [nickName, onNickNameChanged] = React.useState("");
  const [shopName, onShopNameChanged] = React.useState("");
  const [editPassword, onEditPasswordChanged] = React.useState(false);
  const [editShopName, onEditShopNameChanged] = React.useState(false);
  const [editPhoneNumber, onEditPhoneNumberChanged] = React.useState(false);
  const [editEmail, onEditEmailChanged] = React.useState(false);
  const [editNickName, onEditNickNameChanged] = React.useState(false);
  const [show, onShowChanged] = React.useState(false);
  const [addingFriendsByID, onAddingFriendsByIDChanged] = React.useState(false);
  const [
    allowAddingFriendsByPhoneNumber,
    onAllowAddingFriendsByPhoneNumber,
  ] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const isFocused = useIsFocused();

  async function loadUser() {
    let url = await AsyncStorage.getItem("user");
    let response = await request.get(url);
    onShopNameChanged(response.data.shop_name);
    onNickNameChanged(response.data.nickname);
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
    setWord(response.data.word);
  }

  React.useEffect(() => {
    loadUser();
  }, [isFocused]);

  function updateUser(user, field, value) {
    if (!value) return;
    let obj = {};
    obj[field] = value;
    request
      .patch(user.url, obj)
      .then(function (response) {
        loadUser();
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

  handleChoosePhoto = (type) => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        const formData = new FormData();
        formData.append("image", {
          ...response,
          uri:
            Platform.OS === "android"
              ? response.uri
              : response.uri.replace("file://", ""),
          name: "mobile-" + uuid.v4() + ".jpg",
          type: "image/jpeg", // it may be necessary in Android.
        });
        request
          .post("images/", formData, {
            "Content-Type": "multipart/form-data",
          })
          .then((response) => {
            request
              .post(user.url.replace("profiles", "updateProfileImage"), {
                image_id: response.data.id,
                type: type,
              })
              .then(function (response) {
                loadUser();
              })
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
          })
          .catch((error) => {
            alert.warning(JSON.stringify(error));
            if (
              error &&
              error.response &&
              error.response.data &&
              Object.keys(error.response.data).length > 0
            ) {
              alert.warning(
                error.response.data[Object.keys(error.response.data)[0]][0]
              );
            }
          });
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {show == true ? (
          <Modal
            visible={true}
            transparent={true}
            presentationStyle="overFullScreen"
          >
            <SafeAreaView
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
                backgroundColor: "#7d7d7d",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginHorizontal: widthPercentageToDP("5%"),
                  marginTop: heightPercentageToDP("3%"),
                  height: heightPercentageToDP("5%"),
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    onShowChanged(false);
                    setWord(user.word);
                  }}
                >
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
                    fontSize: RFValue(14),
                    color: "white",
                  }}
                >
                  {word.length}/500
                </Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    onShowChanged(false);
                    let tmpUser = user;
                    tmpUser.word = word;
                    onUserChanged(tmpUser);

                    updateUser(user, "word", word);
                  }}
                >
                  <Text style={{ fontSize: RFValue(14), color: "white" }}>
                    {Translate.t("save")}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  marginTop: heightPercentageToDP("15%"),
                  paddingHorizontal: widthPercentageToDP("5%"),
                }}
              >
                <TextInput
                  placeholder="入力してください"
                  placeholderTextColor="white"
                  maxLength={500}
                  multiline={true}
                  autoFocus={true}
                  style={{
                    textAlign: "center",
                    width: "100%",
                    fontSize: RFValue(14),
                    color: "white",
                  }}
                  value={word}
                  onChangeText={(value) => {
                    setWord(value);
                  }}
                ></TextInput>
              </View>
            </SafeAreaView>
          </Modal>
        ) : (
          []
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
          {user && user.background_img && user.background_img.image ? (
            <ImageBackground
              style={{
                width: widthPercentageToDP("100%"),
                height: heightPercentageToDP("30%"),
              }}
              source={{ uri: user.background_img.image }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  handleChoosePhoto("background_img");
                }}
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
              </TouchableWithoutFeedback>
            </ImageBackground>
          ) : (
            <ImageBackground
              style={{
                width: widthPercentageToDP("100%"),
                height: heightPercentageToDP("30%"),
              }}
              source={require("../assets/Images/cover_img.jpg")}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  handleChoosePhoto("background_img");
                }}
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
              </TouchableWithoutFeedback>
            </ImageBackground>
          )}
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
            {user && user.image && user.image.image ? (
              <ImageBackground
                resizeMode="contain"
                style={{
                  width: widthPercentageToDP("22%"),
                  height: widthPercentageToDP("22%"),
                  borderWidth: 1,
                  borderColor: Colors.E6DADE,
                  backgroundColor: "white",
                }}
                source={{ uri: user.image.image }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleChoosePhoto("image");
                  }}
                >
                  <Image
                    style={styles.cameraIconInsideProfilePicture}
                    source={require("../assets/Images/cameraIcon.png")}
                  />
                </TouchableWithoutFeedback>
              </ImageBackground>
            ) : (
              <ImageBackground
                style={{
                  width: widthPercentageToDP("22%"),
                  height: widthPercentageToDP("22%"),
                  borderWidth: 1,
                  borderColor: Colors.E6DADE,
                  backgroundColor: "white",
                }}
                source={require("../assets/Images/avatar.jpg")}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleChoosePhoto("image");
                  }}
                >
                  <Image
                    style={styles.cameraIconInsideProfilePicture}
                    source={require("../assets/Images/cameraIcon.png")}
                  />
                </TouchableWithoutFeedback>
              </ImageBackground>
            )}
            <View
              style={{
                width: "100%",
                marginLeft: widthPercentageToDP("3%"),
                marginTop: heightPercentageToDP(".3%"),
              }}
            >
              <TouchableWithoutFeedback onPress={() => onShowChanged(true)}>
                <Image
                  style={{
                    width: win.width / 24,
                    height: 17 * ratioEditIcon,
                  }}
                  source={require("../assets/Images/editIcon.png")}
                />
              </TouchableWithoutFeedback>
              <Text
                style={{
                  marginTop: heightPercentageToDP(".5%"),
                  fontSize: RFValue(12),
                  color: Colors.white,
                }}
              >
                {user.word ? user.word.slice(0, 30) : ""}
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
                    fontSize: RFValue(12),
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: heightPercentageToDP("2%"),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(10),
                marginLeft: widthPercentageToDP("5%"),
              }}
            >
              KINUJO ID : {user.user_code}
            </Text>
            <View
              style={{
                marginTop: heightPercentageToDP("1.5%"),
                flexDirection: "row-reverse",
                position: "absolute",
                right: 0,
                marginRight: widthPercentageToDP("4%"),
              }}
            >
              <Image
                style={{
                  width: win.width / 20,
                  height: 24 * ratioApprovedIcon,
                }}
                source={require("../assets/Images/approvedIcon.png")}
              />
              <Text
                style={{
                  fontSize: RFValue(10),
                  marginRight: widthPercentageToDP("2%"),
                }}
              >
                {Translate.t("storeApproved")}
              </Text>
            </View>
          </View>
          {/* ALL TABS CONTAINER */}
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <View style={styles.tabContainer}>
              <Text style={styles.textInContainerLeft}>
                {Translate.t("name")}
              </Text>
              {editNickName == true ? (
                <View
                  style={{
                    position: "absolute",
                    right: widthPercentageToDP("-4%"),
                    flexDirection: "row-reverse",
                    alignItems: "center",
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
                      onEditNickNameChanged(false);
                      updateUser(user, "nickname", nickName);
                    }}
                  />
                  <TextInput
                    value={nickName}
                    onChangeText={(value) => onNickNameChanged(value)}
                    style={styles.textInputEdit}
                  />
                </View>
              ) : (
                <View
                  style={{
                    position: "absolute",
                    right: widthPercentageToDP("-4%"),
                    flexDirection: "row-reverse",
                    alignItems: "center",
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
                    onPress={() => onEditNickNameChanged(true)}
                  />
                  <Text style={{ fontSize: RFValue(12) }}>{nickName}</Text>
                </View>
              )}
            </View>
            {user.is_seller == true ? (
              <View style={styles.tabContainer}>
                <Text style={styles.textInContainerLeft}>
                  {Translate.t("shopName")}
                </Text>
                {editShopName == true ? (
                  <View
                    style={{
                      position: "absolute",
                      right: widthPercentageToDP("-4%"),
                      flexDirection: "row-reverse",
                      alignItems: "center",
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
                        onEditShopNameChanged(false);
                        updateUser(user, "shop_name", shopName);
                      }}
                    />
                    <TextInput
                      value={shopName}
                      onChangeText={(value) => onShopNameChanged(value)}
                      style={styles.textInputEdit}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      position: "absolute",
                      right: widthPercentageToDP("-4%"),
                      flexDirection: "row-reverse",
                      alignItems: "center",
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
                      onPress={() => onEditShopNameChanged(true)}
                    />
                    <Text style={{ fontSize: RFValue(12) }}>{shopName}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View></View>
            )}

            <View style={styles.tabContainer}>
              <Text style={styles.textInContainerLeft}>
                {Translate.t("profileEditPhoneNumber")}
              </Text>
              {editPhoneNumber == true ? (
                <View
                  style={{
                    position: "absolute",
                    right: widthPercentageToDP("-4%"),
                    flexDirection: "row-reverse",
                    alignItems: "center",
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
                    right: widthPercentageToDP("-4%"),
                    flexDirection: "row-reverse",
                    alignItems: "center",
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
                    right: widthPercentageToDP("-4%"),
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
                      onEditEmailChanged(false);
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
                    right: widthPercentageToDP("-4%"),
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
                    right: widthPercentageToDP("-4%"),
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
                      onEditPasswordChanged(false);
                      let tmpPassword = password;
                      // onPasswordChanged("********")
                      promptUpdate(props, user, "password", tmpPassword);
                    }}
                  />
                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      onPasswordChanged(value);
                    }}
                    style={styles.textInputEdit}
                  />
                </View>
              ) : (
                <View
                  style={{
                    position: "absolute",
                    right: widthPercentageToDP("-4%"),
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
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      marginRight: widthPercentageToDP("5%"),
                      fontSize: RFValue(7),
                    }}
                  >
                    {Translate.t("allIdentityInfo")}
                  </Text>
                  <Image
                    style={styles.nextIcon}
                    source={require("../assets/Images/next.png")}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.tabContainer}>
              <Text style={styles.textInContainerLeft}>
                {Translate.t("profileEditAllowAddFriendByID")}
              </Text>
              <Switch
                trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
                thumbColor={addingFriendsByID == 1 ? Colors.D7CCA6 : "grey"}
                style={styles.switch}
                onValueChange={(value) => {
                  onAddingFriendsByIDChanged(value);
                  request
                    .patch(user.url, {
                      allowed_by_id: value ? 1 : 0,
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
                          ][0]
                        );
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
                thumbColor={
                  allowAddingFriendsByPhoneNumber == 1 ? Colors.D7CCA6 : "grey"
                }
                style={styles.switch}
                onValueChange={(value) => {
                  onAllowAddingFriendsByPhoneNumber(value);
                  request
                    .patch(user.url, {
                      allowed_by_tel: value ? 1 : 0,
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
                          ][0]
                        );
                      }
                    });
                }}
                value={allowAddingFriendsByPhoneNumber}
              />
            </View>
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
    alignSelf: "center",
  },
  textInContainerRight: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(10),
  },
  textInContainerLeft: {
    fontSize: RFValue(12),
  },
  switch: {
    // backgroundColor: Colors.F0EEE9,
    color: Colors.F0EEE9,
    position: "absolute",
    right: 0,
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
  textInputEdit: {
    borderRadius: 10,
    fontSize: RFValue(11),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("40%"),
  },
});
