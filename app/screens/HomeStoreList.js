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
import FastImage from 'react-native-fast-image';
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const images = [
  "https://source.unsplash.com/1024x768/?nature",
  "https://source.unsplash.com/1024x768/?water",
  "https://source.unsplash.com/1024x768/?girl",
  "https://source.unsplash.com/1024x768/?tree",
];
export default function HomeStoreList(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }} />
      <View style={styles.product_content}>
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
          <Text style={styles.font_small}>{"KINUJO W"}</Text>
          <Text style={styles.font_medium}>
            {"KINUJO W - worldwide model -"}
          </Text>
          <Text style={styles.font_small}>{"Seller: KINUJO"}</Text>
          <Text
            style={[
              styles.font_small,
              {
                padding: 10,
              },
            ]}
          >
            {"Hair Iron"}
          </Text>
          <Text style={styles.font_medium}>
            {"12,000Yen (Tax Not Included)"}
          </Text>
          <Text style={styles.font_small}>{"Free Shipping"}</Text>
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
              'The ultimate overseas straight iron that uses the new common sense of hair irons, "Silk Plate ®. Silk Plate ® made from a special material realizes an overwhelmingly smooth plate. Minimizes damage to hair. "Silk Plate ®" is the best plate for people who do not want to damage their hair but want to use a curling iron because it has a moisturizing power that does not evaporate immediately even if it is sprinkled with water at a high temperature of 200 ° C. The temperature rises to 180 ° C in about 35 seconds after turning on the power! It keeps a high temperature even during use and can be used at a uniform temperature throughout the hair, enabling styling that does not crumble easily. The curl cushion function keeps the curls on the ends of the hair neatly organized. It can be set from 140 ° C to 220 ° C in 20 ° C increments. A safe design that automatically turns off 60 minutes after the power is turned on. Since the connector part of the cord is a 360-degree rotation type, the cord does not get entangled. It comes with a '
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
            {"Model Number：EK001"}
          </Text>
          <Text style={styles.product_description}>
            {"Power Supply：AC100～240V （Domestic and overseas use possible）"}
          </Text>
          <Text style={styles.product_description}>{"Frequency：50/60Hz"}</Text>
          <Text style={styles.product_description}>
            {"Actual Size：approx.289(W) x 40(D) x 31(H) mm"}
          </Text>
          <Text style={styles.product_description}>
            {"Plate Size：approx.24 x 90mm"}
          </Text>
          <Text style={styles.product_description}>
            {"Weigth：approx.346g"}
          </Text>
          <Text style={styles.product_description}>
            {"Humidity adjustment：approx.140,160,180,200,220℃"}
          </Text>
        </View>
      </View>
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
    height: height - heightPercentageToDP(10) - 48,
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
