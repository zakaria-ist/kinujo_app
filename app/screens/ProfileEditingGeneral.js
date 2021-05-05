import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Icon } from "react-native-elements";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
import { Colors } from "../assets/Colors.js";
import ImagePicker from "react-native-image-picker";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
var uuid = require("react-native-uuid");
import Translate from "../assets/Translates/Translate";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import NextArrow from "../assets/icons/nextArrow.svg";
import Camera from "../assets/icons/camera.svg";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { call } from "react-native-reanimated";
const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
const ratioCameraIcon = win.width / 12 / 25;
const ratioCameraIconInsideProfilePicture = win.width / 20 / 25;
const ratioProfileEditingIcon = win.width / 18 / 22;
const ratioNext = win.width / 38 / 8;
const ratioEditIcon = win.width / 24 / 17;
const ratioCancelIcon = win.width / 20 / 15;
const ratioSearchIcon = win.width / 16 / 19;
function promptUpdate(props, user, field, value) {
  AsyncStorage.setItem(
    "update-data",
    JSON.stringify({
      type: field,
      value: value,
    })
  ).then(() => {
    props.navigation.navigate("SMSAuthentication", {
      username:
        field == "tel"
          ? (value[0] ? value[0] : user.tel_code) + value[1]
          : (user.tel_code ? user.tel_code : "") + (user.tel ? user.tel : ""),
      type: field,
    });
  });
}

