import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
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
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
const request = new Request();
const alert = new CustomAlert();


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

export default function StoreInformation(props) {
  const [password, onPasswordChanged] = React.useState("XXXXXXXXXXX STORE");
  const [editPassword, onEditPasswordChanged] = React.useState(false);
  const [editCorporateName, onEditCorporateNameChanged] = React.useState(false);
  const [editRepresentativeName, onEditRepresentativeNameChanged] = React.useState(false);
  const [editPostalCode, onEditPostalCodeChanged] = React.useState(false);
  const [editPrefecture, onEditPrefectureChanged] = React.useState(false);
  const [editAddress1, onEditAddress1Changed] = React.useState(false);
  const [editAddress2, onEditAddress2Changed] = React.useState(false);
  const [corporateName, onCorporateNameChanged] = React.useState("");
  const [representativeName, onRepresentativeNameChanged] = React.useState("");
  const [postalCode, onPostalCodeChanged] = React.useState("");
  const [prefecture, onPrefectureChanged] = React.useState("");
  const [address1, onAddress1Changed] = React.useState("");
  const [address2, onAddress2Changed] = React.useState("");
  const [user, onUserChanged] = React.useState({});

  if (!user.url) {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          onCorporateNameChanged(response.data.corporate_name)
          onRepresentativeNameChanged(response.data.representative_name)
          onPostalCodeChanged(response.data.zipcode)
          onPrefectureChanged(response.data.prefecture_id)
          onAddress1Changed(response.data.address1)
          onAddress2Changed(response.data.address2)
        })
        .catch(function (error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
          }
        });
    });
  }

  return (
    <SafeAreaView>
      <CustomHeader
        onFavoriteChanged="noFavorite"
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("storeInformation")}
      />
      <CustomSecondaryHeader
        name={user.real_name ? user.real_name : user.nickname}
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
                  onEditCorporateNameChanged(false)
                  updateUser(user, 'corporate_name', corporateName)
                }}
              />
              <TextInput
                value={corporateName}
                onChangeText={(value) => onCorporateNameChanged(value)}
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
                  onEditRepresentativeNameChanged(false)
                  updateUser(user, 'representative_name', representativeName)
                }}
              />
              <TextInput
                value={representativeName}
                onChangeText={(value) => onRepresentativeNameChanged(value)}
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
              <Text style={{ fontSize: RFValue(12) }}>{representativeName}</Text>
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
                  onEditPostalCodeChanged(false)
                  updateUser(user, 'zipcode', postalCode)
                }}
              />
              <TextInput
                value={postalCode}
                onChangeText={(value) => onPostalCodeChanged(value)}
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
                  onEditPrefectureChanged(false)
                  updateUser(user, 'prefecture_id', prefecture)
                }}
              />
              <TextInput
                value={prefecture}
                onChangeText={(value) => onPrefectureChanged(value)}
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
                  onEditAddress1Changed(false)
                  updateUser(user, 'address1', address1)
                }}
              />
              <TextInput
                value={address1}
                onChangeText={(value) => onAddress1Changed(value)}
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
                  onEditAddress2Changed(false)
                  updateUser(user, 'address2', address2)
                }}
              />
              <TextInput
                value={address2}
                onChangeText={(value) => onAddress2Changed(value)}
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
});
