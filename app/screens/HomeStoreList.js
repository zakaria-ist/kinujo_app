import React, { useRef } from "react";
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
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../assets/Colors";
import ArrowUpIcon from "../assets/icons/arrow_up.svg";
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
export default function HomeStoreList(props) {
  const [user, onUserChanged] = React.useState({});
  const [product, onProductChanged] = React.useState({});
  const [images, onImagesChanged] = React.useState({});
  const [show, onShowChanged] = React.useState({});
  const [showText, onShowText] = React.useState(false);
  const [time, setTimePassed] = React.useState(false);
  const [XsShow, onXsShow] = React.useState(true);
  const [sShow, onSShow] = React.useState(true);
  const [mShow, onMShow] = React.useState(true);
  const [cartCount, onCartCountChanged] = React.useState(0);
  const [paymentMethodShow, onPaymentMethodShow] = React.useState(true);
  const XSOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const sOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
  const mOpacity = useRef(new Animated.Value(heightPercentageToDP("100%")))
    .current;
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
      .get(props.route.params.url)
      .then(function (response) {
        console.log(response.data)
        onProductChanged(response.data);

        let janCodes = [];
        if(response.data.productVarieties.length > 0){
          
        }

        if (response.data.productImages.length > 0) {
          onImagesChanged(
            response.data.productImages.map((productImage) => {
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
  }, []);

  return (
    <SafeAreaView>
      <CustomHeader
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onCartCount={(count) => {
          onCartCountChanged(count);
        }}
        overrideCartCount={cartCount}
      />
      <View style={styles.product_content}>
        <ScrollView>
          <View style={{ width: "100%", height: width / 1.4 + 100 }}>
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
            <Text style={styles.font_small}>
              {Translate.t("seller") +
                ": " +
                (product && product.user
                  ? product.user.real_name
                    ? product.user.real_name
                    : product.user.nickname
                  : "")}
            </Text>
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
            <Text style={styles.font_medium}>
              {(user.is_seller
                ? format.separator(product.store_price)
                : format.separator(product.price)) +
                "円" +
                Translate.t("taxNotIncluded")}
            </Text>
            <Text style={styles.font_small}>
              {product.shipping_fee
                ? Translate.t("shipping") + ": " + product.shipping_fee
                : Translate.t("freeShipping")}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: 20,
            }}
          >
            <Text style={styles.product_title}>
              {Translate.t("productFeatures")}
            </Text>
            <Text style={styles.product_description}>{product.pr}</Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: 20,
            }}
          >
            <Text style={styles.product_title}>
              {Translate.t("productDetails")}
            </Text>
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
        <SafeAreaView
          style={{
            backgroundColor: Colors.F0EEE9,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            flex: 1,
            flexGrow: 1,
            marginHorizontal: widthPercentageToDP("10%"),
            marginVertical: heightPercentageToDP("25%"),
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
              {Translate.t("sizeAndColor")}
            </Text>
          </View>
          <ScrollView>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.C2A059,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  XsShow == true
                    ? Animated.parallel([
                        Animated.timing(XSOpacity, {
                          toValue: heightPercentageToDP("0%"),
                          duration: 100,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onXsShow(false))
                    : Animated.parallel([
                        Animated.timing(XSOpacity, {
                          toValue: heightPercentageToDP("100%"),
                          duration: 30000,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onXsShow(true));
                }}
              >
                <View style={styles.variationTabs}>
                  <Text style={styles.variationTabsText}>XS</Text>
                  <ArrowUpIcon
                    style={styles.widget_icon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={XsShow == false ? styles.none : (opacity = XSOpacity)}
              >
                <View style={styles.variationTabs}>
                  <RadioButton value="green" />
                  <Text style={styles.variationTabsText}>Green</Text>
                </View>
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP("3%"),
                    flexDirection: "row",
                    alignItems: "center",
                    height: heightPercentageToDP("5%"),
                  }}
                >
                  <RadioButton value="pink" />
                  <Text style={styles.variationTabsText}>Pink</Text>
                </View>
              </Animated.View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.C2A059,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  sShow == true
                    ? Animated.parallel([
                        Animated.timing(sOpacity, {
                          toValue: heightPercentageToDP("0%"),
                          duration: 100,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onSShow(false))
                    : Animated.parallel([
                        Animated.timing(sOpacity, {
                          toValue: heightPercentageToDP("100%"),
                          duration: 30000,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onSShow(true));
                }}
              >
                <View style={styles.variationTabs}>
                  <Text style={styles.variationTabsText}>S</Text>
                  <ArrowUpIcon
                    style={styles.widget_icon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={sShow == false ? styles.none : (opacity = sOpacity)}
              >
                <View style={styles.variationTabs}>
                  <RadioButton value="グリーン" />
                  <Text style={styles.variationTabsText}>グリーン</Text>
                </View>
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP("3%"),
                    flexDirection: "row",
                    alignItems: "center",
                    height: heightPercentageToDP("5%"),
                  }}
                >
                  <RadioButton value="ピンク" />
                  <Text style={styles.variationTabsText}>ピンク</Text>
                </View>
              </Animated.View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.C2A059,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  mShow == true
                    ? Animated.parallel([
                        Animated.timing(mOpacity, {
                          toValue: heightPercentageToDP("0%"),
                          duration: 100,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onMShow(false))
                    : Animated.parallel([
                        Animated.timing(mOpacity, {
                          toValue: heightPercentageToDP("100%"),
                          duration: 30000,
                          useNativeDriver: false,
                        }),
                      ]).start(() => {}, onMShow(true));
                }}
              >
                <View style={styles.variationTabs}>
                  <Text style={styles.variationTabsText}>M</Text>
                  <ArrowUpIcon
                    style={styles.widget_icon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={mShow == false ? styles.none : (opacity = mOpacity)}
              >
                <View style={styles.variationTabs}>
                  <RadioButton value="グリーン" />
                  <Text style={styles.variationTabsText}>グリーン</Text>
                </View>
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP("3%"),
                    flexDirection: "row",
                    alignItems: "center",
                    height: heightPercentageToDP("5%"),
                  }}
                >
                  <RadioButton value="ピンク" />
                  <Text style={styles.variationTabsText}>ピンク</Text>
                </View>
              </Animated.View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: heightPercentageToDP("5%"),
                paddingBottom: heightPercentageToDP("5%"),
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  flex: 1,
                }}
              >
                <Text style={{ fontSize: RFValue(12) }}>
                  {Translate.t("unit")}
                </Text>
                <Picker
                  selectedValue={"3"}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                  <Picker.Item label="6" value="6" />
                  <Picker.Item label="7" value="7" />
                  <Picker.Item label="8" value="8" />
                  <Picker.Item label="9" value="9" />
                  <Picker.Item label="10" value="10" />
                </Picker>
              </View>
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                }}
              >
                <TouchableWithoutFeedback>
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
                    <Text style={{ fontSize: RFValue(11) }}>
                      {Translate.t("addToCartBtn")}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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
            marginTop: heightPercentageToDP("6.2%"),
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

      <CartFloating
        onPress={() => {
          // onShowChanged(true);
          db.collection("users")
            .doc(user.id.toString())
            .collection("carts")
            .doc(product.id.toString())
            .set({
              quantity: 1,
            });
          onShowText(true);
          setTimeout(
            function () {
              onShowText(false);
            }.bind(this),
            2000
          );

          const subscriber = db
            .collection("users")
            .doc(user.id.toString())
            .collection("carts")
            .get()
            .then((querySnapShot) => {
              onCartCountChanged(querySnapShot.docs.length);
            });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  picker: {
    marginLeft: widthPercentageToDP("1%"),
    width: widthPercentageToDP("18%"),
    height: heightPercentageToDP("4%"),
    fontSize: 12,
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
    height: height - heightPercentageToDP(10),
    overflow: "scroll",
    width: "100%",
    padding: 15,
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  font_small: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(12),
    //fontFamily: "sans-serif",
    padding: 2,
  },
  font_medium: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(14),
    //fontFamily: "sans-serif",
    padding: 2,
  },
  product_title: {
    //fontFamily: "sans-serif",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    fontSize: RFValue(14),
    paddingBottom: 5,
    marginBottom: 15,
  },
  product_description: {
    overflow: "hidden",
    //fontFamily: "sans-serif",
    textAlign: "justify",
    fontSize: RFValue(12),
  },
});
