import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
var kanjidate = require("kanjidate");

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioDownForMore = win.width / 26 / 15;
function processSaleHtml(sales) {
  let tmpSaleHtml = [];
  for (var i = 0; i < sales.length; i++) {
    let sale = sales[i];
    tmpSaleHtml.push(
      <TouchableWithoutFeedback key={i}>
        <View style={styles.commissionTabContainer}>
          <Text style={styles.commissionTabText}>
            {kanjidate.format(
              "{Y:4}/{M:2}/{D:2}",
              new Date(sale.order.created)
            )}
          </Text>
          <View
            style={{
              position: "absolute",
              left: 0,
              marginLeft: widthPercentageToDP("20%"),
            }}
          >
            <Text style={styles.commissionTabText}>
              {sale.product_jan_code.horizontal
                ? sale.product_jan_code.horizontal.product_variety.product.name
                : sale.product_jan_code.vertical.product_variety.product.name}
            </Text>
          </View>
          <Text
            style={{
              position: "absolute",
              fontSize: RFValue(12),
              right: 0,
            }}
          >
            {sale.unit_price}円
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return tmpSaleHtml;
}
function processCommissionHtml(commissions) {
  let tmpCommissionHtml = [];
  for (var i = 0; i < commissions.length; i++) {
    let commission = commissions[i];
    tmpCommissionHtml.push(
      <TouchableWithoutFeedback key={i}>
        <View style={styles.commissionTabContainer}>
          <Text style={styles.commissionTabText}>
            {kanjidate.format(
              "{Y:4}/{M:2}/{D:2}",
              new Date(commission.order_product.order.created)
            )}
          </Text>
          <View
            style={{
              position: "absolute",
              left: 0,
              marginLeft: widthPercentageToDP("20%"),
            }}
          >
            <Text style={styles.commissionTabText}>
              {commission.order_product.product_jan_code.horizontal
                ? commission.order_product.product_jan_code.horizontal
                    .product_variety.product.name
                : commission.order_product.product_jan_code.vertical
                    .product_variety.product.name}
            </Text>
            <Text style={styles.commissionTabText}>
              {commission.order_product.unit_price}円
            </Text>
          </View>
          <Text
            style={{
              position: "absolute",
              fontSize: RFValue(12),
              right: 0,
            }}
          >
            {commission.amount}円
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return tmpCommissionHtml;
}
export default function SalesManagement(props) {
  const [status, onStatusChanged] = React.useState("commission");
  const [sales, onSalesChanged] = React.useState({});
  const [saleHtml, onSaleHtmlChanged] = React.useState(<View></View>);
  const [commissions, onCommissionsChanged] = React.useState({});
  const [commissionHtml, onComissionHtmlChanged] = React.useState(
    <View></View>
  );
  const [user, onUserChanged] = React.useState({});
  const [saleLoaded, onSaleLoaded] = React.useState(false);
  const [commissionLoaded, onCommissionLoaded] = React.useState(false);
  const [totalCommission, onTotalCommissionChanged] = React.useState(0);
  const [totalSale, onTotalSaleChanged] = React.useState(0);
  const [total, onTotalChanged] = React.useState(0);

  AsyncStorage.getItem("user").then(function(url) {
    let urls = url.split("/");
    urls = urls.filter((url) => {
      return url;
    });
    let userId = urls[urls.length - 1];

    if (!user.url) {
      request
        .get(url)
        .then(function(response) {
          onUserChanged(response.data);
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
        });
    }

    if (!commissionLoaded) {
      request
        .get("commissionProducts/" + userId + "/")
        .then(function(response) {
          onCommissionsChanged(response.data.commissionProducts);
          onComissionHtmlChanged(
            processCommissionHtml(response.data.commissionProducts, status)
          );
          let total = 0;
          response.data.commissionProducts.map((commission) => {
            total += commission.amount;
          });
          onTotalCommissionChanged(total);
          onTotalChanged(totalCommission + totalSale);
          onCommissionLoaded(true);
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
          onCommissionLoaded(true);
        });
    }

    if (!saleLoaded) {
      request
        .get("saleProducts/" + userId + "/")
        .then(function(response) {
          onSalesChanged(response.data.saleProducts);
          onSaleHtmlChanged(
            processSaleHtml(response.data.saleProducts, status)
          );
          let total = 0;
          response.data.saleProducts.map((sale) => {
            total += sale.unit_price;
          });
          onTotalSaleChanged(total);
          onTotalChanged(totalCommission + totalSale);
          onSaleLoaded(true);
        })
        .catch(function(error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
          }
          onSaleLoaded(true);
        });
    }
  });
  return (
    <SafeAreaView>
      <CustomHeader
        text="売上管理"
        onFavoriteChanged="favorite"
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader
        name={user.real_name ? user.real_name : user.nickname}
        accountType={
          props.route.params.is_store ? Translate.t("storeAccount") : ""
        }
      />
      <View style={{ marginHorizontal: widthPercentageToDP("3%") }}>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: heightPercentageToDP("1.5%"),
          }}
        >
          <Text>2020年0月</Text>
          <Image
            style={{
              width: win.width / 26,
              height: 8 * ratioDownForMore,
            }}
            source={require("../assets/Images/downForMoreIcon.png")}
          />
        </View> */}
        <View>
          <View
            style={{
              borderWidth: 2,
              flexDirection: "row",
              marginTop: heightPercentageToDP("1%"),
              backgroundColor: Colors.F6F6F6,
              borderColor: Colors.D7CCA6,
            }}
          >
            <View
              style={{
                paddingRight: widthPercentageToDP("10%"),
                borderRightWidth: 1,
                borderRightColor: Colors.CECECE,
                marginLeft: widthPercentageToDP("3%"),
                marginVertical: heightPercentageToDP("1%"),
                justifyContent: "center",
              }}
            >
              <Text style={styles.totalSalesContainerText}>総売上</Text>
              <Text style={{ marginTop: heightPercentageToDP(".5%") }}>
                {totalSale + totalCommission}円
              </Text>
            </View>
            <View
              style={{
                marginVertical: heightPercentageToDP("1.5%"),
                alignItems: "center",
                justifyContent: "center",
                marginLeft: widthPercentageToDP("10%"),
                width: widthPercentageToDP("45%"),
              }}
            >
              <Text style={styles.totalSalesContainerText}>【内訳】</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: heightPercentageToDP("1%") }}>
                  <Text style={styles.totalSalesContainerText}>
                    Commission :
                  </Text>
                  <Text style={styles.totalSalesContainerText}>Sales : </Text>
                </View>
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={styles.totalSalesContainerText}>
                    {totalCommission}円
                  </Text>
                  <Text style={styles.totalSalesContainerText}>
                    {totalSale}円
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: heightPercentageToDP("3%"),
              paddingBottom: widthPercentageToDP("5%"),
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                onPress={() => {
                  onStatusChanged("commission");
                  //   onProductHtmlChanged(
                  //     processProductHtml(products, "commission")
                  //   );
                }}
                style={
                  status == "commission"
                    ? styles.salesText
                    : styles.commissionText
                }
              >
                Commission
              </Text>
              <Text
                onPress={() => {
                  onStatusChanged("sales");
                  //   onProductHtmlChanged(processProductHtml(products, "sales"));
                }}
                style={
                  status == "sales" ? styles.salesText : styles.commissionText
                }
              >
                Sales
              </Text>
            </View>
            <View
              style={{
                backgroundColor: Colors.F6F6F6,
                borderWidth: 2,
                paddingBottom: widthPercentageToDP("5%"),
                borderColor: Colors.D7CCA6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: widthPercentageToDP("3%"),
                  borderBottomWidth: 2,
                  marginTop: heightPercentageToDP("1.5%"),
                  borderBottomColor: Colors.D7CCA6,
                  paddingBottom: heightPercentageToDP("5%"),
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    left: 0,
                  }}
                >
                  Date
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    left: 0,
                    marginLeft: widthPercentageToDP("20%"),
                  }}
                >
                  {status == "commission" ? "Product / Price" : " Product"}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    right: 0,
                  }}
                >
                  {status == "commission" ? "Commission" : " Amount"}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: widthPercentageToDP("3%"),
                  marginTop: heightPercentageToDP("1.5%"),
                }}
              >
                {status == "commission" ? commissionHtml : saleHtml}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  totalSalesContainerText: {
    fontSize: RFValue(12),
  },
  commissionText: {
    borderWidth: 1,
    borderColor: Colors.F0EEE9,
    backgroundColor: Colors.F0EEE9,
    paddingHorizontal: widthPercentageToDP("8%"),
    paddingVertical: heightPercentageToDP("1%"),
    color: Colors.D7CCA6,
    fontSize: RFValue(12),
  },
  salesText: {
    borderWidth: 1,
    borderColor: Colors.D7CCA6,
    backgroundColor: Colors.D7CCA6,
    paddingHorizontal: widthPercentageToDP("8%"),
    paddingVertical: heightPercentageToDP("1%"),
    color: Colors.white,
    fontSize: RFValue(12),
  },
  commissionTabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingBottom: heightPercentageToDP("3%"),
    borderBottomColor: Colors.CECECE,
  },
  commissionTabText: {
    fontSize: RFValue(12),
  },
});
