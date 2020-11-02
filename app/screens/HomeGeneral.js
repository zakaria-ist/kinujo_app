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
} from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import CustomFloatingButton from "../assets/CustomComponents/CustomFloatingButton";
import HomeProducts from "./HomeProducts";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function Home(props) {
  return (
    <SafeAreaView>
      <CustomHeader />
      <CustomSecondaryHeader name="髪長絹子 さん" />
      <View style={styles.discription_header}>
        <View style={styles.disc_title}>
          <Text style={styles.disc_title_text}>
            {"Seller: KINUJO Offical Product"}
          </Text>
        </View>
        <View style={styles.disc_button_group}>
          <Button
            title="Category"
            color="#E6DADE"
          />
        </View>
      </View>
      <CustomFloatingButton />
      <ScrollView style={styles.home_product_view}>
          <View style={styles.section_header}>
            <Text style={styles.section_header_text}>
              {"KINUJO official product"}
            </Text>
          </View>
          <View style={styles.section_product}>
            <HomeProducts props={props} idx="0" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO W-worldwide model-" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
            <HomeProducts props={props} idx="1" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO W-worldwide model-" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
          </View>
          <View style={styles.section_header}>
            <Text style={styles.section_header_text}>
              {"Featured Products"}
            </Text>
          </View>
          <View style={styles.section_product}>
            <HomeProducts idx="0" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO W-worldwide model-" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
            <HomeProducts idx="1" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO -" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
            <HomeProducts idx="2" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO W-worldwide model-" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
            <HomeProducts idx="3" image="https://www.alchemycorner.com/wp-content/uploads/2018/01/AC_YourProduct2.jpg" office="KINUJO" name="KINUJO W-worldwide model-" seller="KINUJO" price="12,000Yen" category="Hair Iron" shipping="Free Shipping" />
          </View>
      </ScrollView>
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
    padding: 15,
    paddingBottom: 5,
    backgroundColor: "#FFF"
  },
  disc_title: {
    width: "calc(100% - 100px)"
  },
  disc_title_text: {
    fontSize: RFValue(14)
  },
  disc_button_group: {
    width: 100,
    flexDirection: "row-reverse"
  },
  home_product_view: {
    height: height - 48 - heightPercentageToDP("26%"),
    padding: 15,
    paddingTop: 0,
    backgroundColor: "#FFF",
    overflow: "scroll"
  },
  section_header: {
    width: "100%",
    borderBottomColor: 'black',
    borderBottomWidth: 2
  },
  section_header_text: {
    borderBottomColor: 'black',
    fontSize: RFValue(14),
    paddingBottom: 5
  },
  section_product: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  }
});
