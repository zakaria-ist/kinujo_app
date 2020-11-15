import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
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
const ratioDownForMore = win.width / 26 / 9;
const ratioNext = win.width / 38 / 8;

function updateUser(user, field, value) {
  let obj = {};
  obj[field] = value;
  request
    .patch(user.url, obj)
    .then(function(response) {})
    .catch(function(error) {
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

export default function ProfileInformation(props) {
  const [user, onUserChanged] = React.useState({});
  const [editName, onEditNameChanged] = React.useState(false);
  const [editGender, onEditGenderChanged] = React.useState(false);
  const [editBirthday, onEditBirthdayChanged] = React.useState(false);
  const [editPostalCode, onEditPostalCodeChanged] = React.useState(false);
  const [editPrefecture, onEditPrefectureChanged] = React.useState(false);
  const [editAddress1, onEditAddress1Changed] = React.useState(false);
  const [editAddress2, onEditAddress2Changed] = React.useState(false);
  const [name, onNameChanged] = React.useState("");
  const [gender, onGenderChanged] = React.useState("");
  const [birthday, onBirthdayChanged] = React.useState("");
  const [postalCode, onPostalCodeChanged] = React.useState("");
  const [prefecture, onPrefectureChanged] = React.useState("");
  const [address1, onAddress1Changed] = React.useState("");
  const [address2, onAddress2Changed] = React.useState("");

  if (!user.url) {
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
          onNameChanged(response.data.real_name);
          onGenderChanged(response.data.gender);
          onBirthdayChanged(response.data.birthday);
          onPostalCodeChanged(response.data.zipcode);
          onPrefectureChanged(response.data.prefecture_id);
          onAddress1Changed(response.data.address1);
          onAddress2Changed(response.data.address2);
        })
        .catch(function(error) {
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
        text={Translate.t("personalInformation")}
      />
      <CustomSecondaryHeader
        name={user.real_name ? user.real_name : user.nickname}
      />
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
            {Translate.t("gender")}
          </Text>
          {editGender == true ? (
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
                  onEditGenderChanged(false);
                  updateUser(user, "gender", gender);
                }}
              />
              <TextInput
                value={gender}
                onChangeText={(value) => onGenderChanged(value)}
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
                onPress={() => onEditGenderChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{gender}</Text>
            </View>
          )}
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("birthday")}
          </Text>
          {editBirthday == true ? (
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
                  onEditBirthdayChanged(false);
                  updateUser(user, "birthday", birthday);
                }}
              />
              <TextInput
                value={birthday}
                onChangeText={(value) => onBirthdayChanged(value)}
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
                onPress={() => onEditBirthdayChanged(true)}
              />
              <Text style={{ fontSize: RFValue(12) }}>{birthday}</Text>
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
                  updateUser(user, "zipcode", postalCode);
                }}
              />
              <TextInput
                value={postalCode}
                onChangeText={(value) => onPostalCodeChanged(value)}
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
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationTitle}>
            {Translate.t("prefecture")}
          </Text>
          {editPrefecture == true ? (
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
          )}
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
    </ScrollView>
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
    paddingBottom: heightPercentageToDP("2%"),
  },
  productInformationTitle: {
    fontSize: RFValue(12),
  },
  productInformationDetails: {
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
    fontSize: RFValue(8),
    borderWidth: 1,
    borderColor: "black",
    height: heightPercentageToDP("4%"),
    width: widthPercentageToDP("50%"),
    borderRadius: 7
  },
});
