import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import DropDownPicker from "react-native-dropdown-picker";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
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
import { useIsFocused } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const request = new Request();
const alert = new CustomAlert();
import postal_code from "japan-postal-code-oasis";
import { call } from "react-native-reanimated";
const win = Dimensions.get("window");
const ratioSearchIcon = win.width / 16 / 19;
let countries = [];
export default function AddressManagement(props) {
  const [prefectures, onPrefecturesChanged] = useStateIfMounted([]);
  const [prefectureLoaded, onPrefectureLoadedChanged] = useStateIfMounted(false);
  const [address, onAddressChanged] = useStateIfMounted({});
  const [address2, onAddress2Changed] = useStateIfMounted("");
  const [name, onNameChanged] = useStateIfMounted("");
  const [zipcode, onZipcodeChanged] = useStateIfMounted("");
  const [prefecture, onPrefectureChanged] = useStateIfMounted("");
  const [add, onAddChanged] = useStateIfMounted("");
  const [buildingName, onBuildingNameChanged] = useStateIfMounted("");
  const [phoneNumber, onPhoneNumberChanged] = useStateIfMounted("");
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
  const [selectedValue, setSelectedValue] = useStateIfMounted([]);
  const [countryHtml, setCountryHtml] = useStateIfMounted(<View></View>);
  const [searchText, setSearchText] = useStateIfMounted("");
  const [showCountry, onShowCountryChanged] = useStateIfMounted(false);
  const [countryCode, setCountryCode] = useStateIfMounted("");
  let controller;
  const isFocused = useIsFocused();
  const BUTTON_SIZE = 40;
  function handlePhone(value) {
    onPhoneNumberChanged(value.replace(/[^0-9]/g, ""));
  }

  function componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("selectedCountry").then((val) => {
        if (val) {
          setCountryCode(val);
          onCallingCodeChanged(val);
          AsyncStorage.removeItem("selectedCountry");
        } else {
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
            processCountryCode(country.tel_code)
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
  React.useEffect(() => {
    onNameChanged("");
    onZipcodeChanged("");
    onPrefectureChanged("");
    onAddChanged("");
    onBuildingNameChanged("");
    onPhoneNumberChanged("");
    onAddress2Changed("");
    onCallingCodeChanged("81");
    setCountryCode("+81");
    // onCountryChanged("")
    setSelectedValue("");
    // onPrefecturesChanged([]);
    onPrefectureLoadedChanged(false);

    InteractionManager.runAfterInteractions(() => {
    postal_code.configure(
      "https://kinujo.s3-ap-southeast-1.amazonaws.com/zip/"
    );

    request.get("country_codes/").then(function (response) {
      let tmpCountry = response.data.map((country) => {
        // console.log(country);
        return {
          id: country.tel_code,
          name: country.tel_code,
        };
      });
      tmpCountry.push({
        id: "",
        name: "",
      });
      onCountryCodeHtmlChanged(tmpCountry);
    });

    if (!isFocused) {
    }
    request.get("country_codes/").then(function (response) {
      let tmpCountry = response.data.map((country) => {
        // console.log(country);
        return {
          id: country.tel_code,
          name: country.tel_code,
        };
      });
      onCountryCodeHtmlChanged(tmpCountry);
    });
    request
      .get("prefectures/")
      .then(function (response) {
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
        if (props.route.params && props.route.params.url) {
          request
            .get(props.route.params.url)
            .then(function (response) {
              console.log(response.data);
              onAddressChanged(response.data);
              onNameChanged(response.data.name);
              onZipcodeChanged(response.data.zip1);
              onPrefectureChanged(response.data.prefecture);
              onAddChanged(response.data.address1);
              onAddress2Changed(response.data.address2);
              onBuildingNameChanged(response.data.address_name);
              onPhoneNumberChanged(response.data.tel);
              setSelectedValue("+" + response.data.tel_code);
              onCallingCodeChanged(response.data.tel_code);
              setCountryCode("+" + response.data.tel_code.replace("+", ""));
            })
            .catch(function (error) {
              if (
                error &&
                error.response &&
                error.response.data &&
                Object.keys(error.response.data).length > 0
              ) {
                // alert.warning("1");
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
          // alert.warning("2");
          alert.warning(
            error.response.data[Object.keys(error.response.data)[0]][0] +
              "(" +
              Object.keys(error.response.data)[0] +
              ")"
          );
        }
      });
    });
  }, [isFocused]);

  function handlePostalCode(value) {
    onZipcodeChanged(value.replace(/[^0-9]/g, ""));
    postal_code(value).then((address) => {
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
  }
  function processCountryCode(val) {
    let tmpItem = val.split("+");

    onCallingCodeChanged(tmpItem[1]);
    console.log(tmpItem[1]);
  }
  function closePressed() {
    onShowCountryChanged(false);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          // props.navigation.setParams({ url: "" });
          props.navigation.goBack();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("addressee")}
      />
      <Modal visible={showCountry}>
        <TouchableOpacity onPress={closePressed} style={[styles.button,{backgroundColor: 'white',borderColor: 'white'}]}>
          <Icon name={'close'} color={'black'} size={BUTTON_SIZE} />
        </TouchableOpacity>
        <SafeAreaView>
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
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 135, android: 80 })}
      >
        <ScrollView
          style={{ paddingBottom: heightPercentageToDP("5%") }}
          keyboardShouldPersistTaps="always"
        >
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
                handlePostalCode(text);
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
            <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
              {/* <CountrySearch
                // props={props}
                // defaultCountry={"+" + callingCode}
                // onCountryChanged={(val) => {
                //   if (val) {
                //     processCountryCode(val);
                //   }
                // }}

              ></CountrySearch> */}
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
                    marginRight: widthPercentageToDP("1%"),
                    backgroundColor: "white"
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
              <TextInput
                keyboardType={"numeric"}
                placeholder={Translate.t("profileEditPhoneNumber")}
                placeholderTextColor={Colors.D7CCA6}
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={(text) => handlePhone(text)}
              ></TextInput>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              if (props.route.params && props.route.params.url) {
                data = {
                  address1: add,
                  address2: address2 ? address2 : "",
                  address_name: buildingName,
                  name: name,
                  prefecture: prefecture,
                  tel: phoneNumber,
                  zip1: zipcode,
                  tel_code: "+" + callingCode,
                };
                // if (address2) data["address2"] = address2;
                if (callingCode && phoneNumber) {
                  request
                    .patch(
                      props.route.params.url.replace(
                        "addresses",
                        "insertAddresses"
                      ),
                      data
                    )
                    .then(function (response) {
                      props.navigation.goBack();
                    })
                    .catch(function (error) {
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        // alert.warning("3");
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
                } else if (callingCode == "") {
                  alert.warning(Translate.t("callingCode"));
                } else if (phoneNumber == "") {
                  alert.warning(Translate.t("(tel)"));
                }
              } else {
                AsyncStorage.getItem("user").then(function (url) {
                  console.log(callingCode + phoneNumber);
                  data = {
                    address1: add,
                    address_name: buildingName,
                    name: name,
                    prefecture: prefecture,
                    tel: phoneNumber,
                    user: url,
                    zip1: zipcode,
                    address2: address2,
                    tel_code: "+" + callingCode,
                  };
                  if (callingCode && phoneNumber) {
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
                        props.navigation.goBack();
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
                        } else if (callingCode == "") {
                          alert.warning(Translate.t("callingCode"));
                        }
                      });
                  } else if (callingCode == "") {
                    alert.warning(Translate.t("callingCode"));
                  } else if (phoneNumber == "") {
                    alert.warning(Translate.t("(tel)"));
                  }
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    flex: 1,
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
