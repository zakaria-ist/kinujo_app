import React, { useRef } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
  Platform,
  Modal,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Share from "react-native-share";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from "react-native-paper";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../assets/Colors";
import { useIsFocused } from "@react-navigation/native";
import ArrowUpIcon from "../assets/icons/arrow_up.svg";
import SplashScreen from 'react-native-splash-screen'
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import CartFloating from "../assets/CustomComponents/CartFloating";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
import Format from "../lib/format";
import Translate from "../assets/Translates/Translate";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { method } from "lodash";
const format = new Format();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const win = Dimensions.get("window");
const ratioCancelIcon = win.width / 20 / 15;
const cartItems = [];

let janCodes = {};
let janCodeNames = {};

export default function HomeStoreList(props) {
  const [name, setName] = useStateIfMounted("");
  const [favourite, setFavourite] = useStateIfMounted(false);
  const [user, onUserChanged] = useStateIfMounted({});
  const [userAuthorityID, onUserAuthorityIDChanged] = useStateIfMounted(0);
  const [product, onProductChanged] = useStateIfMounted({});
  const [selectedJanCode, onSelectedJanCodeChanged] = useStateIfMounted(null);
  const [selectedName, onSelectedNameChanged] = useStateIfMounted("");
  const [images, onImagesChanged] = useStateIfMounted([]);
  const [show, onShowChanged] = useStateIfMounted({});
  const [showText, onShowText] = useStateIfMounted(false);
  const [time, setTimePassed] = useStateIfMounted(false);
  const [XsShow, onXsShow] = useStateIfMounted(true);
  const [sShow, onSShow] = useStateIfMounted(true);
  const [quantity, onQuantityChanged] = useStateIfMounted(1);
  const [mShow, onMShow] = useStateIfMounted(true);
  const [popupHtml, onPopupHtmlChanged] = useStateIfMounted([]);
  const [cartCount, onCartCountChanged] = useStateIfMounted(0);
  // const [userAuthorityId, setUserAuthorityId] = useStateIfMounted(0);
  const [paymentMethodShow, onPaymentMethodShow] = useStateIfMounted(true);
  const XSOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const sOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const mOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const isFocused = useIsFocused();

  async function share(productId) {
    let url = await AsyncStorage.getItem("user");
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    let userId = urls[urls.length - 1];

    const link = await dynamicLinks().buildLink(
      {
        link:
          "https://kinujo-link.c2sg.asia?userId=" +
          userId +
          "&store=0&product_id=" +
          productId,
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: "https://kinujo-link.c2sg.asia",
        android: {
          packageName: "net.c2sg.kinujo",
        },
        ios: {
          appStoreId: "123123123",
          bundleId: "net.c2sg.kinujo",
        },
      },
      dynamicLinks.ShortLinkType.UNGUESSABLE
    );
    const shareOptions = {
      title: "",
      message: link + "&kinujoId=" + userId,
    };
    Share.open(shareOptions)
      .then((res) => {})
      .catch((err) => {});
  }

  function populatePopupList(
    props,
    tmpProduct,
    tmpJanCodes,
    selected,
    name = ""
  ) {
    let tmpHtml = [];
    Object.keys(tmpJanCodes).map((key, index) => {
      let tmpJanCode =
        tmpProduct.variety == 2 ? tmpJanCodes[key] : tmpJanCodes[key]["none"];
      if (!tmpJanCode.is_hidden) {
        tmpHtml.push(
          <View key={key} style={styles.variationTabs}>
            <RadioButton.Android
              status={selected === tmpJanCode.id ? "checked" : "unchecked"}
              onPress={() => {
                onSelectedJanCodeChanged(tmpJanCode.id);
                if (tmpProduct.variety == 2) {
                  onSelectedNameChanged(name + " x " + key);
                } else {
                  onSelectedNameChanged(key);
                }
                onPopupHtmlChanged(
                  populatePopupHtml(props, tmpProduct, janCodes, tmpJanCode.id)
                );
              }}
            />
            <Text style={styles.variationTabsText}>{key}</Text>
          </View>
        );
      }
    });
    return tmpHtml;
  }

  function populatePopupHtml(props, tmpProduct, tmpJanCodes, selected) {
    if (tmpProduct.variety == 1) {
      // console.log(tmpJanCodes);
      return populatePopupList(props, tmpProduct, tmpJanCodes, selected);
    } else if (tmpProduct.variety == 0) {
      onSelectedJanCodeChanged(
        tmpJanCodes[Object.keys(tmpJanCodes)[0]]["none"].id
      );
      return [];
    }
    let tmpHtml = [];
    Object.keys(tmpJanCodes).map((key) => {
      tmpHtml.push(
        <View
          key={key}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.C2A059,
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.variationTabs}>
              <Text style={styles.variationTabsText}>{key}</Text>
              <ArrowUpIcon style={styles.widget_icon} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
          {populatePopupList(
            props,
            tmpProduct,
            tmpJanCodes[key],
            selected,
            key
          )}
        </View>
      );
    });
    return tmpHtml;
  }

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      onSelectedJanCodeChanged("")
      for (var i = 1; i < 10; i++) {
        if (
          cartItems.filter((item) => {
            return item.value == i;
          }).length == 0
        ) {
          cartItems.push({
            value: i + "",
            label: i + "",
          });
        }
      }

      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];

        request
          .get(url)
          .then(function (response) {
            onUserChanged(response.data);
            onUserAuthorityIDChanged(response.data.authority.id);
            request
              .get(props.route.params.url.replace("simple_products", "products"))
              .then(function (response) {
                onProductChanged(response.data);

                db.collection("products")
                  .doc(String(response.data.id))
                  .get()
                  .then(function (doc) {
                    if (doc.exists) {
                      db.collection("products")
                        .doc(String(response.data.id))
                        .update({
                          view: firebase.firestore.FieldValue.increment(1),
                        });
                    } else {
                      db.collection("products")
                        .doc(String(response.data.id))
                        .set({
                          view: 1,
                        });
                    }
                  });

                db.collection("users")
                  .doc(userId)
                  .collection("favourite")
                  .doc(response.data.id.toString())
                  .get()
                  .then(function (doc) {
                    if (doc.exists) {
                      setFavourite(true);
                    }
                  });

                let tmpVarieties = [];
                response.data.productVarieties.map((productVariety) => {
                  if (!tmpVarieties.includes(productVariety.name)) {
                    tmpVarieties.push(productVariety.name);
                  }
                  if (!productVariety.is_hidden) {
                    productVariety.productVarietySelections.map(
                      (productVarietySelection) => {
                        if (!productVarietySelection.is_hidden) {
                          janCodeNames[productVarietySelection.url] =
                            productVarietySelection.selection;
                        }
                      }
                    );
                  }
                });

                tmpVariety = tmpVarieties.filter((item) => {
                  return item;
                });
                if (tmpVariety.length > 1) {
                  setName(tmpVariety.join(" x "));
                } else {
                  setName(tmpVariety);
                }
                janCodes = {};
                response.data.productVarieties.map((productVariety) => {
                  if (!productVariety.is_hidden) {
                    productVariety.productVarietySelections.map(
                      (productVarietySelection) => {
                        if (!productVarietySelection.is_hidden) {
                          if (
                            !productVarietySelection.jancode_horizontal.is_hidden
                          ) {
                            productVarietySelection.jancode_horizontal.map(
                              (horizontal) => {
                                if (!horizontal.is_hidden) {
                                  let hoName = horizontal.horizontal
                                    ? janCodeNames[horizontal.horizontal]
                                    : "none";
                                  let veName = horizontal.vertical
                                    ? janCodeNames[horizontal.vertical]
                                    : "none";
                                  if (janCodes[hoName]) {
                                    janCodes[hoName][veName] = {
                                      stock: horizontal.stock,
                                      url: horizontal.url,
                                      id: horizontal.id,
                                      is_hidden: horizontal.is_hidden,
                                    };
                                  } else {
                                    janCodes[hoName] = {};
                                    janCodes[hoName][veName] = {
                                      stock: horizontal.stock,
                                      url: horizontal.url,
                                      id: horizontal.id,
                                      is_hidden: horizontal.is_hidden,
                                    };
                                  }
                                }
                              }
                            );
                          }

                          if (
                            !productVarietySelection.jancode_vertical.is_hidden
                          ) {
                            productVarietySelection.jancode_vertical.map(
                              (vertical) => {
                                if (!vertical.is_hidden) {
                                  let hoName = vertical.horizontal
                                    ? janCodeNames[vertical.horizontal]
                                    : "none";
                                  let veName = vertical.vertical
                                    ? janCodeNames[vertical.vertical]
                                    : "none";
                                  if (janCodes[hoName]) {
                                    janCodes[hoName][veName] = {
                                      stock: vertical.stock,
                                      url: vertical.url,
                                      id: vertical.id,
                                      is_hidden: vertical.is_hidden,
                                    };
                                  } else {
                                    janCodes[hoName] = {};
                                    janCodes[hoName][veName] = {
                                      stock: vertical.stock,
                                      url: vertical.url,
                                      id: vertical.id,
                                      is_hidden: vertical.is_hidden,
                                    };
                                  }
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  }
                });
                onPopupHtmlChanged(
                  populatePopupHtml(props, response.data, janCodes, "")
                );

                if (response.data.productImages.length > 0) {
                  let images = response.data.productImages.filter(
                    (productImage) => {
                      return productImage.is_hidden == 0;
                    }
                  );
                  console.log(images.map((productImage) => {
                    return productImage.image.image;
                  }))
                  onImagesChanged(
                    images.map((productImage) => {
                      return productImage.image.image;
                    })
                  );
                } else {
                  onImagesChanged([
                    "https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg",
                  ]);
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

  function redirectToChat(friendID, friendName) {
    let groupID = null;
    let groupName;
    let deleted = "delete_" + user.id;
    db.collection("chat")
      .where("users", "array-contains", user.id.toString())
      .get()
      .then((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          if (snapShot.doc.data().type != "group") {
            for (var i = 0; i < users.length; i++) {
              if (users[i] == friendID) {
                groupID = snapShot.doc.id;
              }
            }
          }
        });
        if (groupID != null) {
          db.collection("chat")
            .doc(groupID)
            .set(
              {
                [deleted]: false,
              },
              {
                merge: true,
              }
            );
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: friendName,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + user.id;
          let friendMessageUnseenField = "unseenMessageCount_" + friendID;
          let ownTotalMessageReadField = "totalMessageRead_" + user.id;
          let friendTotalMessageReadField = "totalMessageRead_" + friendID;
          db.collection("chat")
            .add({
              groupName: friendName,
              users: [ownUserID, String(friendID)],
              totalMessage: 0,
              [ownMessageUnseenField]: 0,
              [friendMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              [friendTotalMessageReadField]: 0,
            })
            .then(function (docRef) {
              props.navigation.navigate("ChatScreen", {
                groupID: docRef.id,
                groupName: friendName,
              });
            });
        }
      });
  }

  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");
  const [favoriteText, showFavoriteText] = useStateIfMounted(false);
  const ratioFavorite = width / 29 / 12;
  return (
    <SafeAreaView>
      {favoriteText == true ? (
        <View
          style={{
            borderRadius: win.width / 2,
            borderWidth: 1,
            backgroundColor: Colors.E6DADE,
            borderColor: "transparent",
            zIndex: 1,
            elevation: 1,
            position: "absolute",
            right: 0,
            marginRight:
              userAuthorityID <= 3 ? RFValue(5) : widthPercentageToDP("15%"),
            borderStyle: "solid",
            paddingVertical: widthPercentageToDP("1%"),
            paddingHorizontal: widthPercentageToDP("7%"),
            marginTop:
              Platform.OS == "ios"
                ? getStatusBarHeight() + heightPercentageToDP("6.7%")
                : heightPercentageToDP("6.7%"),
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              borderBottomWidth: RFValue(20),
              borderRightWidth: RFValue(12),
              borderLeftWidth: RFValue(12),
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: Colors.E6DADE,
              top: RFValue(-15),
              position: "absolute",
              right: RFValue(9),
            }}
          ></View>
          <Text
            style={{
              fontSize: RFValue(10),
              color: "black",
              alignSelf: "flex-start",
            }}
          >
            {Translate.t("addedToFavorite")}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
      <CustomHeader
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.goBack();
        }}
        onCartCount={(count) => {
          onCartCountChanged(count);
        }}
        overrideCartCount={cartCount}
      />

      <View style={styles.product_content}>
        <ScrollView>
          <View
            style={{
              width: "100%",
              height: width / 1.4 + 100,
            }}
          >
            {/* Need Find Image Slider */}
            <SliderBox
              ImageComponent={FastImage}
              images={images}
              sliderBoxHeight={width / 1.4 + 20}
              parentWidth={width - 30}
              onCurrentImagePressed={(index) =>
                console.warn(`image ${index} pressed`)
              }
              dotColor="#D8CDA7"
              inactiveDotColor="#90A4AE"
              resizeMethod={"resize"}
              resizeMode={"cover"}
              autoplay={true}
              circleLoop={true}
              paginationBoxStyle={{
                position: "absolute",
                bottom: 0,
                padding: 0,
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                marginBottom: -60,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                right: RFValue(5),
                marginBottom: width / RFValue(5) + RFValue(24),
                bottom: 0,
                marginRight: widthPercentageToDP("2.5%"),
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  AsyncStorage.getItem("user").then((url) => {
                    let urls = url.split("/");
                    urls = urls.filter((url) => {
                      return url;
                    });
                    let userId = urls[urls.length - 1];

                    if (favourite) {
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("favourite")
                        .doc(product.id.toString())
                        .delete();

                      setFavourite(false);
                    } else {
                      db.collection("users")
                        .doc(user.id.toString())
                        .collection("favourite")
                        .doc(product.id.toString())
                        .set({
                          status: "added",
                        });
                      showFavoriteText(true);
                      setTimeout(
                        function () {
                          showFavoriteText(false);
                        }.bind(this),
                        2000
                      );
                      setFavourite(true);
                    }
                  });
                }}
              >
                <Image
                  style={{
                    width: width / 12,
                    height: 26 * ratioFavorite,
                    marginRight: widthPercentageToDP("3%"),
                  }}
                  source={
                    favourite
                      ? require("../assets/Images/favoriteLove.png")
                      : require("../assets/Images/productFavorite.png")
                  }
                />
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  share(product.id);
                }}
              >
                <Image
                  style={{ width: RFValue(25), height: RFValue(25), 
                    resizeMode: 'contain' }}
                  source={require("../assets/Images/share.png")}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            <Text style={styles.font_small}>{product.brand_name}</Text>
            <Text style={styles.font_medium}>
              {product ? product.name : ""}
            </Text>
            <TouchableWithoutFeedback onPress={()=>{
              props.navigation.navigate("SellerProductList", {
                sellerName: product.user.shop_name,
              });
            }}>
              <Text style={styles.sellerFont}>
                {Translate.t("seller") +
                  ": " +
                  (product && product.user
                    ? product.user.real_name
                      ? product.user.real_name
                      : product.user.nickname
                    : "")}
              </Text>
            </TouchableWithoutFeedback>
            <Text
              style={[
                styles.font_small,
                {
                  padding: 10,
                },
              ]}
            >
              {product && product.category ? product.category.name : ""}
            </Text>
            <View>
              <Text>
                <Text style={styles.priceFont}>
                  {(user.is_seller && user.is_approved
                    ? format.separator(product.store_price)
                    : format.separator(product.price))}
                </Text>
                <Text style={styles.font_medium}>
                {"円" +
                  Translate.t("taxNotIncluded")}
                </Text>
              </Text>
            </View>
            <Text style={styles.font_small}>
              {product.shipping_fee
                ? Translate.t("shipping") +
                  ": " +
                  format.separator(product.shipping_fee) +
                  "円"
                : Translate.t("freeShipping")}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: 20,
            }}
          >
            <View style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
              <Text style={styles.product_title}>
                {Translate.t("productFeatures")}
              </Text>
              <View style={{flexDirection: "row", flex:1, justifyContent:"flex-end"}}>
                <TouchableWithoutFeedback onPress={()=>{
                  request.addFriend(user.id, product.user.id).then(() => {
                    request.addFriend(product.user.id, user.id).then(() => {
                      redirectToChat(product.user.id, product.user.real_name);
                    });
                  });
                }}>
                    <View style={{backgroundColor:"lightgray", padding:10, marginBottom: 10, borderRadius: 5, color: "white"}}> 
                      <Text style={styles.contact_us}>{Translate.t("contact_us")}</Text>
                    </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.line} />
            <Text style={styles.product_description}>{product.pr}</Text>
          </View>

          <View
            style={{
              // backgroundColor: "orange",
              marginBottom: heightPercentageToDP("30%"),
              width: "100%",
              paddingTop: 20,
            }}
          >
            <Text style={styles.product_title}>
              {Translate.t("productDetails")}
            </Text>
            <View style={styles.line} />
            <Text style={styles.product_description}>
              {product.description}
            </Text>
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={show}
        transparent={true}
        presentationStyle="overFullScreen"
      >
        <ScrollView
          style={{
            backgroundColor: Colors.F0EEE9,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            // zIndex: 1,
            flex: 1,
            marginHorizontal: widthPercentageToDP("10%"),
            marginVertical: heightPercentageToDP("25%"),
            position: "absolute",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: widthPercentageToDP("2%"),
              marginTop: heightPercentageToDP("2%"),
              height: heightPercentageToDP("5%"),
            }}
          >
            <Text style={{ fontSize: RFValue(14) }}>
              {Translate.t("addToCart")}
            </Text>
            <TouchableWithoutFeedback onPress={() => onShowChanged(false)}>
              <Image
                style={{
                  position: "absolute",
                  marginRight: widthPercentageToDP("2%"),
                  right: 0,
                  width: win.width / 20,
                  height: 15 * ratioCancelIcon,
                }}
                source={require("../assets/Images/cancelIcon.png")}
              />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              backgroundColor: Colors.BC9747,
              height: heightPercentageToDP("5%"),
              alignItems: "center",
              marginTop: heightPercentageToDP("2%"),
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12),
                padding: widthPercentageToDP("5%"),
              }}
            >
              {name}
            </Text>
          </View>

          <View>
            <View>
              {popupHtml}
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "orange",
                  flexDirection: "row",
                  marginTop: heightPercentageToDP("3%"),
                  paddingBottom: heightPercentageToDP("35%"),
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      marginLeft: widthPercentageToDP("1.3%"),
                    }}
                  >
                    {Translate.t("unit")}
                  </Text>
                  <DropDownPicker
                    zIndex={999}
                    style={{
                      borderWidth: 1,
                      backgroundColor: "white",
                      borderColor: "transparent",
                      color: "black",
                      borderRadius: 0,
                      fontSize: RFValue(12),
                      marginLeft: widthPercentageToDP("2%"),
                      height: heightPercentageToDP("5.5%"),
                      paddingLeft: widthPercentageToDP("2%"),
                      marginVertical: heightPercentageToDP("1%"),
                    }}
                    items={cartItems}
                    placeholder={quantity}
                    defaultValue={quantity ? quantity + "" : ""}
                    containerStyle={{
                      paddingVertical: 0,
                      width: widthPercentageToDP("25%"),
                    }}
                    labelStyle={{
                      fontSize: RFValue(12),
                      color: "grey",
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    selectedtLabelStyle={{
                      color: Colors.F0EEE9,
                    }}
                    // dropDownMaxHeight={RFValue(36)}
                    dropDownStyle={{
                      marginLeft: widthPercentageToDP("2%"),
                      width: widthPercentageToDP("23%"),
                      height: heightPercentageToDP("30%"),
                      backgroundColor: "#FFFFFF",
                      color: "black",
                      position: "absolute",
                    }}
                    onChangeItem={(item) => {
                      if (item) {
                        onQuantityChanged(item.value);
                      }
                    }}
                  />
                </View>
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if ((selectedJanCode || !name) && quantity) {
                        onShowChanged(false);
                        db.collection("users")
                          .doc(user.id.toString())
                          .collection("carts")
                          .doc(selectedJanCode.toString())
                          .get()
                          .then((snapshot) => {
                            let tmpQuantity = parseInt(quantity);
                            if (snapshot.data()) {
                              tmpQuantity += parseInt(snapshot.data().quantity);
                            }
                            db.collection("users")
                              .doc(user.id.toString())
                              .collection("carts")
                              .doc(selectedJanCode.toString())
                              .set({
                                id: product.id,
                                quantity: tmpQuantity,
                                url: selectedJanCode,
                                name: selectedName,
                              }).then(()=>{
                                const subscriber = db
                                  .collection("users")
                                  .doc(user.id.toString())
                                  .collection("carts")
                                  .get()
                                  .then((querySnapShot) => {
                                    onCartCountChanged(querySnapShot.size + 1);
                                  });
                              })
                          });

                        if(product.variety != 0){
                          onSelectedJanCodeChanged(null);
                        }
                        onShowText(true);
                        setTimeout(
                          function () {
                            onShowText(false);
                          }.bind(this),
                          2000
                        );
                      } else {
                        alert.warning(
                          Translate.t("no_select_jancode")
                        );
                      }
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: Colors.deepGrey,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        paddingVertical: 5,
                        marginHorizontal: widthPercentageToDP("5%"),
                      }}
                    >
                      <Text style={{ fontSize: RFValue(11), color: "white" }}>
                        {Translate.t("addToCartBtn")}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>

      {showText == true ? (
        <View
          style={{
            borderRadius: win.width / 2,
            borderWidth: 1,
            backgroundColor: Colors.E6DADE,
            borderColor: "transparent",
            zIndex: 1,
            elevation: 1,
            position: "absolute",
            right: RFValue(5),
            borderStyle: "solid",
            paddingVertical: widthPercentageToDP("1%"),
            paddingHorizontal: widthPercentageToDP("7%"),
            marginTop:
              Platform.OS == "ios"
                ? getStatusBarHeight() + heightPercentageToDP("6.7%")
                : heightPercentageToDP("6.7%"),
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              borderBottomWidth: RFValue(20),
              borderRightWidth: RFValue(12),
              borderLeftWidth: RFValue(12),
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: Colors.E6DADE,
              top: RFValue(-15),
              position: "absolute",
              right: RFValue(9),
            }}
          ></View>
          <Text
            style={{
              fontSize: RFValue(10),
              color: "black",
              alignSelf: "flex-start",
            }}
          >
            {Translate.t("itemAddedToCart")}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
      {userAuthorityID <= 3 ? (
        <View></View>
      ) : (
        <CartFloating
          onPress={() => {
            onQuantityChanged(1);
            onShowChanged(true);
            // db.collection("users")
            //   .doc(user.id.toString())
            //   .collection("carts")
            //   .doc(product.id.toString())
            //   .set({
            //     quantity: 1,
            //   });
            // onShowText(true);
            // setTimeout(
            //   function () {
            //     onShowText(false);
            //   }.bind(this),
            //   2000
            // );

            // const subscriber = db
            //   .collection("users")
            //   .doc(user.id.toString())
            //   .collection("carts")
            //   .get()
            //   .then((querySnapShot) => {
            //     onCartCountChanged(querySnapShot.docs.length);
            //   });
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  line: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
    width: widthPercentageToDP("94%"),
    marginHorizontal: widthPercentageToDP("-4%"),
  },
  picker: {
    marginLeft: widthPercentageToDP("1%"),
    width: widthPercentageToDP("18%"),
    height: heightPercentageToDP("4%"),
    fontSize: RFValue(12),
    backgroundColor: "white",
    borderColor: "transparent",
  },
  none: {
    display: "none",
  },
  variationTabsText: {
    fontSize: RFValue(12),
  },
  variationTabs: {
    marginHorizontal: widthPercentageToDP("3%"),
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: heightPercentageToDP(".7%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.C2A059,
  },
  widget_icon: {
    position: "absolute",
    right: 0,
    height: RFValue(14),
    width: RFValue(14),
    marginTop: heightPercentageToDP("1%"),
    marginHorizontal: 10,
  },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    margin: 3,
    width: 10,
    height: 10,
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8CDA7",
    borderRadius: window.width / 2,
  },
  buttonSelected: {
    opacity: 1,
    width: 10,
    height: 10,
    backgroundColor: "#BD9848",
    borderRadius: window.width / 2,
  },
  customSlide: {
    width: width - 30,
    height: width / 1.4 + 20,
    backgroundColor: "transparent",
  },
  customImage: {
    width: width - 30,
    height: width / 1.4 - 30,
  },
  product_content: {
    // backgroundColor: "orange",
    height: heightPercentageToDP("100%"),
    overflow: "scroll",
    width: "100%",
    padding: 15,
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  sellerFont: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(14),
    //fontFamily: "sans-serif",
    padding: 2,
    color: "blue"
  },
  priceFont: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(14),
    //fontFamily: "sans-serif",
    padding: 2,
    color: "red"
  },
  font_small: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(10),
    //fontFamily: "sans-serif",
    padding: 2,
  },
  font_medium: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(11),
    //fontFamily: "sans-serif",
    padding: 2,
  },
  product_title: {
    //fontFamily: "sans-serif",
    fontSize: RFValue(13),
    paddingBottom: 5,
    marginBottom: 5,
  },
  contact_us: {
    //fontFamily: "sans-serif",
    fontSize: RFValue(13),
    textAlign: "right",
    alignSelf: "flex-end"
  },
  product_description: {
    overflow: "hidden",
    //fontFamily: "sans-serif",
    textAlign: "justify",
    fontSize: RFValue(11),
  },
});
