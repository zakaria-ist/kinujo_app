import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import DropDownPicker from "react-native-dropdown-picker";
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
const request = new Request();
const alert = new CustomAlert();
import postal_code from "japan-postal-code-oasis";
const win = Dimensions.get("window");
export default function AddressManagement(props) {
  const [prefectures, onPrefecturesChanged] = React.useState([]);
  const [prefectureLoaded, onPrefectureLoadedChanged] = React.useState(false);
  const [address, onAddressChanged] = React.useState({});
  const [name, onNameChanged] = React.useState("");
  const [zipcode, onZipcodeChanged] = React.useState("");
  const [prefecture, onPrefectureChanged] = React.useState(null);
  const [add, onAddChanged] = React.useState("");
  const [buildingName, onBuildingNameChanged] = React.useState("");
  const [phoneNumber, onPhoneNumberChanged] = React.useState("");
  let controller;

  if (!prefectureLoaded) {
    request
      .get("prefectures/")
      .then(function (response) {
        let tmpPrefectures = response.data.map((prefecture) => {
          return {
            label: prefecture.name,
            value: prefecture.url,
          };
        });
        onPrefecturesChanged(tmpPrefectures);
        onPrefectureLoadedChanged(true);

        if (props.route.params && props.route.params.url && !address.url) {
          request
            .get(props.route.params.url)
            .then(function (response) {
              onAddressChanged(response.data);
              onNameChanged(response.data.name);
              onZipcodeChanged(response.data.zip1);
              onPrefectureChanged(response.data.prefecture);
              onAddChanged(response.data.address1);
              onBuildingNameChanged(response.data.address_name);
              onPhoneNumberChanged(response.data.tel);
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
    postal_code.configure(
      "https://kinujo.s3-ap-southeast-1.amazonaws.com/zip/"
    );
  }, []);
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          onNameChanged("");
          onZipcodeChanged("");
          onPrefectureChanged(null);
          onAddChanged("");
          onBuildingNameChanged("");
          onPhoneNumberChanged("");
          onPrefecturesChanged([]);
          onPrefectureLoadedChanged(false);
          controller.reset();
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("addressee")}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder={Translate.t("name")}
          placeholderTextColor={Colors.D7CCA6}
          style={styles.textInput}
          value={name}
          onChangeText={(text) => onNameChanged(text)}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("postalCode")}
          placeholderTextColor={Colors.D7CCA6}
          style={styles.textInput}
          value={zipcode}
          onChangeText={(text) => {
            onZipcodeChanged(text);
            postal_code(text).then((address) => {
              if (address && address.prefecture) {
                let tmpPrefectures = prefectures.filter((prefecture) => {
                  return prefecture.label == address.prefecture;
                });

                if (tmpPrefectures.length > 0) {
                  onPrefectureChanged(tmpPrefectures[0].value);
                }
              }
            });
          }}
        ></TextInput>
        <DropDownPicker
          controller={(instance) => (controller = instance)}
          style={styles.textInput}
          items={prefectures ? prefectures : []}
          defaultValue={prefecture ? prefecture : null}
          containerStyle={{ height: heightPercentageToDP("8%") }}
          labelStyle={{
            fontSize: RFValue(12),
            color: Colors.F0EEE9,
          }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          selectedtLabelStyle={{
            color: Colors.F0EEE9,
          }}
          placeholder={Translate.t("prefecture")}
          dropDownStyle={{ backgroundColor: "#000000" }}
          onChangeItem={(item) => {
            if (item) {
              onPrefectureChanged(item.value);
            }
          }}
        />
        <TextInput
          placeholder={Translate.t("address1")}
          placeholderTextColor={Colors.D7CCA6}
          style={styles.textInput}
          value={add}
          onChangeText={(text) => onAddChanged(text)}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("address2")}
          placeholderTextColor={Colors.D7CCA6}
          style={styles.textInput}
          value={buildingName}
          onChangeText={(text) => onBuildingNameChanged(text)}
        ></TextInput>
        <TextInput
          placeholder={Translate.t("profileEditPhoneNumber")}
          placeholderTextColor={Colors.D7CCA6}
          style={styles.textInput}
          value={phoneNumber}
          onChangeText={(text) => onPhoneNumberChanged(text)}
        ></TextInput>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          if (props.route.params && props.route.params.url) {
            request
              .patch(props.route.params.url, {
                address1: add,
                address2: add,
                address_name: buildingName,
                name: name,
                prefecture: prefecture,
                tel: phoneNumber,
                zip1: zipcode,
              })
              .then(function (response) {
                props.navigation.pop();
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
          } else {
            AsyncStorage.getItem("user").then(function (url) {
              request
                .post("addresses/", {
                  address1: add,
                  address2: add,
                  address_name: buildingName,
                  name: name,
                  prefecture: prefecture,
                  tel: phoneNumber,
                  user: url,
                  zip1: zipcode,
                })
                .then(function (response) {
                  onNameChanged("");
                  onZipcodeChanged("");
                  onPrefectureChanged(null);
                  onAddChanged("");
                  onBuildingNameChanged("");
                  onPhoneNumberChanged("");
                  onPrefecturesChanged([]);
                  onPrefectureLoadedChanged(false);
                  props.navigation.pop();
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
            });
          }
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>
            {Translate.t("addressRegister")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "transparent",
    borderRadius: 0,
    fontSize: RFValue(12),
    height: heightPercentageToDP("5.5%"),
    paddingLeft: widthPercentageToDP("2%"),
    marginVertical: heightPercentageToDP("1%"),
  },
  textInputContainer: {
    marginTop: heightPercentageToDP("2.5%"),
    backgroundColor: Colors.F0EEE9,
    marginHorizontal: widthPercentageToDP("5%"),
    padding: widthPercentageToDP("4%"),
    justifyContent: "space-evenly",
  },
  buttonContainer: {
    backgroundColor: Colors.E6DADE,
    marginHorizontal: widthPercentageToDP("25%"),
    borderRadius: 5,
    alignItems: "center",
    marginTop: heightPercentageToDP("5%"),
    padding: heightPercentageToDP("1%"),
  },
  buttonText: {
    fontSize: RFValue(14),
    color: "white",
  },
});
