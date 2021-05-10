import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import postal_code from "japan-postal-code-oasis";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;

function updateUser(user, field, value) {
  if (!value) return;
  let obj = {};
  if (field == 'postal') {
    obj["zipcode"] = value.zipcode;
    obj["prefecture"] = value.prefecture;
  } else {
    obj[field] = value;
  }
  console.log(obj, value)
  request
    .patch(user.url, obj)
    .then(function (response) {
      if (response.data) {
        onUserChanged(response.data);
      }
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
let controller;
export default function StoreInformation(props) {
  const BUTTON_SIZE = 40;
  const [password, onPasswordChanged] = useStateIfMounted("XXXXXXXXXXX STORE");
  const [editPassword, onEditPasswordChanged] = useStateIfMounted(false);
  const [editCorporateName, onEditCorporateNameChanged] = useStateIfMounted(false);
  const [
    editRepresentativeName,
    onEditRepresentativeNameChanged,
  ] = useStateIfMounted(false);
  const [editPostalCode, onEditPostalCodeChanged] = useStateIfMounted(false);
  const [editPrefecture, onEditPrefectureChanged] = useStateIfMounted(false);
  const [editAddress1, onEditAddress1Changed] = useStateIfMounted(false);
  const [editAddress2, onEditAddress2Changed] = useStateIfMounted(false);
  const [phoneNumber, onPhoneNumberChanged] = useStateIfMounted("");
  const [editPhoneNumber, onEditPhoneNumberChanged] = useStateIfMounted(false);
  const [corporateName, onCorporateNameChanged] = useStateIfMounted("");
  const [representativeName, onRepresentativeNameChanged] = useStateIfMounted("");
  const [postalCode, onPostalCodeChanged] = useStateIfMounted("");
  const [prefecture, onPrefectureChanged] = useStateIfMounted("");
  const [prefectures, onPrefecturesChanged] = useStateIfMounted([]);
  const [address1, onAddress1Changed] = useStateIfMounted("");
  const [address2, onAddress2Changed] = useStateIfMounted("");
  const [user, onUserChanged] = useStateIfMounted({});
  const [nickName, onNickNameChanged] = useStateIfMounted("");
  const [editNickName, onEditNickNameChanged] = useStateIfMounted(false);
  const [editRealName, onEditRealNameChanged] = useStateIfMounted(false);
  const [realName, onRealNameChanged] = useStateIfMounted("");
  const [countryHtml, setCountryHtml] = useStateIfMounted(<View></View>);
  const [showCountry, onShowCountryChanged] = useStateIfMounted(false);
  const [countryCode, setCountryCode] = useStateIfMounted("");
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [searchText, setSearchText] = useStateIfMounted("");
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
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

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setCountryCode("+81");
      onCallingCodeChanged("+81");
    });
  }, [isFocused]);

  function processCountryHtml(countries) {
    let html = [];
    countries.map((country) => {
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
  function closePressed() {
    onShowCountryChanged(false);
    setSearchText("");
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      request.get("country_codes/").then(function (response) {
        countries = response.data;
        setCountryHtml(processCountryHtml(countries));
      });
    });
  }, [true]);

  React.useEffect(() => {
    if(!isFocused){
      onEditPasswordChanged(false);
      onEditPostalCodeChanged(false);
      onEditPrefectureChanged(false);
      onEditCorporateNameChanged(false);
      onEditRepresentativeNameChanged(false);
      onEditNickNameChanged(false);
      onEditRealNameChanged(false);
      onEditPhoneNumberChanged(false);
    }
    InteractionManager.runAfterInteractions(() => {
      request.get("country_codes/").then(function (response) {
        let tmpCountry = response.data.map((country) => {
          return {
            id: country.tel_code,
            name: country.tel_code,
          };
        });
        onCountryCodeHtmlChanged(tmpCountry);
      });
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

        AsyncStorage.getItem("user").then(function (url) {
          request
            .get(url)
            .then(function (response) {
              console.log(response.data);
              onUserChanged(response.data);
              onNickNameChanged(response.data.nickname);
              onRealNameChanged(response.data.real_name);
              onCorporateNameChanged(response.data.corporate_name);
              onRepresentativeNameChanged(response.data.representative_name);
              onPostalCodeChanged(response.data.zipcode);
              onPrefectureChanged(response.data.prefecture);
              onAddress1Changed(response.data.address1);
              onAddress2Changed(response.data.address2);
              if (response.data.corporate_tel_code && response.data.corporate_tel_code != null) {
                setCountryCode(response.data.corporate_tel_code);
                onCallingCodeChanged(response.data.corporate_tel_code);
              } else {
                setCountryCode("");
                onCallingCodeChanged("");
              }
              if (response.data.corporate_tel) {
                onPhoneNumberChanged(response.data.corporate_tel);
              } else {
                onPhoneNumberChanged("");
              }
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
      });
    });
  }, [isFocused]);
  return (
    <SafeAreaView>
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
      <CustomHeader
        onFavoriteChanged="noFavorite"
        onBack={() => {
          props.navigation.goBack();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("storeInformation")}
      />
      <CustomSecondaryHeader outUser={user} props={props}
        name={user.nickname}
        accountType={Translate.t("storeAccount")}
      />
      <View style={{ marginTop: heightPercentageToDP("2%") }}>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("realName")}
          </Text>
          {editRealName == true ? (
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
                marginRight: widthPercentageToDP("-3%"),
                // paddingBottom: heightPercentageToDP("2%"),
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
                  onEditRealNameChanged(false);
                  updateUser(user, "real_name", realName);
                }}
              />
              <TextInput
                value={realName}
                onChangeText={(value) => onRealNameChanged(value)}
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
                // paddingBottom: heightPercentageToDP("2%"),
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
                onPress={() => onEditRealNameChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{realName}</Text>
            </View>
          )}
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("name")}
          </Text>
          {editNickName == true ? (
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
                marginRight: widthPercentageToDP("-3%"),
                // paddingBottom: heightPercentageToDP("2%"),
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
                // paddingBottom: heightPercentageToDP("2%"),
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
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("corporateName")}
          </Text>
          {editCorporateName == true ? (
            <View
              style={{
                position: "absolute",
                right: 0,
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "flex-start",
                marginRight: widthPercentageToDP("-3%"),
                // paddingBottom: heightPercentageToDP("2%"),
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
                  onEditCorporateNameChanged(false);
                  updateUser(user, "corporate_name", corporateName);
                }}
              />
              <TextInput
                value={corporateName}
                onChangeText={(value) => onCorporateNameChanged(value)}
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
                // paddingBottom: heightPercentageToDP("2%"),
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
                onPress={() => onEditCorporateNameChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{corporateName}</Text>
            </View>
          )}
        </View>
        <View style={styles.productInformationContainer}>
            <Text style={styles.textInContainerLeft}>
              {Translate.t("corporatePhoneNumber")}
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
                    if (phoneNumber) {
                      onEditPhoneNumberChanged(false);
                      updateUser(user, "corporate_tel_code", callingCode);
                      setTimeout(() => {
                        updateUser(user, "corporate_tel", phoneNumber);
                      }, 1000);
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
                    fontSize: RFValue(11),
                    borderWidth: 1,
                    borderColor: "black",
                    height: heightPercentageToDP("6%"),
                    width: widthPercentageToDP("27%"),
                    paddingLeft: widthPercentageToDP("1%")
                  }}
                />
                <TouchableWithoutFeedback
                  onPress={() => {
                    onShowCountryChanged(true);
                  }}
                >
                  <View
                    style={{
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
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("representativeName")}
          </Text>
          {editRepresentativeName == true ? (
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
                  onEditRepresentativeNameChanged(false);
                  updateUser(user, "representative_name", representativeName);
                }}
              />
              <TextInput
                value={representativeName}
                onChangeText={(value) => onRepresentativeNameChanged(value)}
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
                onPress={() => onEditRepresentativeNameChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>
                {representativeName}
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
                  // updateUser(user, "zipcode", postalCode);
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
                }
                }
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
            marginTop: heightPercentageToDP("2%"),
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
          <DropDownPicker
            controller={(instance) => (controller = instance)}
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  productInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("2%"),

    // backgroundColor: "orange",
  },
  productInformationTitle: {
    fontSize: RFValue(12),
  },
  productInformationDetails: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(12),
  },
  textInput: {
    fontSize: RFValue(11),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("6%"),
    width: widthPercentageToDP("50%"),
    borderRadius: 7,
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
