import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioRemove = win.width / 20 / 16;
const ratioAdd = win.width / 21 / 14;
let type;
function processAddressHtml(props, addresses, status = "") {
  alert.warning(JSON.stringify(addresses));
  let tmpAddresses = [];
  for (var i = 0; i < addresses.length; i++) {
    let address = addresses[i];
    tmpAddresses.push(
      <TouchableWithoutFeedback key={i}>
        <View style={styles.tabContainer}>
          <Text style={{ fontSize: RFValue(12) }}>{address.name}</Text>
          <Text style={styles.textInTabContainer}>{address.zip1}</Text>
          <Text style={styles.textInTabContainer}>{address.address1}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: RFValue(12),
                marginTop: heightPercentageToDP(".5%"),
              }}
            >
              {address.prefecture.name}
            </Text>
            <View
              style={{
                flexDirection: "row-reverse",
                position: "absolute",
                right: 0,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate("AdressManagement", {
                    url: address.url,
                  });
                }}
              >
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>{Translate.t("edit")}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  request
                    .delete(address.url)
                    .then(function (response) {
                      load();
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
                }}
              >
                <Image
                  style={styles.removeIcon}
                  source={require("../assets/Images/removeIcon.png")}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return tmpAddresses;
}
export default function ShippingList(props) {
  const [addresses, onAddressesChanged] = React.useState([]);
  const [addressHtml, onAddressHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  function setDefaultAddress(url) {
    AsyncStorage.setItem("defaultAddress", url).then(function () {
      props.navigation.pop();
    });
  }
  type = props.route.params.type;
  function load() {
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      request
        .get("addressList/" + userId + "/")
        .then((response) => {
          onAddressesChanged(response.data.addresses);

          let tmpAddresses = [];
          for (var i = 0; i < response.data.addresses.length; i++) {
            let address = response.data.addresses[i];
            tmpAddresses.push(
              <TouchableWithoutFeedback
                disabled={type == "cart" ? false : true}
                key={i}
                onPress={() => setDefaultAddress(address.url)}
              >
                <View style={styles.tabContainer}>
                  <Text style={{ fontSize: RFValue(12) }}>{address.name}</Text>
                  <Text style={styles.textInTabContainer}>{address.zip1}</Text>
                  <Text style={styles.textInTabContainer}>
                    {address.address1}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        marginTop: heightPercentageToDP(".5%"),
                      }}
                    >
                      {address.prefecture.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => {
                          props.navigation.navigate("AdressManagement", {
                            url: address.url,
                          });
                        }}
                      >
                        <View style={styles.buttonContainer}>
                          <Text style={styles.buttonText}>
                            {Translate.t("edit")}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          Alert.alert(
                            Translate.t("warning"),
                            Translate.t("removeAddress"),
                            [
                              {
                                text: "YES",
                                onPress: () => {
                                  request
                                    .delete(address.url)
                                    .then(function (response) {
                                      AsyncStorage.getItem("defaultAddress").then((url) => {
                                        if(url == address.url){
                                          AsyncStorage.removeItem("defaultAddress").then(()=>{
                                            load();
                                          })
                                        } else {
                                          load();
                                        }
                                      });
                                    })
                                    .catch(function (error) {
                                      if (
                                        error &&
                                        error.response &&
                                        error.response.data &&
                                        Object.keys(error.response.data)
                                          .length > 0
                                      ) {
                                        alert.warning(
                                          error.response.data[
                                            Object.keys(error.response.data)[0]
                                          ][0] +
                                            "(" +
                                            Object.keys(
                                              error.response.data
                                            )[0] +
                                            ")"
                                        );
                                      }
                                    });
                                },
                              },
                              {
                                text: "NO",
                                onPress: () => {},
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        <Image
                          style={styles.removeIcon}
                          source={require("../assets/Images/removeIcon.png")}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          }
          onAddressHtmlChanged(tmpAddresses);
        })
        .catch((error) => {
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
  const isFocused = useIsFocused();
  React.useEffect(() => {
    load();
  }, [isFocused]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text={Translate.t("addressee")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
      <ScrollView>
        <View style={styles.allTabsContainer}>
          {addressHtml}
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate("AdressManagement");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: widthPercentageToDP("5%"),
                marginTop: heightPercentageToDP("2%"),
              }}
            >
              <Image
                style={{ width: win.width / 21, height: 14 * ratioAdd }}
                source={require("../assets/Images/addAddressIcon.png")}
              />

              <Text
                style={{
                  fontSize: RFValue(12),
                  marginLeft: widthPercentageToDP("2%"),
                }}
              >
                {Translate.t("registerNewAddress")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInTabContainer: {
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP(".5%"),
  },
  allTabsContainer: {
    // backgroundColor: "orange",
    marginTop: heightPercentageToDP("5%"),
    marginHorizontal: widthPercentageToDP("5%"),
  },
  firstTabContainer: {
    backgroundColor: Colors.F0EEE9,
    padding: widthPercentageToDP("3%"),
  },
  tabContainer: {
    backgroundColor: Colors.F0EEE9,
    padding: widthPercentageToDP("3%"),
    marginTop: heightPercentageToDP("1%"),
  },
  buttonContainer: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.deepGrey,
    justifyContent: "center",
    alignItems: "center",
    width: widthPercentageToDP("13%"),
    padding: widthPercentageToDP(".5%"),
  },
  buttonText: {
    fontSize: RFValue(12),
    color: "white",
  },
  removeIcon: {
    width: win.width / 20,
    height: 19 * ratioRemove,
    marginRight: widthPercentageToDP("3%"),
  },
});
