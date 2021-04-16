import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import { useIsFocused } from "@react-navigation/native";
import * as Localization from "expo-localization";
import BackdropProvider from "@mgcrea/react-native-backdrop-provider";
import { BackdropContext } from "@mgcrea/react-native-backdrop-provider";
import { MonthPicker } from "react-native-propel-kit";
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
import Format from "../lib/format";
import Moment from "moment";
import { Icon } from "react-native-elements";
const format = new Format();
var kanjidate = require("kanjidate");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioDownForMore = win.width / 26 / 15;
let userID;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();
let commissionProducts = [];
let userSales = [];
let userCommissions = [];
let taxRate = 0;
let reducedTaxRate = 0;
// let salesProducts = [];

// function processSaleHtml(sales) {
//   let tmpSaleHtml = [];
//   for (var i = 0; i < sales.length; i++) {
//     let sale = sales[i];
//     tmpSaleHtml.push(
//       <TouchableWithoutFeedback key={i}>
//         <View style={styles.commissionTabContainer}>
//           <Text style={styles.commissionTabText}>
//             {kanjidate.format(
//               "{Y:4}/{M:2}/{D:2}",
//               new Date(sale.order.created)
//             )}
//           </Text>
//           <View
//             style={{
//               width: widthPercentageToDP("36%"),
//               // position: "absolute",
//               left: 0,
//               marginLeft: widthPercentageToDP("3%"),
//               // paddingBottom: heightPercentageToDP("2%"),
//             }}
//           >
//             <Text style={styles.commissionTabText}>
//               {sale.product_jan_code.horizontal
//                 ? sale.product_jan_code.horizontal.product_variety.product.name
//                 : sale.product_jan_code.vertical.product_variety.product.name}
//             </Text>
//           </View>
//           <Text
//             style={{
//               position: "absolute",
//               fontSize: RFValue(12),
//               right: 0,
//               paddingBottom: heightPercentageToDP("2%"),
//             }}
//           >
//             {format.separator(sale.unit_price)}円
//           </Text>
//         </View>
//       </TouchableWithoutFeedback>
//     );
//   }
//   return tmpSaleHtml;
// }
function processSaleHtml(orders, sales, tmpCommissionProducts) {
  let tmpSaleHtml = [];
  for (var i = 0; i < orders.length; i++) {
    let sale = sales.filter((salee) => {
      return (salee.order_product.order.id == orders[i]);
    });
    if (sale.length) {
      sale = sale[0];
      let ttlCommission = 0;
      tmpCommissionProducts.map((tmpCommission) => {
        if (tmpCommission.order_product.id == orders[i]) {
          ttlCommission += tmpCommission.is_food 
              ? parseInt(tmpCommission.amount) + parseInt(parseFloat(tmpCommission.amount) * reducedTaxRate)
              : parseInt(tmpCommission.amount) + parseInt(parseFloat(tmpCommission.amount) * taxRate)
        }
      })
    
      tmpSaleHtml.push(
        <TouchableWithoutFeedback key={i}>
          <View style={styles.commissionTabContainer}>
            <Text style={styles.commissionTabText}>
              {kanjidate.format(
                "{Y:4}/{M:2}/{D:2}",
                new Date(sale.order_product.order.created)
              )}
            </Text>
            <View
              style={{
                width: widthPercentageToDP("17%"),
                // position: "absolute",
                left: 0,
                marginLeft: widthPercentageToDP("2%"),
                // paddingBottom: heightPercentageToDP("2%"),
              }}
            >
              <Text style={styles.commissionTabText}>
                {sale.order_product.product_jan_code.horizontal
                  ? sale.order_product.product_jan_code.horizontal.product_variety.product.name
                  : sale.order_product.product_jan_code.vertical.product_variety.product.name}
              </Text>
            </View>
            <View
              style={{
                // width: widthPercentageToDP("17%"),
                position: "absolute",
                right: 0,
                paddingBottom: heightPercentageToDP("2%"),
                marginRight: widthPercentageToDP("33%"),
              }}
            >
              <Text style={{
                  fontSize: RFValue(11),
                  right: 0,
                }}
              >
                {format.separator(parseInt(sale.order_product.order.amount) + parseInt(sale.order_product.order.tax))}円
              </Text>
              <Text style={{
                  fontSize: RFValue(11),
                  right: -23,
                }}>
                -{format.separator(ttlCommission)}円
              </Text>
            </View>
            <Text
              style={{
                position: "absolute",
                fontSize: RFValue(11),
                right: 0,
                paddingBottom: heightPercentageToDP("2%"),
                marginRight: widthPercentageToDP("17%"),
              }}
            >
              {format.separator(sale.order_product.order.shipping_fee)}円
            </Text>
            <Text
              style={{
                position: "absolute",
                fontSize: RFValue(11),
                right: 0,
                paddingBottom: heightPercentageToDP("2%"),
              }}
            >
              {format.separator(parseInt(sale.order_product.order.amount) 
              + parseInt(sale.order_product.order.tax)
              + parseInt(sale.order_product.order.shipping_fee)
              - parseInt(ttlCommission))}円
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
  return tmpSaleHtml;
}
function processCommissionHtml(orders, commissions) {
  let tmpCommissionHtml = [];
  for (var i = 0; i < orders.length; i++) {
    let commission = commissions.filter((comm) => {
      return (comm.order_product.order.id == orders[i]);
    });
    if (commission.length) {
      commission = commission[0];
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
                // position: "absolute",
                left: 0,
                width: widthPercentageToDP("36%"),
                marginLeft: widthPercentageToDP("3%"),
                // marginBottom: heightPercentageToDP("2%"),
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
                {format.separator(commission.order_product.unit_price)}円
              </Text>
            </View>
            <Text
              style={{
                position: "absolute",
                fontSize: RFValue(11),
                right: 0,
                paddingBottom: heightPercentageToDP("2%"),
              }}
            >
              {commission.is_food 
              ? format.separator(parseInt(commission.amount) + parseInt(parseFloat(commission.amount) * reducedTaxRate)) 
              : format.separator(parseInt(commission.amount) + parseInt(parseFloat(commission.amount) * taxRate))}円
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
  return tmpCommissionHtml;
}

export default function SalesManagement(props) {
  const isFocused = useIsFocused();
  const [status, onStatusChanged] = useStateIfMounted("commission");
  const [sales, onSalesChanged] = useStateIfMounted({});
  const [saleHtml, onSaleHtmlChanged] = useStateIfMounted(<View></View>);
  const [commissions, onCommissionsChanged] = useStateIfMounted({});
  const [date, onDateChange] = useStateIfMounted(new Date());
  const [placeholderDate, onPlaceHolderDate] = useStateIfMounted(
    year + "年" + month + "月"
  );
  const [commissionHtml, onComissionHtmlChanged] = useStateIfMounted(
    <View></View>
  );
  const [user, onUserChanged] = useStateIfMounted({});
  const [saleLoaded, onSaleLoaded] = useStateIfMounted(false);
  const [commissionLoaded, onCommissionLoaded] = useStateIfMounted(false);
  const [totalCommission, onTotalCommissionChanged] = useStateIfMounted(0);
  const [totalSale, onTotalSaleChanged] = useStateIfMounted(0);
  const [total, onTotalChanged] = useStateIfMounted(0);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      AsyncStorage.getItem("user").then(function (url) {
        let urls = url.split("/");
        urls = urls.filter((url) => {
          return url;
        });
        let userId = urls[urls.length - 1];
        userID = userId;
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
              reducedTaxRate = taxes[0].reduced_tax_rate;
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

        request
          .get("commissionProducts/" + userId + "/")
          .then(function (response) {
            if (response.data.commissionProducts) {
              commissionProducts = response.data.commissionProducts;
            } else {
              commissionProducts = [];
            }
            if (response.data.userSales) {
              userSales = response.data.userSales;
            } else {
              userSales = [];
            }
            if (response.data.userCommissions) {
              userCommissions = response.data.userCommissions;
            } else {
              userCommissions = [];
            }
            onUpdate();
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
            onCommissionLoaded(true);
          });

        // request
        //   .get("saleProducts/" + userId + "/")
        //   .then(function (response) {
        //     // salesProducts = [];
        //     if (response.data.saleProducts) {
        //       salesProducts = response.data.saleProducts;
        //     } else {
        //       salesProducts = [];
        //     }
        //     onUpdate();
        //   })
        //   .catch(function (error) {
        //     if (
        //       error &&
        //       error.response &&
        //       error.response.data &&
        //       Object.keys(error.response.data).length > 0
        //     ) {
        //       alert.warning(
        //         error.response.data[Object.keys(error.response.data)[0]][0] +
        //           "(" +
        //           Object.keys(error.response.data)[0] +
        //           ")"
        //       );
        //     }
        //     onSaleLoaded(true);
        //   });
      });
    });
  }, [isFocused]);

  function onUpdate(date) {
    let tmpDate = new Date();
    if (date) {
      tmpDate = date;
    }
    onDateChange(tmpDate);
    onPlaceHolderDate(
      tmpDate.getFullYear() + "年" + (tmpDate.getMonth() + 1) + "月"
    );
    let orders = [];
    commissionProducts.map(
      (commissionProduct) => {
        if (!commissionProduct["is_hidden"]) {
          let periods = commissionProduct["order_product"]["order"][
            "created"
          ].split("-");
          let year = periods[0];
          let month = periods[1];
          if (year == tmpDate.getFullYear() && month == tmpDate.getMonth() + 1) {
            if (orders.indexOf(commissionProduct["order_product"]["order"]['id']) == -1) {
              orders.push(commissionProduct["order_product"]["order"]['id'])
            }
          }
        }
      }
    );
    let tmpCommissionProducts = commissionProducts.filter(
      (commissionProduct) => {
        if (!commissionProduct["is_hidden"] && !commissionProduct["is_sales"]) {
          let periods = commissionProduct["order_product"]["order"][
            "created"
          ].split("-");
          let year = periods[0];
          let month = periods[1];
          return year == tmpDate.getFullYear() && month == tmpDate.getMonth() + 1;
        }
      }
    );
    onCommissionsChanged(tmpCommissionProducts);
    onComissionHtmlChanged(
      processCommissionHtml(orders, tmpCommissionProducts)
    );
    let commissionTotal = 0;
    userCommissions.map((commission) => {
      if (commission.year == tmpDate.getFullYear() && commission.month == (tmpDate.getMonth() + 1)) {
        commissionTotal += commission.total_amount;
      }
    });
    onTotalCommissionChanged(commissionTotal);


    // let tmpSaleProducts = salesProducts.filter((saleProduct) => {
    //   if (!saleProduct["is_hidden"]) {
    //     let periods = saleProduct["order"]["created"].split("-");
    //     let year = periods[0];
    //     let month = periods[1];
    //     return year == tmpDate.getFullYear() && month == tmpDate.getMonth() + 1;
    //   }
    // });
    let tmpSaleProducts = commissionProducts.filter(
      (commissionProduct) => {
        if (!commissionProduct["is_hidden"] && commissionProduct["is_sales"]) {
          let periods = commissionProduct["order_product"]["order"][
            "created"
          ].split("-");
          let year = periods[0];
          let month = periods[1];
          return year == tmpDate.getFullYear() && month == tmpDate.getMonth() + 1;
        }
      }
    );
    onSalesChanged(tmpSaleProducts);
    onSaleHtmlChanged(processSaleHtml(orders, tmpSaleProducts, tmpCommissionProducts));
    let saleTotal = 0;
    userSales.map((sale) => {
      if (sale.year == tmpDate.getFullYear() && sale.month == (tmpDate.getMonth() + 1)) {
        saleTotal += sale.total_amount;
      }
    });
    onTotalSaleChanged(saleTotal);

    onTotalChanged(
      format.separator(parseFloat(commissionTotal) + parseFloat(saleTotal))
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        text={Translate.t("salesManagement")}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.goBack();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader outUser={user} props={props} name={user.nickname} />

      <ScrollView
        style={{
          marginHorizontal: widthPercentageToDP("3%"),
        }}
      >
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
        <View
          style={{
            marginTop: heightPercentageToDP("3%"),
            zIndex: 999,
          }}
        >
          <MonthPicker
            initialValue={new Date()}
            value={date}
            confirmTitle={Translate.t("confirm")}
            cancelTitle={Translate.t("cancel")}
            // placeholder={placeholderDate}
            onChange={onUpdate}
            style={{
              // zIndex: 999,
              color: "transparent",
              alignItems: "center",
              // width: widthPercentageToDP("23%"),
              height: heightPercentageToDP("4%"),
              borderRadius: 5,
              textAlign: "center",
              fontSize: RFValue(12),
            }}
          />
          <View
            style={{
              zIndex: -999,
              color: "black",
              alignItems: "center",
              // width: widthPercentageToDP("23%"),
              // height: heightPercentageToDP("4%"),
              borderRadius: 5,
              textAlign: "center",
              fontSize: RFValue(12),
              position: "absolute",
              flex: 1,
            }}
          >
            <View style={{flex: 1, flexDirection: "row"}}>
              <View>
                <Text>{placeholderDate}</Text>
              </View>
              <View style={{justifyContent: "center", paddingLeft: widthPercentageToDP("1%")}}>
                <Icon
                  name="chevron-down"
                  type="font-awesome"
                  size={RFValue("10")}
                  color="black"
                />
              </View>
            </View>
          </View>
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
              <Text style={styles.totalSalesContainerText}>
                {Translate.t("totalSale")}
              </Text>
              <Text style={{ marginTop: heightPercentageToDP(".5%") }}>
                {format.separator(
                  parseFloat(totalSale) + parseFloat(totalCommission)
                )}
                円
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
              <Text style={styles.totalSalesContainerText}>
                【{Translate.t("breakdown")}】
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: heightPercentageToDP("1%") }}>
                  <Text style={styles.totalSalesContainerText}>
                    {Translate.t("commission")} :
                  </Text>
                  <Text style={styles.totalSalesContainerText}>
                    {Translate.t("sales")} :
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={styles.totalSalesContainerText}>
                    {format.separator(totalCommission)}円
                  </Text>
                  <Text style={styles.totalSalesContainerText}>
                    {format.separator(totalSale)}円
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
                {Translate.t("commission")}
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
                {Translate.t("sales")}
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
                  {Translate.t("date")}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    left: 0,
                    marginLeft: widthPercentageToDP("17%"),
                  }}
                >
                  {status == "commission"
                    ? Translate.t("product") + " / " + Translate.t("price")
                    : " " + Translate.t("product")}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("32%"),
                  }}
                >
                  {status == "commission"
                    ? ""
                    : " " + Translate.t("price") + " / " + Translate.t("fee")}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("15%"),
                  }}
                >
                  {status == "commission"
                    ? ""
                    : " " + Translate.t("shipping")}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    position: "absolute",
                    right: 0,
                  }}
                >
                  {status == "commission"
                    ? Translate.t("commissionAmt")
                    : " " + Translate.t("salesAmt")}
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
      </ScrollView>
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
    flexGrow: 1,
    paddingBottom: heightPercentageToDP("3%"),
    borderBottomColor: Colors.CECECE,
    marginTop: heightPercentageToDP("1.5%"),
    // backgroundColor: "orange",
  },
  commissionTabText: {
    // marginBottom: heightPercentageToDP("2%"),
    fontSize: RFValue(11),
  },
});
