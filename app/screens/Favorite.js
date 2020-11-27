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
  ScrollView
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import HomeProducts from "./HomeProducts";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
import Format from "../lib/format";
const format = new Format();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

function processFavouriteHtml(props, user, products) {
  let tmpProductHtml = [];
  products.map((product) => {
    let images = product.productImages.filter((image) => {
      return image.is_hidden == 0 && image.image.is_hidden == 0;
    });

    tmpProductHtml.push(
      <HomeProducts
        key={product.id}
        product_id={product.id}
        onPress={() => {
          props.navigation.navigate("HomeStoreList", {
            url: product.url,
          });
        }}
        idx={product.id}
        image={
          images.length > 0
            ? images[0].image.image
            : "https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg"
        }
        office={product.brand_name}
        name={product.name}
        seller={product.user.shop_name}
        price={
          (user.is_seller
            ? format.separator(product.store_price)
            : format.separator(product.price)) + " 円"
        }
        category={product.category.name}
        shipping={
          product.shipping_fee
            ? "Shipping: " + format.separator(product.shipping_fee) + "円"
            : "Free Shipping"
        }
      />
    );
  });
  return tmpProductHtml;
}

export default function Favorite(props) {
  const [favouriteHtml, onFavouriteHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const [user, onUserChanged] = React.useState({});

  const isFocused = useIsFocused();
  React.useEffect(()=>{
    AsyncStorage.getItem("user").then(function(url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
  
      request
        .get(url)
        .then(function (response) {
          let tmpUser = response.data;
          onUserChanged(response.data);

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
                  processFavouriteHtml(props, tmpUser, response.data.products)
                );
              })
              .catch(function(error) {
                if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
                  alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
                }
              });
          });
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
  }, [isFocused])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text="お気に入り"
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
        onBack={() => props.navigation.pop()}
      />
      <ScrollView style={styles.home_product_view}>
        <View style={styles.section_product}>{favouriteHtml}</View>
      </ScrollView>
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
  home_product_view: {
    height: height - 48 - heightPercentageToDP("17%"),
    padding: 15,
    paddingTop: 0,
    backgroundColor: "#FFF",
    overflow: "scroll",
  },
  section_product: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});
