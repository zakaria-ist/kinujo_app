import React from "react";
import { InteractionManager } from 'react-native';

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
  Animated,
  Button,
  Platform,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { getStatusBarHeight } from "react-native-status-bar-height";
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
let users;
let featuredProducts = {};
let kinujoProducts = {};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
let taxRate = 0;
const db = firebase.firestore();

export default function Favorite(props) {
  const [favouriteHtml, onFavouriteHtmlChanged] = useStateIfMounted(<View></View>);
  const [featuredHtml, onFeaturedHtmlChanged] = useStateIfMounted(<View></View>);
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const [showCategory, onCategoryShow] = useStateIfMounted(false);
  const rightSorting = React.useRef(
    new Animated.Value(widthPercentageToDP("-80%"))
  ).current;
  const isFocused = useIsFocused();
  function processFeatured(props, user, products) {
    let tmpFeaturedHtml = [];
    products.map((product) => {
      let images = product.productImages.filter((image) => {
        return image.is_hidden == 0 && image.image.is_hidden == 0;
      });

      tmpFeaturedHtml.push(
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
            (user.is_seller && user.is_approved
              ? format.separator(product.store_price + (product.store_price * taxRate))
              : format.separator(product.price + (product.price * taxRate))) + " 円"
          }
          category={product.category.name}
          removeFavourite={(favorite) => {
            if (favorite) {
              featuredProducts = featuredProducts.filter((item) => {
                return item.id != product.id;
              });
              onFeaturedHtmlChanged(
                processFeatured(props, users, featuredProducts)
              );
            }
          }}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : Translate.t("shipping") +
                " : " +
                format.separator(product.shipping_fee) +
                "円"
          }
        />
      );
    });
    return tmpFeaturedHtml;
  }
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
            (user.is_seller && user.is_approved
              ? format.separator(product.store_price + (product.store_price * taxRate))
              : format.separator(product.price + (product.price * taxRate))) + " 円"
          }
          removeFavourite={(favorite) => {
            if (favorite) {
              kinujoProducts = kinujoProducts.filter((item) => {
                return item.id != product.id;
              });
              onFavouriteHtmlChanged(
                processFavouriteHtml(props, users, kinujoProducts)
              );
            }
          }}
          category={product.category.name}
          shipping={
            product.shipping_fee == 0
              ? Translate.t("freeShipping")
              : Translate.t("shipping") +
                " : "
                +format.separator(product.shipping_fee) +
                "円"
          }
        />
      );
    });
    return tmpProductHtml;
  }
  React.useEffect(() => {
    hideSortingAnimation();
  }, [!isFocused]);
  function showSortingAnimation() {
    onCategoryShow(true);
    Animated.timing(rightSorting, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }
  function hideSortingAnimation() {
    onCategoryShow(false),
      Animated.timing(rightSorting, {
        toValue: widthPercentageToDP("-80%"),
        duration: 500,
        useNativeDriver: false,
      }).start();
  }
  function filterProductsBySorting(type) {
    let tmpFeaturedProducts;
    let tmpKinujoProducts;
    if (featuredProducts && kinujoProducts) {
      tmpFeaturedProducts = featuredProducts;
      tmpKinujoProducts = kinujoProducts;
    }
    if (type == "latestFirst") {
      if (tmpFeaturedProducts) {
        tmpFeaturedProducts = featuredProducts.sort((a, b) => {
          let date1 = new Date(a.opened_date);
          let date2 = new Date(b.opened_date);

          if (date1 < date2) {
            return 1;
          }
          if (date1 > date2) {
            return -1;
          }
          return 0;
        });
      }
      tmpKinujoProducts = kinujoProducts.sort((a, b) => {
        let date1 = new Date(a.opened_date);
        let date2 = new Date(b.opened_date);
        if (date1 < date2) {
          return 1;
        }
        if (date1 > date2) {
          return -1;
        }
        return 0;
      });

      onFeaturedHtmlChanged(processFeatured(props, users, tmpFeaturedProducts));
      onFavouriteHtmlChanged(
        processFavouriteHtml(props, users, tmpKinujoProducts)
      );
    }

    if (type == "LowToHigh") {
      if (tmpFeaturedProducts) {
        tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
          return a.store_price - b.store_price;
        });
      }
      if (tmpKinujoProducts) {
        tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
          return a.store_price - b.store_price;
        });
      }

      onFeaturedHtmlChanged(processFeatured(props, users, tmpFeaturedProducts));
      onFavouriteHtmlChanged(
        processFavouriteHtml(props, users, tmpKinujoProducts)
      );
    }
    if (type == "HighToLow") {
      if (tmpFeaturedProducts) {
        tmpFeaturedProducts = tmpFeaturedProducts.sort((a, b) => {
          return b.store_price - a.store_price;
        });
      }
      if (tmpKinujoProducts) {
        tmpKinujoProducts = tmpKinujoProducts.sort((a, b) => {
          return b.store_price - a.store_price;
        });
      }

      onFeaturedHtmlChanged(processFeatured(props, users, tmpFeaturedProducts));
      onFavouriteHtmlChanged(
        processFavouriteHtml(props, users, tmpKinujoProducts)
      );
    }
    hideSortingAnimation();
  }
  React.useEffect(() => {
    // for gst
    request
      .get("tax_rates/")
      .then((response) => {
        let taxes = response.data.filter((item) => {
          let nowDate = new Date();
          if (item.start_date && item.end_date) {
            if (
              nowDate >= new Date(item.start_date) &&
              nowDate <= new Date(item.end_date)
            ) {
              return true;
            }
          } else if (item.start_date) {
            if (nowDate >= new Date(item.start_date)) {
              return true;
            }
          }
          return false;
        });

        if (taxes.length > 0) {
          taxRate = taxes[0].tax_rate;
        }
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
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];

        request
          .get(url)
          .then(function (response) {
            let tmpUser = response.data;
            users = response.data;
            onUserChanged(response.data);

            db.collection("users")
              .doc(userId)
              .collection("favourite")
              .get()
              .then((querySnapshot) => {
                let idsKinujo = [];
                let idsFeatured = [];
                querySnapshot.forEach((documentSnapshot) => {
                  // console.log(documentSnapshot.data().type);
                  if (documentSnapshot.data().type == 1) {
                    idsKinujo.push(documentSnapshot.id);
                  } else {
                    idsFeatured.push(documentSnapshot.id);
                  }
                });
                request
                  .get("product/byIds/", {
                    ids: idsKinujo,
                  })
                  .then(function (response) {
                    kinujoProducts = response.data.products;
                    onFavouriteHtmlChanged(
                      processFavouriteHtml(props, tmpUser, response.data.products)
                    );
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
                request
                  .get("product/byIds/", {
                    ids: idsFeatured,
                  })
                  .then(function (response) {
                    // console.log(response.data.products);
                    featuredProducts = response.data.products;
                    onFeaturedHtmlChanged(
                      processFeatured(props, tmpUser, response.data.products)
                    );
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
    });
  }, [isFocused]);
  return (
    <TouchableWithoutFeedback onPress={() => hideSortingAnimation()}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          text={Translate.t("favorite")}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onPress={() => props.navigation.navigate("Cart")}
          onBack={() => props.navigation.goBack()}
        />
        <View style={styles.discription_header}>
          <TouchableWithoutFeedback onPress={() => showSortingAnimation()}>
            <View
              style={{
                position: "absolute",
                right: 0,
                marginRight: widthPercentageToDP("3%"),
                borderRadius: 5,
                paddingVertical: heightPercentageToDP(".8%"),
                paddingHorizontal: heightPercentageToDP("1%"),
                backgroundColor: Colors.E6DADE,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: "white",
                  textAlign: "center",
                }}
              >
                {Translate.t("sorting")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Animated.View
          style={{
            paddingTop:
              Platform.OS == "ios"
                ? getStatusBarHeight() + heightPercentageToDP("3%")
                : 0,
            zIndex: 1,
            height: heightPercentageToDP("150%"),
            alignSelf: "center",
            width: widthPercentageToDP("80%"),
            position: "absolute",
            right: rightSorting,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderBottomColor: Colors.D7CCA6,
            }}
          >
            <Text style={styles.categoryTitle}>{Translate.t("sorting")}</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("latestFirst")}
          >
            <View style={styles.categoryContainer}>
              <Text>Latest First</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("LowToHigh")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price Low to High</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => filterProductsBySorting("HighToLow")}
          >
            <View style={styles.categoryContainer}>
              <Text>Price High to Low</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => hideSortingAnimation()}>
            <View
              style={{
                position: "absolute",
                bottom: heightPercentageToDP("8%"),
                right: widthPercentageToDP("3%"),
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "white",
                alignItems: "center",
                paddingVertical: heightPercentageToDP(".7%"),
                paddingHorizontal: widthPercentageToDP("2%"),
              }}
            >
              <Text style={{ fontSize: RFValue(12) }}>{"Finish"}</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <ScrollView style={styles.home_product_view}>
          {favouriteHtml.length > 0 ? (
            <View style={styles.section_header}>
              <Text style={styles.section_header_text}>
                {"KINUJO official product"}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          {favouriteHtml.length > 0 ? (
            <View style={styles.section_product}>{favouriteHtml}</View>
          ) : (
            <View></View>
          )}

          {featuredHtml.length > 0 ? (
            <TouchableWithoutFeedback>
              <View style={styles.section_header}>
                <Text style={styles.section_header_text}>
                  {Translate.t("featuredProduct")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
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
    </TouchableWithoutFeedback>
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
    backgroundColor: "transparent",
    overflow: "scroll",
  },
  section_product: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  discription_header: {
    minHeight: heightPercentageToDP("6%"),
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
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
    marginBottom: heightPercentageToDP("15%"),
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  categoryContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1.5%"),
  },
  categoryTitle: {
    alignSelf: "center",
    fontSize: RFValue(14),
    paddingTop: heightPercentageToDP("2%"),
    paddingBottom: heightPercentageToDP("2%"),
  },
});
