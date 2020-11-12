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
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function processFavouriteHtml(props, products) {
  let tmpProductHtml = [];
  products.map((product) => {
    tmpProductHtml.push(
      <TouchableWithoutFeedback
        key={product.id}
        onPress={() => {
          props.navigation.navigate("HomeProducts", {
            url: product.url,
          });
        }}
      >
        <View style={styles.firstTabContainer}>
          <Image
            style={{
              width: RFValue(40),
              height: RFValue(40),
              borderRadius: win.width / 2,
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.tabContainerText}>{product.name}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  });
  return tmpProductHtml;
}

export default function Favorite(props) {
  const [favouriteHtml, onFavouriteHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);

  AsyncStorage.getItem("user").then(function(url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    let userId = urls[urls.length - 1];
    if (!loaded) {
      db.collection("users")
        .doc(userId)
        .collection("favourite")
        .get()
        .then((querySnapshot) => {
          let ids = [];
          querySnapshot.forEach((documentSnapshot) => {
            ids.push(documentSnapshot.id);
          });
          request
            .get("product/byIds/", {
              ids: ids,
            })
            .then(function(response) {
              onFavouriteHtmlChanged(
                processFavouriteHtml(props, response.data.products)
              );
              onLoaded(true);
            })
            .catch(function(error) {
              if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
              }
              onLoaded(true);
            });
        });
    }
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="お気に入り"
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("3%") }}>
        {favouriteHtml}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginLeft: widthPercentageToDP("5%"),
    justifyContent: "center",
  },
  firstTabContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("1%"),
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.F0EEE9,
    paddingVertical: heightPercentageToDP("1%"),
  },
  tabContainerText: {
    fontSize: RFValue(12),
  },
  dateText: {
    position: "absolute",
    right: 0,
    fontSize: RFValue(12),
    alignSelf: "center",
  },
});
