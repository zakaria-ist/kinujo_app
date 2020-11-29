import React from "react";
import {
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  BackHandler,
} from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import CustomFloatingButton from "../assets/CustomComponents/CustomFloatingButton";
import HomeProducts from "./HomeProducts";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { useIsFocused } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../assets/Colors";
import Format from "../lib/format";
import firebase from "firebase/app";
import { firebaseConfig } from "../../firebaseConfig.js";
import {NavigationActions} from 'react-navigation';   
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const format = new Format();
const db = firebase.firestore();
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const win = Dimensions.get("window");

export default function Home(props) {
  const [favoriteText, showFavoriteText] = React.useState(false);
  const [user, onUserChanged] = React.useState({});
  const [featuredHtml, onFeaturedHtmlChanged] = React.useState([]);
  const [kinujoHtml, onKinujoHtmlChanged] = React.useState([]);
  const isFocused = useIsFocused();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const deviceToken = await messaging().getToken();
      db.collection("users")
        .doc(String(user.id))
        .collection("token")
        .doc(deviceToken)
        .set({
          tokenID: deviceToken,
        });
    }
  }

  React.useEffect(() => {
    onFeaturedHtmlChanged([]);
    onKinujoHtmlChanged([]);
    requestUserPermission();
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
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

    request
      .get("products/")
      .then(function (response) {
        let products = response.data;
        products = products.sort((p1, p2) => {
          if (p1.created > p2.created) {
            return -1;
          }
          return 1;
        });

        products = products.filter((product) => {
          let date = new Date(product.is_opened);
          return (
            product.is_opened == 1 &&
            new Date() > date &&
            product.is_hidden == 0 &&
            product.is_draft == 0
          );
        });

        let kinujoProducts = products.filter((product) => {
          return product.user.authority.id == 1;
        });
        let featuredProducts = products.filter((product) => {
          return product.user.authority.id != 1;
        });

        let tmpKinujoHtml = [];
        kinujoProducts.map((product) => {
          let images = product.productImages.filter((image) => {
            return image.is_hidden == 0 && image.image.is_hidden == 0;
          });

          tmpKinujoHtml.push(
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
                  : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
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

        onKinujoHtmlChanged(tmpKinujoHtml);

        let tmpFeaturedHtml = [];
        featuredProducts.map((product) => {
          // console.log(product.name);
          let images = product.productImages.filter((image) => {
            return image.is_hidden == 0 && image.image.is_hidden == 0;
          });

          tmpFeaturedHtml.push(
            <HomeProducts
              key={product.id}
              product_id={product.category}
              onPress={() => {
                props.navigation.navigate("HomeStoreList", {
                  url: product.url,
                });
              }}
              idx={product.id}
              image={
                images.length > 0
                  ? images[0].image.image
                  : "https://lovemychinchilla.com/wp-content/themes/shakey/assets/images/default-shakey-large-thumbnail.jpg"
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
                  : Translate.t("freeShipping")
              }
            />
          );
        });
        onFeaturedHtmlChanged(tmpFeaturedHtml);
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
  }, [isFocused]);

  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />

      <CustomSecondaryHeader
        name={user.nickname}
        accountType={
          user.is_seller && user.is_master ? Translate.t("storeAccount") : ""
        }
      />
      <View style={styles.discription_header}>
        <View>
          {/* <Text style={styles.disc_title_text}>
            {"Seller: KINUJO Offical Product"}
          </Text> */}
        </View>
        <View style={{ position: "absolute", right: 0, paddingRight: 15 }}>
          <Button title={Translate.t("category")} color="#E6DADE" />
        </View>
      </View>

      <ScrollView style={styles.home_product_view}>
        {kinujoHtml.length > 0 ? (
          <View style={styles.section_header}>
            <Text style={styles.section_header_text}>
              {"KINUJO official product"}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
        {kinujoHtml.length > 0 ? (
          <View style={styles.section_product}>{kinujoHtml}</View>
        ) : (
          <View></View>
        )}

        {featuredHtml.length > 0 ? (
          <View style={styles.section_header}>
            <Text style={styles.section_header_text}>
              {Translate.t("featuredProduct")}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
        {featuredHtml.length > 0 ? (
          <View style={styles.section_product}>{featuredHtml}</View>
        ) : (
          <View></View>
        )}
      </ScrollView>
      <CustomFloatingButton
        onPress={() => {
          props.navigation.navigate("SearchProducts");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  discription_header: {
    minHeight: heightPercentageToDP("6%"),
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "#FFF",
  },
  disc_title_text: {
    paddingLeft: 15,
    fontSize: RFValue(14),
  },
  disc_button_group: {
    width: 100,
    flexDirection: "row-reverse",
  },
  home_product_view: {
    // paddingBottom: heightPercentageToDP("15%"),
    height: heightPercentageToDP("82%"),
    padding: 15,
    paddingTop: 0,
    backgroundColor: "#FFF",
    overflow: "scroll",
    // backgroundColor: "orange",
  },
  section_header: {
    width: "100%",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  section_header_text: {
    borderBottomColor: "black",
    fontSize: RFValue(14),
    paddingBottom: 5,
  },
  section_product: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});
