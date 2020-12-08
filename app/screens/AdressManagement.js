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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
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
  const [address2, onAddress2Changed] = React.useState("");
  const [name, onNameChanged] = React.useState("");
  const [zipcode, onZipcodeChanged] = React.useState("");
  const [prefecture, onPrefectureChanged] = React.useState("");
  const [add, onAddChanged] = React.useState("");
  const [buildingName, onBuildingNameChanged] = React.useState("");
  const [phoneNumber, onPhoneNumberChanged] = React.useState("");
  let controller;
  function handlePhone(value) {
    onPhoneNumberChanged(value.replace(/[^0-9]/g, ""));
  }
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
              onAddress2Changed(response.data.address2);
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
                alert.warning("1");
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
          alert.warning("2");
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
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          // onNameChanged("");
          // onZipcodeChanged("");
          // onPrefectureChanged(null);
          // onAddChanged("");
          // onBuildingNameChanged("");
          // onPhoneNumberChanged("");
          // onPrefecturesChanged([]);
          // onPrefectureLoadedChanged(false);
          // controller.reset();
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("addressee")}
      />
      <ScrollView style={{ paddingBottom: heightPercentageToDP("5%") }}>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder={Translate.t("addressName")}
            placeholderTextColor={Colors.D7CCA6}
            style={styles.textInput}
            value={buildingName}
            onChangeText={(text) => onBuildingNameChanged(text)}
          ></TextInput>
          <TextInput
            placeholder={Translate.t("nameOfSeller")}
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
                  onAddChanged(address.city + " " + address.area);
                }
              });
            }}
          ></TextInput>
          <DropDownPicker
            // controller={(instance) => (controller = instance)}
            style={styles.textInput}
            items={prefectures ? prefectures : []}
            defaultValue={prefecture ? prefecture : ""}
            containerStyle={{ height: heightPercentageToDP("8%") }}
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
            value={address2}
            onChangeText={(text) => onAddress2Changed(text)}
          ></TextInput>
          <TextInput
            keyboardType={"numeric"}
            placeholder={Translate.t("profileEditPhoneNumber")}
            placeholderTextColor={Colors.D7CCA6}
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={(text) => handlePhone(text)}
          ></TextInput>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if (props.route.params && props.route.params.url) {
              data = {
                address1: add,
                address_name: buildingName,
                name: name,
                prefecture: prefecture,
                tel: phoneNumber,
                zip1: zipcode,
              };
              if (address2) data["address2"] = address2;
              request
                .patch(
                  props.route.params.url.replace(
                    "addresses",
                    "insertAddresses"
                  ),
                  data
                )
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
                    alert.warning("3");
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
                data = {
                  address1: add,
                  address_name: buildingName,
                  name: name,
                  prefecture: prefecture,
                  tel: phoneNumber,
                  user: url,
                  zip1: zipcode,
                };
                if (address2) data["address2"] = address2;
                request
                  .post("insertAddresses/", data)
                  .then(function (response) {
                    // onNameChanged("");
                    // onZipcodeChanged("");
                    // onPrefectureChanged(null);
                    // onAddChanged("");
                    // onBuildingNameChanged("");
                    // onPhoneNumberChanged("");
                    // onPrefecturesChanged([]);
                    // onPrefectureLoadedChanged(false);
                    props.navigation.pop();
                  })
                  .catch(function (error) {
                    if (
                      error &&
                      error.response &&
                      error.response.data &&
                      Object.keys(error.response.data).length > 0
                    ) {
                      let tmpErrorMessage =
                        error.response.data[
                          Object.keys(error.response.data)[0]
                        ][0] +
                        "(" +
                        Object.keys(error.response.data)[0] +
                        ")";
                      // alert.warning(tmpErrorMessage);
                      let errorMessage = String(
                        tmpErrorMessage.split("(").pop()
                      );
                      alert.warning(Translate.t("(" + errorMessage));
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
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "transparent",
    borderRadius: 0,
    fontSize: RFValue(10),
    height: heightPercentageToDP("5.8%"),
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
    marginBottom: heightPercentageToDP("5%"),
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
