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
} from "react-native";
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

function processAddressHtml(addresses) {
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
              <TouchableOpacity>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>編集</Text>
                </View>
              </TouchableOpacity>
              <Image
                style={styles.removeIcon}
                source={require("../assets/Images/removeIcon.png")}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return tmpAddresses;
}

export default function ShippingList(props) {
  const [addresses, onAddressesChanged] = React.useState({});
  const [addressHtml, onAddressHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  function load(){
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      if (!loaded) {
        request
          .get("addressList/" + userId + "/")
          .then(function (response) {
            onAddressesChanged(response.data.addresses);
            onAddressHtmlChanged(
              processAddressHtml(props, response.data.addresses, status)
            );
            onLoaded(true);
          })
          .catch(function (error) {
            if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
              alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
            }
            onLoaded(true);
          });
      }
    });
  }
  function processAddressHtml(props, addresses) {
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
                <TouchableWithoutFeedback onPress = {
                  () => {
                    props.navigation.navigate("AdressManagement", {
                      "url" : address.url
                    })
                  }
                }>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>編集</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress = {
                  () => {
                    request
                    .delete(address.url)
                    .then(function (response) {
                      load();
                    })
                    .catch(function (error) {
                      if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                        alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
                      }
                    });
                  }
                }>
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
  load();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="お届け先"
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => props.navigation.navigate("Cart")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
      />
      <View style={styles.allTabsContainer}>
        {addressHtml}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: heightPercentageToDP("2%"),
          }}
        >
          <Image
            style={{ width: win.width / 21, height: 14 * ratioAdd }}
            source={require("../assets/Images/addAddressIcon.png")}
          />
          <TouchableWithoutFeedback onPress={
            () => {
              props.navigation.navigate("AdressManagement")
            }
          }>
            <Text
              style={{
                fontSize: RFValue(12),
                marginLeft: widthPercentageToDP("1%"),
              }}
            >
              新しい送付先を登録
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInTabContainer: {
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP(".5%"),
  },
  allTabsContainer: {
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
