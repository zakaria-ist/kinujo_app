import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import DropDownPicker from "react-native-dropdown-picker";
import postal_code from "japan-postal-code-oasis";
import Moment from "moment";
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
// import DatePicker from "react-native-datepicker";
import { DatePicker } from "react-native-propel-kit";
import { Picker } from "@react-native-picker/picker";
import { fallbacks } from "i18n-js";
import { useIsFocused } from "@react-navigation/native";

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioDownForMore = win.width / 26 / 9;
const ratioNext = win.width / 38 / 8;
let controller;
let controller2;
let day = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();
export default function ProfileInformation(props) {
  const [user, onUserChanged] = useStateIfMounted({});
  const [editName, onEditNameChanged] = useStateIfMounted(false);
  const [editNickname, onEditNicknameChanged] = useStateIfMounted(false);
  const [editGender, onEditGenderChanged] = useStateIfMounted(false);
  const [editBirthday, onEditBirthdayChanged] = useStateIfMounted(false);
  const [editPostalCode, onEditPostalCodeChanged] = useStateIfMounted(false);
  const [editPrefecture, onEditPrefectureChanged] = useStateIfMounted(false);
  const [editAddress1, onEditAddress1Changed] = useStateIfMounted(false);
  const [editAddress2, onEditAddress2Changed] = useStateIfMounted(false);
  const [name, onNameChanged] = useStateIfMounted("");
  const [nickname, onNicknameChanged] = useStateIfMounted("");
  const [gender, onGenderChanged] = useStateIfMounted("");
  const [birthday, onBirthdayChanged] = useStateIfMounted("");
  const [postalCode, onPostalCodeChanged] = useStateIfMounted("");
  const [prefecture, onPrefectureChanged] = useStateIfMounted("");
  const [prefectures, onPrefecturesChanged] = useStateIfMounted([]);
  const [address1, onAddress1Changed] = useStateIfMounted("");
  const [address2, onAddress2Changed] = useStateIfMounted("");
  const [date, setDate] = useStateIfMounted(year + "-" + month + "-" + day);
  const [pickerShow, onPickerShow] = useStateIfMounted(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      postal_code.configure(
        "https://kinujo.s3-ap-southeast-1.amazonaws.com/zip/"
      );

      request.get("prefectures/").then(function (response) {
        let tmpPrefectures = response.data.map((prefecture) => {
          return {
            label: prefecture.name,
            value: prefecture.url,
          };
        });
        tmpPrefectures.push({
          label: "Prefecture",
          value: "",
        });
        onPrefecturesChanged(tmpPrefectures);
      });
    });
  }, []);
  function updateUser(user, field, value, overrideObj = "") {
    if (!value) return;
    if (field == "birthday") {
      Moment.locale("en");
      value = Moment(value).format("YYYY-MM-DD");
      onBirthdayChanged(value);
      onEditBirthdayChanged(false);
    }
    let obj = {};
    if (field == 'postal') {
      obj["zipcode"] = value.zipcode;
      obj["prefecture"] = value.prefecture;
    } else {
      obj[field] = value;
    }
    
    console.log(obj);
    request
      .patch(user.url, overrideObj ? overrideObj : obj)
      .then(function (response) {
        AsyncStorage.getItem("user").then(function (url) {
          request
            .get(url)
            .then(function (response) {
              onUserChanged(response.data);
              // onNameChanged(response.data.real_name);
              // onNicknameChanged(response.data.nickname);
              // onGenderChanged(response.data.gender);
              // onBirthdayChanged(response.data.birthday);
              // onPostalCodeChanged(response.data.zipcode);
              // onPrefectureChanged(response.data.prefecture);
              // onAddress1Changed(response.data.address1);
              // onAddress2Changed(response.data.address2);
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
        });
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
  React.useEffect(() => {
    if(!isFocused){
      onEditAddress1Changed(false);
      onEditAddress2Changed(false);
      onEditGenderChanged(false);
      onEditNameChanged(false);
      onEditNicknameChanged(false);
      onEditPostalCodeChanged(false);
      onEditPrefectureChanged(false);
    }
    InteractionManager.runAfterInteractions(() => {
      loadUser();
    });
  }, [isFocused]);
  function loadUser() {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          onNameChanged(response.data.real_name);
          onNicknameChanged(response.data.nickname);
          onGenderChanged(response.data.gender);
          onBirthdayChanged(response.data.birthday);
          onPostalCodeChanged(response.data.zipcode);
          onPrefectureChanged(response.data.prefecture);
          onAddress1Changed(response.data.address1);
          onAddress2Changed(response.data.address2);
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
    });
  }
  if (
    editName == true ||
    editNickname == true ||
    editGender == true ||
    editBirthday == true ||
    editPostalCode == true ||
    editPrefecture == true ||
    editAddress1 == true ||
    editAddress2 == true
  ) {
    controller.close();
  }
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
          text={Translate.t("personalInformation")}
        />
        <CustomSecondaryHeader outUser={user} props={props} name={user.nickname} />
        <View
          style={{
            marginTop: heightPercentageToDP("2%"),
            paddingBottom: heightPercentageToDP("5%"),
          }}
        >
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("nameOfSeller")}
            </Text>
            {editName == true ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-3%"),
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditNameChanged(false);
                    updateUser(user, "real_name", name);
                  }}
                />
                <TextInput
                  value={name}
                  onChangeText={(value) => onNameChanged(value)}
                  style={styles.textInput}
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
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditNameChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{name}</Text>
              </View>
            )}
          </View>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("name")}
            </Text>
            {editNickname == true ? (
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-3%"),
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditNicknameChanged(false);
                    updateUser(user, "nickname", nickname);
                  }}
                />
                <TextInput
                  value={nickname}
                  onChangeText={(value) => onNicknameChanged(value)}
                  style={styles.textInput}
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
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditNicknameChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{nickname}</Text>
              </View>
            )}
          </View>
          <View style={styles.ddproductInformationContainer}>
            <Text
              style={
                pickerShow == false
                  ? styles.genderTitle
                  : styles.genderTitleWithDropDown
              }
            >
              {Translate.t("gender")}
            </Text>
            <View
              style={
                pickerShow == false ? styles.normalDropDown : styles.dropDown
              }
            >
              <DropDownPicker
                onClose={() => onPickerShow(false)}
                onOpen={() => onPickerShow(true)}
                // zIndex={9999}
                controller={(instance) => (controller = instance)}
                style={{
                  borderWidth: 1,
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                  color: "black",
                  width: widthPercentageToDP("30%"),
                }}
                items={[
                  {
                    label: Translate.t('female'),
                    value: "1",
                  },
                  {
                    label: Translate.t("male"),
                    value: "0",
                  },
                ]}
                defaultValue={gender == "0" || gender == "1" ? gender + "" : ""}
                labelStyle={{
                  fontSize: RFValue(12),
                  color: "gray",
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                selectedtLabelStyle={{
                  color: Colors.F0EEE9,
                }}
                placeholder={Translate.t("gender")}
                dropDownStyle={{
                  width: widthPercentageToDP("30%"),
                  backgroundColor: "#FFFFFF",
                  color: "black",
                }}
                onChangeItem={(item) => {
                  if (item) {
                    console.log(item);
                    onGenderChanged(item.value);
                    updateUser(user, "gender", item.value);
                  }
                }}
              />
            </View>
          </View>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("birthday")}
            </Text>
            {birthday == null ? (
              <View
                style={{
                  paddingBottom: heightPercentageToDP("2%"),
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginRight: widthPercentageToDP("-2%"),
                }}
              >
                <DatePicker
                  title={date}
                  // placeholder={date}
                  // initialValue={""}
                  style={{
                    borderWidth: 1,
                    width: widthPercentageToDP("30%"),
                    height: heightPercentageToDP("5%"),
                    borderRadius: 5,
                    paddingVertical: heightPercentageToDP("1%"),
                    paddingHorizontal: heightPercentageToDP("1%"),
                    borderColor: Colors.CECECE,
                    marginRight: widthPercentageToDP("3%"),
                  }}
                  onChange={(date) => {
                    updateUser(user, "birthday", date);
                  }}
                />
                {/* <DatePicker
                  style={{
                    width: widthPercentageToDP("50%"),
                    borderColor: "red",
                  }}
                  display="inline"
                  date={birthday}
                  mode="date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateInput: {
                      marginRight: widthPercentageToDP("3%"),
                      borderWidth: 0,
                    },
                  }}
                  onDateChange={(date) => {
                    onBirthdayChanged(date);
                    updateUser(user, "birthday", date);
                  }}
                /> */}
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
                  position: "absolute",
                  right: 0,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12),
                    marginRight: widthPercentageToDP("3%"),
                  }}
                >
                  {birthday}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("postalCode")}
            </Text>
            {editPostalCode == true ? (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditPostalCodeChanged(false);
                    console.log(postalCode)
                    let tmpPrefecture = prefecture;
                    updateUser(user, "postal", {
                      "zipcode" : postalCode,
                      "prefecture" : tmpPrefecture
                    });
                  }}
                />
                <TextInput
                  value={postalCode}
                  keyboardType={"numeric"}
                  onChangeText={(value) => {
                    onPostalCodeChanged(value);
                    postal_code(value).then((address) => {
                      console.log(address);
                      if (address && address.prefecture) {
                        let tmpPrefectures = prefectures.filter((prefecture) => {
                          return prefecture.label == address.prefecture;
                        });
                
                        if (tmpPrefectures.length > 0) {
                          onPrefectureChanged(tmpPrefectures[0].value);
                        }
                        // onAddChanged(address.city + " " + address.area);
                      }
                    });
                  }}
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditPostalCodeChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{postalCode}</Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // marginTop: heightPercentageToDP("2%"),
              marginHorizontal: widthPercentageToDP("3%"),
              borderBottomWidth: 1,
              borderBottomColor: Colors.F0EEE9,
              paddingVertical: heightPercentageToDP("2%"),
              paddingBottom:
                editPrefecture == true
                  ? heightPercentageToDP("15%")
                  : heightPercentageToDP("2%"),
              justifyContent: "space-between",
              zIndex: 999,
            }}
          >
            <Text style={styles.productInformationTitle}>
              {Translate.t("prefecture")}
            </Text>
            {/* {editPrefecture == true ? (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditPrefectureChanged(false);
                    updateUser(user, "prefecture_id", prefecture);
                  }}
                />
                <TextInput
                  value={prefecture}
                  onChangeText={(value) => onPrefectureChanged(value)}
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditPrefectureChanged(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{prefecture}</Text>
              </View>
            )} */}
            <DropDownPicker
              controller={(instance) => (controller2 = instance)}
              onOpen={() => onEditPrefectureChanged(true)}
              onClose={() => onEditPrefectureChanged(false)}
              style={{
                flex: 1,
                borderWidth: 1,
                backgroundColor: "white",
                borderColor: "transparent",
                borderRadius: 0,
                fontSize: RFValue(10),
                height: heightPercentageToDP("5.8%"),
                paddingLeft: widthPercentageToDP("2%"),
                marginVertical: heightPercentageToDP("1%"),
                // zIndex: 999,
              }}
              items={prefectures ? prefectures : []}
              defaultValue={prefecture ? prefecture : ""}
              containerStyle={{
                height: heightPercentageToDP("8%"),
                width: widthPercentageToDP("40%"),
              }}
              labelStyle={{
                fontSize: RFValue(10),
                color: Colors.D7CCA6,
              }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              selectedtLabelStyle={{
                color: Colors.D7CCA6,
              }}
              placeholder={Translate.t("prefecture")}
              dropDownStyle={{ backgroundColor: "#000000" }}
              onChangeItem={(item) => {
                if (item) {
                  onPrefectureChanged(item.value);
                  updateUser(user, "prefecture", item.value);
                }
              }}
            />
          </View>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("address1")}
            </Text>
            {editAddress1 == true ? (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditAddress1Changed(false);
                    updateUser(user, "address1", address1);
                  }}
                />
                <TextInput
                  value={address1}
                  onChangeText={(value) => onAddress1Changed(value)}
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditAddress1Changed(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{address1}</Text>
              </View>
            )}
          </View>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationTitle}>
              {Translate.t("address2")}
            </Text>
            {editAddress2 == true ? (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                    onEditAddress2Changed(false);
                    updateUser(user, "address2", address2);
                  }}
                />
                <TextInput
                  value={address2}
                  onChangeText={(value) => onAddress2Changed(value)}
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: heightPercentageToDP("3%"),
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
                  onPress={() => onEditAddress2Changed(true)}
                />
                <Text style={{ fontSize: RFValue(12) }}>{address2}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: heightPercentageToDP("2%"),
    paddingVertical: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    // paddingBottom: heightPercentageToDP("2%"),
    // backgroundColor: "orange",
  },
  ddproductInformationContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    // paddingBottom: heightPercentageToDP("2%"),
    zIndex: 999999,
  },
  productInformationTitle: {
    alignSelf: "center",
    fontSize: RFValue(12),
  },
  genderTitle: {
    alignSelf: "center",
    fontSize: RFValue(12),
  },
  genderTitleWithDropDown: {
    alignSelf: "center",
    fontSize: RFValue(12),
    paddingBottom: heightPercentageToDP("10%"),
  },
  productInformationDetails: {
    paddingBottom: heightPercentageToDP("2%"),
    position: "absolute",
    right: 0,
    fontSize: RFValue(12),
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  downForMoreIcon: {
    width: win.width / 26,
    height: 6 * ratioDownForMore,
    position: "absolute",
    right: 0,
  },
  textInput: {
    fontSize: RFValue(12),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("50%"),
    borderRadius: 7,
    alignSelf: "center",
    paddingLeft: 10
  },

  dropDown: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: heightPercentageToDP("10%"),
  },
  normalDropDown: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingBottom: heightPercentageToDP("10%"),
  },
});