export default function ProfileEditingGeneral(props) {
  const BUTTON_SIZE = 40;
  const textInput = React.createRef();
  const [password, onPasswordChanged] = useStateIfMounted("********");
  const [phoneNumber, onPhoneNumberChanged] = useStateIfMounted("");
  const [word, setWord] = useStateIfMounted("");
  const [email, onEmailChanged] = useStateIfMounted("");
  const [showTest, setShowTest] = useStateIfMounted(true);
  const [editPassword, onEditPasswordChanged] = useStateIfMounted(false);
  const [editPhoneNumber, onEditPhoneNumberChanged] = useStateIfMounted(false);
  const [editEmail, onEditEmailChanged] = useStateIfMounted(false);
  const [show, onShowChanged] = useStateIfMounted(false);
  const [showCountry, onShowCountryChanged] = useStateIfMounted(false);
  const [countryCode, setCountryCode] = useStateIfMounted("");
  const [searchText, setSearchText] = useStateIfMounted("");
  const [userPhone, onUserPhoneChanged] = useStateIfMounted("");
  const [userCCode, onUserCCodeChanged] = useStateIfMounted("");
  const [countryHtml, setCountryHtml] = useStateIfMounted(<View></View>);
  const [addingFriendsByID, onAddingFriendsByIDChanged] = useStateIfMounted(false);

  const [
    allowAddingFriendsByPhoneNumber,
    onAllowAddingFriendsByPhoneNumber,
  ] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const isFocused = useIsFocused();
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("selectedCountry").then((val) => {
        if (val) {
          // onCountryChanged(val);
          setCountryCode(val);
          onCallingCodeChanged(val);
          AsyncStorage.removeItem("selectedCountry");
        } else {
          // onCountryChanged("+81");
          setCountryCode("+81");
          onCallingCodeChanged("+81");
        }
      });
    });
  }, [isFocused]);
  function processCountryHtml(countries) {
    let html = [];
    countries.map((country) => {
      console.log();
      html.push(
        <TouchableWithoutFeedback
          onPress={() => {
            setCountryCode(country.tel_code);
            onCallingCodeChanged(country.tel_code);
            AsyncStorage.setItem("selectedCountry", country.tel_code).then(
              () => {
                onShowCountryChanged(false);
              }
            );
          }}
        >
          <View style={styles.contactListContainer}>
            <View style={styles.contactTabContainer}>
              {/* <Image
            style={styles.contactListImage}
            source={require("../assets/Images/profileEditingIcon.png")}
          /> */}
              <Text style={styles.contactListName}>
                {country.name} ({country.tel_code})
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return html;
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      request.get("country_codes/").then(function (response) {
        countries = response.data;
        setCountryHtml(processCountryHtml(countries));
      });
    });
  }, [true]);
  async function loadUser() {
    let url = await AsyncStorage.getItem("user");
    let verified = await AsyncStorage.getItem("verified");
    let response = await request.get(url);
    let updateData = await AsyncStorage.getItem("update-data");
    if (updateData) {
      updateData = JSON.parse(updateData);
    }
    onUserChanged(response.data);
    onCallingCodeChanged(response.data.tel_code);
    setCountryCode(response.data.tel_code);
    onUserPhoneChanged(response.data.tel);
    onUserCCodeChanged(response.data.tel_code);
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
        phone: updateData["value"][1],
        code: "+" + updateData["value"][0].replace("+", ""),
      });
      await AsyncStorage.removeItem("update-data");
      await AsyncStorage.removeItem("verified");

      onPhoneNumberChanged(updateData["value"][1]);
      onCallingCodeChanged(updateData["value"][0]);
      onUserPhoneChanged(updateData["value"][1]);
      onUserCCodeChanged(updateData["value"][0]);
    } else {
      onPhoneNumberChanged(response.data.tel);
      onUserPhoneChanged(response.data.tel);
      onUserCCodeChanged(response.data.tel_code);
    }
    console.log(verified);
    console.log(updateData);
    if (updateData && updateData["type"] == "password" && verified == "1") {
      console.log(verified);
      console.log(updateData);
      request
        .post("password/reset", {
          tel: response.data.tel,
          password: updateData["value"],
          confirm_password: updateData["value"],
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      await AsyncStorage.removeItem("update-data");
      await AsyncStorage.removeItem("verified");
    }

    onAddingFriendsByIDChanged(response.data.allowed_by_id);
    onAllowAddingFriendsByPhoneNumber(response.data.allowed_by_tel);
    setWord(response.data.word);
  }
  React.useEffect(() => {
    if (!isFocused) {
      onEditEmailChanged(false);
      onEditPasswordChanged(false);
      onEditPhoneNumberChanged(false);
    }

    InteractionManager.runAfterInteractions(() => {
      if (isFocused) {
        AsyncStorage.getItem("tel-navigate").then((val) => {
          if (val) {
            onPhoneNumberChanged(val);
            AsyncStorage.removeItem("tel-navigate").then(() => {
              onEditPhoneNumberChanged(true);
            });
          }
        });
      }

      loadUser();
      request.get("country_codes/").then(function (response) {
        let tmpCountry = response.data.map((country) => {
          return {
            id: country.tel_code,
            name: country.tel_code,
          };
        });
        onCountryCodeHtmlChanged(tmpCountry);
      });
    });
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
          alert.warning(error);
        }
      });
  }
  // updateUser(user, "gender", "Male");
  handleChoosePhoto = (type, name = "") => {
    const options = {
      mediaType: "photo",
      allowsEditing: true
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
      if(response.type.includes("image")){
          const formData = new FormData();
          formData.append("image", {
            ...response,
            uri:
              Platform.OS == "android"
                ? response.uri
                : response.uri.replace("file://", ""),
            name: name ? name : "mobile-" + uuid.v4() + ".jpg",
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
              if (
                error &&
                error.response &&
                error.response.data &&
                Object.keys(error.response.data).length > 0
              ) {
                alert.warning(error);
              }
            });
      } else {
        alert.warning(Translate.t("image_allowed"))
      }
    }
    });
  };
  function validateEmail(address) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/;
    if (address && reg.test(address) === false) {
      return false;
    }
    return true;
  }
  function processCountryCode(val) {
    let tmpItem = val.split("+");
    // alert.warning(tmpItem[1]);
    onCallingCodeChanged(tmpItem[1]);
  }
  function closePressed() {
    onShowCountryChanged(false);
  }
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <Modal visible={showCountry}>
        <SafeAreaView>
        <TouchableOpacity onPress={closePressed} style={[styles.button,{backgroundColor: 'white',borderColor: 'white'}]}>
          <Icon name={'close'} color={'black'} size={BUTTON_SIZE} />
        </TouchableOpacity>
          <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
            <View style={styles.searchInputContainer}>
              <TextInput
                onPress={() => this.textInput.focus()}
                ref={(input) => {
                  this.textInput = input;
                }}
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  setCountryHtml(
                    processCountryHtml(
                      countries.filter((country) => {
                        return (
                          country.name
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) >= 0 ||
                          country.tel_code
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) >= 0
                        );
                      })
                    )
                  );
                }}
                autoFocus={true}
                placeholder=""
                placeholderTextColor={"white"}
                style={styles.searchContactTextInput}
              ></TextInput>
              <Image
                style={styles.searchIcon}
                source={require("../assets/Images/searchIcon.png")}
              />
            </View>
          </View>
          <ScrollView>
            <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
              {countryHtml}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <Modal
          onShow={() => {
            this.textInput.focus();
          }}
          visible={show}
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
                ref={(input) => {
                  this.textInput = input;
                }}
                placeholder="入力してください"
                placeholderTextColor="white"
                maxLength={255}
                multiline={true}
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

        <CustomHeader
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onBack={() => {
            props.navigation.goBack();
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
                {/* <Image
                  style={{
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("5%"),
                    marginTop: heightPercentageToDP("1%"),
                    width: win.width / 12,
                    height: 23 * ratioCameraIcon,
                  }}
                  source={require("../assets/Images/cameraIcon.png")}
                /> */}
              <Camera 
                  style={{
                      position: "absolute",
                      right: 0,
                      marginRight: widthPercentageToDP("5%"),
                      marginTop: heightPercentageToDP("1%"),
                      width: win.width / 12,
                      height: 23 * ratioCameraIcon,
                    }} 
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
                {/* <Image
                  style={{
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("5%"),
                    marginTop: heightPercentageToDP("1%"),
                    width: win.width / 12,
                    height: 23 * ratioCameraIcon,
                  }}
                  source={require("../assets/Images/cameraIcon.png")}
                /> */}
                <Camera 
                  style={{
                      position: "absolute",
                      right: 0,
                      marginRight: widthPercentageToDP("5%"),
                      marginTop: heightPercentageToDP("1%"),
                      width: win.width / 12,
                      height: 23 * ratioCameraIcon,
                    }} 
                  />
              </TouchableWithoutFeedback>
            </ImageBackground>
          )}
        </View>
        <View
          style={{
            paddingBottom: heightPercentageToDP("5%"),
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
                style={{
                  width: widthPercentageToDP("22%"),
                  height: widthPercentageToDP("22%"),
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderColor: Colors.E6DADE,
                  borderRadius: 5
                }}
                source={{ uri: user.image.image }}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleChoosePhoto("image", "user_" + user.id + ".jpg");
                  }}
                >
                  {/* <Image
                    style={styles.cameraIconInsideProfilePicture}
                    source={require("../assets/Images/cameraIcon.png")}
                  /> */}
                  <Camera 
                    style={styles.cameraIconInsideProfilePicture}
                    />
                </TouchableWithoutFeedback>
              </ImageBackground>
            ) : (
              <ImageBackground
                style={{
                  width: widthPercentageToDP("22%"),
                  height: widthPercentageToDP("22%"),
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderColor: Colors.E6DADE,
                  borderRadius: 5
                }}
                source={require("../assets/Images/avatar.jpg")}
              >
                <TouchableWithoutFeedback
                  onPress={() => {
                    handleChoosePhoto("image", "user_" + user.id + ".jpg");
                  }}
                >
                  <Camera 
                    style={styles.cameraIconInsideProfilePicture}
                    />
                </TouchableWithoutFeedback>
              </ImageBackground>
            )}
            <View
              style={{
                width: "100%",
                marginLeft: widthPercentageToDP("3%"),
              }}
            >
              <TouchableWithoutFeedback onPress={() => onShowChanged(true)}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: widthPercentageToDP("1%"),
                  }}
                >
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
                </View>
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

          {/* ALL TABS CONTAINER */}
          <View style={{ marginTop: heightPercentageToDP("3%") }}>
            <View
              style={{
                flexDirection: "row",
                height: heightPercentageToDP("8%"),
                justifyContent: "flex-start",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("4%"),
                borderBottomWidth: 1,
                borderColor: Colors.F0EEE9,
              }}
            >
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
                      if (phoneNumber) {
                        // phoneNumber = phoneNumber.replace(/,/g, "")
                        if (userPhone == phoneNumber && userCCode == callingCode) {
                          onEditPhoneNumberChanged(false);
                        } else {
                          request.post("user/check-phone", {
                            tel: phoneNumber,
                            tel_code: callingCode,
                          }).then(function(response) {
                            if (response.data.success) {
                              onEditPhoneNumberChanged(false);
                              promptUpdate(props, user, "tel", [
                                callingCode,
                                phoneNumber,
                              ]);
                            } else {
                              alert.warning(Translate.t('registerWarning'));
                            }
                          })
                        }
                      } else {
                        alert.warning(Translate.t("fieldEmpty"));
                      }
                    }}
                  />

                  <TextInput
                    value={phoneNumber}
                    onChangeText={(value) => onPhoneNumberChanged(value)}
                    keyboardType={'numeric'}
                    style={{
                      borderRadius: 10,
                      fontSize: RFValue(10),
                      borderWidth: 1,
                      borderColor: "black",
                      height: heightPercentageToDP("6%"),
                      width: widthPercentageToDP("27%"),
                      paddingLeft: widthPercentageToDP("1%")
                    }}
                  />
                  {/* <CountrySearch onNavigate={
                    () => {
                      AsyncStorage.setItem("tel-navigate", phoneNumber);
                    }
                  } defaultCountry={user.tel_code} props={props} onCountryChanged={(val)=>{
                    if(val){
                      processCountryCode(val);
                    }
                  }}></CountrySearch> */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onShowCountryChanged(true);
                    }}
                  >
                    <View
                      style={{
                        //   alignItems: "center",
                        justifyContent: "center",
                        padding: 5,
                        borderWidth: 1,
                        borderRadius: 5,
                        width: widthPercentageToDP("23%"),
                        height: heightPercentageToDP("6%"),
                        marginRight: widthPercentageToDP("1%")
                      }}
                    >
                      <Text
                        style={{
                          // alignSelf: "center",
                          fontSize: RFValue(10),
                          paddingLeft: widthPercentageToDP("3%"),
                        }}
                      >
                        {countryCode}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
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
                    onPress={() => onEditPhoneNumberChanged(true)}
                  />
                  <Text style={{ fontSize: RFValue(12) }}>
                    {callingCode + phoneNumber}
                  </Text>
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
                      if (validateEmail(email) == true) {
                        if (email != user.email) {
                          promptUpdate(props, user, "email", email);
                        }
                      } else {
                        alert.warning(Translate.t("invalidEmail"), () => {
                          onEmailChanged(user.email);
                        });
                      }
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
                      onPasswordChanged("********");
                      if(tmpPassword){
                        promptUpdate(props, user, "password", tmpPassword);
                      }
                    }}
                  />
                  <TextInput
                    secureTextEntry={true}
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
                  <TextInput
                    secureTextEntry={true}
                    style={{ fontSize: RFValue(12) }}
                  >
                    {password}
                  </TextInput>
                </View>
              )}
            </View>
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
                <NextArrow style={styles.nextIcon} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("profileEditAllowAddFriendByID")}
            </Text>
            <Switch
              trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
              thumbColor={addingFriendsByID == 1 ? Colors.D7CCA6 : Colors.grey}
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
                        ][0] +
                          "(" +
                          Object.keys(error.response.data)[0] +
                          ")"
                      );
                    }
                  });
              }}
              value={addingFriendsByID}
            />
          </View>
          {/* <View style={styles.tabContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("profileEditAllowAddFriendByPhoneNum")}
            </Text>
            <Switch
              trackColor={{ true: Colors.F0EEE9, false: Colors.DCDCDC }}
              thumbColor={
                allowAddingFriendsByPhoneNumber == 1
                  ? Colors.D7CCA6
                  : Colors.grey
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
                        ][0] +
                          "(" +
                          Object.keys(error.response.data)[0] +
                          ")"
                      );
                    }
                  });
              }}
              value={allowAddingFriendsByPhoneNumber}
            />
          </View> */}
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
    width: RFValue(15),
    height: RFValue(15),
    position: "absolute",
    right: widthPercentageToDP("1%"),
    alignSelf: "center"
  },
  textInContainerRight: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(11),
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
    width: widthPercentageToDP("60%"),
    paddingLeft: 10
  },
  contactTabContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContactTextInput: {
    height: heightPercentageToDP("6%"),
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("15%"),
    flex: 1,
    color: "black",
    fontSize: RFValue(11),
    borderWidth: 1,
    borderColor: "black",
    borderRadius: win.width / 2,
  },
  contactListContainer: {
    marginTop: heightPercentageToDP("3%"),
  },
  searchIcon: {
    width: win.width / 16,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    borderWidth: 1,
    borderColor: "white",
    // backgroundColor: "orange",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("6%"),
  },
  contactListImage: {
    width: RFValue(40),
    height: RFValue(40),
    alignSelf: "center",
    borderRadius: win.width / 2,
  },
  contactListName: {
    fontSize: RFValue(14),
    marginLeft: widthPercentageToDP("5%"),
  },
});
