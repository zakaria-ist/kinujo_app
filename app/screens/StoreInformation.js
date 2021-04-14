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

function updateUser(user, field, value) {
  if (!value) return;
  let obj = {};
  if (field == 'postal') {
    obj["zipcode"] = value.zipcode;
    obj["prefecture"] = value.prefecture;
  } else {
    obj[field] = value;
  }
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
let controller;
export default function StoreInformation(props) {
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
  const [corporateName, onCorporateNameChanged] = useStateIfMounted("");
  const [representativeName, onRepresentativeNameChanged] = useStateIfMounted("");
  const [postalCode, onPostalCodeChanged] = useStateIfMounted("");
  const [prefecture, onPrefectureChanged] = useStateIfMounted("");
  const [prefectures, onPrefecturesChanged] = useStateIfMounted([]);
  const [address1, onAddress1Changed] = useStateIfMounted("");
  const [address2, onAddress2Changed] = useStateIfMounted("");
  const [user, onUserChanged] = useStateIfMounted({});
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
    if(!isFocused){
      onEditPasswordChanged(false);
      onEditPostalCodeChanged(false);
      onEditPrefectureChanged(false);
      onEditRepresentativeNameChanged(false);
    }
    InteractionManager.runAfterInteractions(() => {
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
              onUserChanged(response.data);
              onCorporateNameChanged(response.data.corporate_name);
              onRepresentativeNameChanged(response.data.representative_name);
              onPostalCodeChanged(response.data.zipcode);
              onPrefectureChanged(response.data.prefecture_id);
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
      });
    });
  }, [isFocused]);
  return (
    <SafeAreaView>
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
          {/* {editPrefecture == true ? (
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
  },
});
