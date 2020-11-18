import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from 'react-native-fast-image';
import { RFValue } from "react-native-responsive-fontsize";
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


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function HomeStoreList(props) {
  const [user, onUserChanged] = React.useState({});
  const [product, onProductChanged] = React.useState({});
  const [images, onImagesChanged] = React.useState({});

  React.useEffect(()=>{
    AsyncStorage.getItem("user").then(function(url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
        })
        .catch(function(error) {
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
      .then(function(response) {
        onProductChanged(response.data);

        if(response.data.productImages.length > 0){
          onImagesChanged(response.data.productImages.map((productImage) => {
            return productImage.image.image;
          }));
        } else {
          onImagesChanged(['https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg'])
        }
      })
      .catch(function(error) {
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
  }, [])

  return (
    <SafeAreaView>
      <CustomHeader
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }} />
      <View style={styles.product_content}>
        <ScrollView>
          <View style={{width:"100%",height:width / 1.4 + 100}}>
            {/* Need Find Image Slider */}
            <SliderBox
              ImageComponent={FastImage}
              images={images}
              sliderBoxHeight={width / 1.4 + 20}
              parentWidth={width - 30}
              onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
              dotColor="#D8CDA7"
              inactiveDotColor="#90A4AE"
              resizeMethod={'resize'}
              resizeMode={'cover'}
              autoplay={true}
              circleLoop={true}
              paginationBoxStyle={{
                position: "absolute",
                bottom: 0,
                padding: 0,
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                marginBottom: -60
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
            <Text style={styles.font_small}>{"Seller: " + (product && product.user ? (product.user.real_name ? product.user.real_name : product.user.nickname) : "")}</Text>
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
              {(user.is_seller ? product.store_price : product.price) + " Yen (Tax Not Included)"}
            </Text>
            <Text style={styles.font_small}>{product.shipping_fee ? ("Shipping: " + product.shipping_fee)  : "Free Shipping"}</Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: 20,
            }}
          >
            <Text style={styles.product_title}>{"Product Featured"}</Text>
            <Text style={styles.product_description}>
              {
                product.pr
              }
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              paddingTop: 20,
            }}
          >
            <Text style={styles.product_title}>{"Product Details"}</Text>
            <Text style={styles.product_description}>
              {product.pr}
            </Text>
          </View>
        </ScrollView>
      </View>
      <CartFloating onPress={
        () => {
          db.collection("users")
            .doc(user.id.toString())
            .collection("carts")
            .doc(product.id.toString())
            .set({
              quantity: 1,
            });
          alert.warning("Added to cart.");
        }
      }/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: "sans-serif",
    padding: 2,
  },
  font_medium: {
    width: "100%",
    textAlign: "center",
    overflow: "hidden",
    fontSize: RFValue(14),
    fontFamily: "sans-serif",
    padding: 2,
  },
  product_title: {
    fontFamily: "sans-serif",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    fontSize: RFValue(14),
    paddingBottom: 5,
    marginBottom: 15,
  },
  product_description: {
    overflow: "hidden",
    fontFamily: "sans-serif",
    textAlign: "justify",
    fontSize: RFValue(12),
  },
});
