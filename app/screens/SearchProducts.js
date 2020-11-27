import React, { useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import { Colors } from "../assets/Colors";
import HomeProducts from "./HomeProducts";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";

import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import Format from "../lib/format";
const format = new Format();

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const ratioSearchIcon = win.width / 19 / 19;
const ratioProfile = win.width / 13 / 22;

export default function SearchProducts(props) {
  const [user, onUserChanged] = React.useState({});
  const [featuredHtml, onFeaturedHtmlChanged] = React.useState([]);
  const [products, onProductsChanged] = React.useState([]);
  const [kinujoHtml, onKinujoHtmlChanged] = React.useState([]);
  const [searchTerm, onSearchTermChanged] = React.useState([]);

  function performProductHtml(products) {
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
          seller={
            product.user.real_name
              ? product.user.real_name
              : product.user.nickname
          }
          price={
            (user.is_seller
              ? format.separator(product.store_price)
              : format.separator(product.price)) + " 円"
          }
          category={product.category.name}
          shipping={
            product.shipping_fee
              ? "Shipping :" + format.separator(product.shipping_fee) + "円"
              : "Free Shipping"
          }
        />
      );
    });
    onKinujoHtmlChanged(tmpKinujoHtml);

    let tmpFeaturedHtml = [];
    featuredProducts.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });

      tmpFeaturedHtml.push(
        <HomeProducts
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
          seller={
            product.user.real_name
              ? product.user.real_name
              : product.user.nickname
          }
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
    onFeaturedHtmlChanged(tmpFeaturedHtml);
  }
  React.useEffect(() => {
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
        onProductsChanged(products);
        performProductHtml(products);
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
  }, [useIsFocused]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }}
        text={Translate.t("searchProduct")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => props.navigation.navigate("Cart")}
      />
      <View style={{ marginHorizontal: widthPercentageToDP("4%") }}>
        <View style={styles.searchInputContainer}>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate("ContactSearch")}
          >
            <TextInput
              placeholder={Translate.t("search")}
              placeholderTextColor={Colors.grey}
              style={styles.searchContactInput}
              value={searchTerm}
              onChangeText={(value) => {
                onSearchTermChanged(value);
                let tmpProducts = products.filter((product) => {
                  return (
                    JSON.stringify(product)
                      .toLowerCase()
                      .indexOf(value.toLowerCase()) >= 0
                  );
                });
                performProductHtml(tmpProducts);
              }}
            ></TextInput>
          </TouchableWithoutFeedback>
          <Image
            style={styles.searchIcon}
            source={require("../assets/Images/searchIcon.png")}
          />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contactTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingBottom: heightPercentageToDP("2%"),
  },
  tabRightContainer: {
    flexDirection: "row-reverse",
    position: "absolute",
    right: 0,
    justifyContent: "flex-end",
    width: widthPercentageToDP("18%"),
    alignItems: "center",
  },
  tabLeftText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("5%"),
  },
  tabRightText: {
    fontSize: RFValue(12),
    marginRight: widthPercentageToDP("5%"),
  },
  searchContactInput: {
    height: heightPercentageToDP("10%"),
    fontSize: RFValue(9),
    paddingLeft: widthPercentageToDP("5%"),
    flex: 1,
  },
  searchIcon: {
    width: win.width / 19,
    height: 19 * ratioSearchIcon,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("5%"),
  },
  searchInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: Colors.F6F6F6,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: win.width / 2,
    height: heightPercentageToDP("5.8%"),
  },
  none: {
    display: "none",
  },
  popUp: {
    position: "absolute",
    zIndex: 1,
    borderWidth: 1,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: heightPercentageToDP("15%"),
    borderColor: Colors.D7CCA6,
    alignItems: "flex-start",
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("25%"),
  },
  home_product_view: {
    height: height - 48 - heightPercentageToDP("17%"),
    padding: 15,
    paddingTop: 0,
    marginTop: 15,
    backgroundColor: "#FFF",
    overflow: "scroll",
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
