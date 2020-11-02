import React from "react";
import {
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
export default function HomeProducts({props, idx, image, office, name, seller, price, category, shipping}) {
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback
        onPress={() => props.navigation.navigate("HomeStore")}
      >
        <View style={idx % 2 == 0 ? styles.products_left : styles.products_right}>
          <Image
            style={styles.product_image}
            source={{
              uri: image,
            }}
            resizeMode="cover"
          />
          <Text style={styles.product_office}>
            {office}
          </Text>
          <Text style={styles.product_name}>
            {name}
          </Text>
          <Text style={styles.product_seller}>
            {"Seller: "}{seller}
          </Text>
          <Text style={styles.product_price}>
            {price}{" (Tax not included)"}
          </Text>
          <Text numberOfLines={2} style={styles.product_category}>
            {category}
          </Text>
          <Text style={styles.product_shipping}>
            {shipping}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  products_left: {
    paddingTop: 10,
    marginRight: 3,
    width: (width / 2) - 18,
    overflow: "hidden"
  },
  products_right: {
    paddingTop: 10,
    marginLeft: 3,
    width: (width / 2) - 18,
    overflow: "hidden"
  },
  product_image: {
    width: (width / 2) - 18,
    height: (width / 2.4) - 18,
  },
  product_office: {
    fontSize: RFValue(9),
    width: "100%"
  },
  product_name: {
    fontSize: RFValue(13),
    width: "100%"
  },
  product_seller: {
    fontSize: RFValue(9),
    width: "100%"
  },
  product_price: {
    fontSize: RFValue(9),
    width: "100%"
  },
  product_category: {
    fontSize: RFValue(9),
    width: "100%"
  },
  product_shipping: {
    fontSize: RFValue(9),
    width: "100%"
  }
});
