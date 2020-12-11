import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
var zenginCode = require("zengin-code");
const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
export default function BankAccountRegistration(props) {
  const [financialAccount, onFinancialAccountChanged] = React.useState({
    financial_name: "test",
  });
  const [financialName, onFinancialNameChanged] = React.useState("");
  const [branchName, onBranchNameChanged] = React.useState("");
  const [accountType, onAccountTypeChanged] = React.useState("");
  const [accountNumber, onAccountNumberChanged] = React.useState("");
  const [accountHolder, onAccountHolderChanged] = React.useState("");
  const [bankCode, onBankCodeChanged] = React.useState("");
  const [branchCode, onBranckCodeChanged] = React.useState("");
  const [loaded, onLoaded] = React.useState("");
  const [user, onUserChanged] = React.useState({});
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];

      if (!user.url) {
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
      }

      if (!loaded) {
        request
          .get("financial-account/" + userId + "/")
          .then(function (response) {
            onLoaded(true);
            onFinancialAccountChanged(response.data.financialAccount);
            onFinancialNameChanged(
              response.data.financialAccount.financial_name
            );
            onBranchNameChanged(response.data.financialAccount.branch_name);
            onAccountTypeChanged(response.data.financialAccount.account_type);
            onAccountNumberChanged(
              response.data.financialAccount.account_number
            );
            onAccountHolderChanged(response.data.financialAccount.account_name);
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
      }
    });
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        text={Translate.t("bankAccount")}
      />
      <CustomSecondaryHeader
        name={user.nickname}
        accountType={
          props.route.params.is_store ? Translate.t("storeAccount") : ""
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder={Translate.t("bankCode")}
              placeholderTextColor={Colors.deepGrey}
              style={styles.textInput}
              onChangeText={(text) => {
                onBankCodeChanged(text);
                if (zenginCode[text]) {
                  onFinancialNameChanged(zenginCode[text]["name"]);
                }
              }}
              value={bankCode}
            ></TextInput>

            <TextInput
              placeholder={Translate.t("financialInstitutionName")}
              placeholderTextColor={Colors.deepGrey}
              editable={false}
              style={styles.textInput}
              onChangeText={(text) => onFinancialNameChanged(text)}
              value={financialName}
            ></TextInput>
            <TextInput
              placeholder={Translate.t("branchCode")}
              placeholderTextColor={Colors.deepGrey}
              style={styles.textInput}
              onChangeText={(text) => {
                onBranckCodeChanged(text);
                if (zenginCode[bankCode]) {
                  if (zenginCode[bankCode]["branches"][text]) {
                    onBranchNameChanged(
                      zenginCode[bankCode]["branches"][text]["name"]
                    );
                  }
                }
              }}
              value={branchCode}
            ></TextInput>
            <TextInput
              placeholder={Translate.t("branchName")}
              placeholderTextColor={Colors.deepGrey}
              style={styles.textInput}
              editable={false}
              onChangeText={(text) => onBranchNameChanged(text)}
              value={branchName}
            ></TextInput>
            <DropDownPicker
              // controller={(instance) => (controller = instance)}
              style={styles.textInput}
              items={[
                {
                  label: Translate.t("normal"),
                  value: "1",
                },
                {
                  label: Translate.t("current"),
                  value: "2",
                },
                {
                  label: Translate.t("savings"),
                  value: "3",
                },
              ]}
              defaultValue={"1"}
              containerStyle={{ height: heightPercentageToDP("8%") }}
              labelStyle={{
                fontSize: RFValue(11),
                color: "black",
              }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              selectedtLabelStyle={{
                color: "black",
              }}
              placeholder={Translate.t("prefecture")}
              dropDownStyle={{ backgroundColor: "white" }}
              onChangeItem={(item) => {
                if (item) {
                  console.log(item.value);
                  onAccountTypeChanged(item.value);
                }
              }}
            />
            <TextInput
              maxLength={7}
              placeholder={Translate.t("accountNumber")}
              placeholderTextColor={Colors.deepGrey}
              style={styles.textInput}
              onChangeText={(text) => onAccountNumberChanged(text)}
              value={accountNumber}
            ></TextInput>
            <TextInput
              placeholder={Translate.t("accountHolder")}
              placeholderTextColor={Colors.deepGrey}
              style={styles.textInput}
              onChangeText={(text) => onAccountHolderChanged(text)}
              value={accountHolder}
            ></TextInput>
          </View>
          <Text style={styles.warningText}>
            {Translate.t("bankRegistrationWarning")}
          </Text>
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (accountNumber.length == 7) {
                  if (
                    financialName &&
                    branchName &&
                    accountType &&
                    accountNumber &&
                    accountHolder
                  ) {
                    AsyncStorage.getItem("user").then(function (url) {
                      url = url.replace(
                        "http://testserver",
                        "http://127.0.0.1:8000"
                      );
                      let urls = url.split("/");
                      urls = urls.filter((url) => {
                        return url;
                      });

                      request
                        .post("financial_account/", {
                          user: url.replace("testserver", "127.0.0.1:8000"),
                          financial_name: financialName,
                          account_type: accountType,
                          branch_code: "000",
                          branch_name: branchName,
                          account_number: accountNumber,
                          account_name: accountHolder,
                          financial_code: "0000",
                        })
                        .then(function (response) {
                          onAccountHolderChanged("");
                          onAccountNumberChanged("");
                          onBranchNameChanged("");
                          onFinancialNameChanged("");
                          onAccountTypeChanged("");
                          props.navigation.pop();
                        })
                        .catch(function (error) {
                          alert.warning(
                            error.response.data[
                              Object.keys(error.response.data)[0]
                            ][0]
                          );
                          onLoaded(true);
                        });
                    });
                  } else {
                    alert.warning(Translate.t("fieldNotFilled"));
                  }
                } else {
                  alert.warning("Invalid Account Number");
                }
              }}
            >
              <View style={styles.saveButtonContainer}>
                <Text style={styles.saveButtonText}>{Translate.t("save")}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "white",
    alignItems: "center",
    fontSize: RFValue(11),
    height: heightPercentageToDP("5.8%"),
    paddingLeft: widthPercentageToDP("2%"),
    marginVertical: heightPercentageToDP("1%"),
  },
  textInputContainer: {
    marginTop: heightPercentageToDP("3%"),
    backgroundColor: Colors.F0EEE9,
    marginHorizontal: widthPercentageToDP("5%"),
    padding: widthPercentageToDP("4%"),
    justifyContent: "space-evenly",
  },
  warningText: {
    color: "red",
    fontSize: RFValue(12),
    marginHorizontal: widthPercentageToDP("5%"),
    marginTop: heightPercentageToDP("5%"),
  },
  saveButtonContainer: {
    backgroundColor: Colors.E6DADE,
    marginHorizontal: widthPercentageToDP("25%"),
    borderRadius: 5,
    alignItems: "center",
    marginTop: heightPercentageToDP("5%"),
    padding: heightPercentageToDP("1%"),
  },
  saveButtonText: {
    fontSize: RFValue(12),
    color: "white",
  },
});
