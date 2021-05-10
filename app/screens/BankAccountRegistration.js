import React from "react";
import { InteractionManager } from 'react-native';

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
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
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
import { useIsFocused } from "@react-navigation/native";
var zenginCode = require("zengin-code");
const request = new Request();
const alert = new CustomAlert();

const win = Dimensions.get("window");
let controller;
export default function BankAccountRegistration(props) {
  const [financialAccount, onFinancialAccountChanged] = useStateIfMounted({
    financial_name: "test",
  });
  const [financialName, onFinancialNameChanged] = useStateIfMounted("");
  const [branchName, onBranchNameChanged] = useStateIfMounted("");
  const [accountType, onAccountTypeChanged] = useStateIfMounted("1");
  const [accountNumber, onAccountNumberChanged] = useStateIfMounted("");
  const [accountHolder, onAccountHolderChanged] = useStateIfMounted("");
  const [bankCode, onBankCodeChanged] = useStateIfMounted("");
  const [branchCode, onBranckCodeChanged] = useStateIfMounted("");
  const [loaded, onLoaded] = useStateIfMounted("");
  const [user, onUserChanged] = useStateIfMounted({});
  const [financialUrl, setUrl] = useStateIfMounted({});
  const isFocused = useIsFocused();
  React.useEffect(() => {

    InteractionManager.runAfterInteractions(() => {
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

        request
          .get("financial-account/" + userId + "/")
          .then(function (response) {
            console.log(response.data.financialAccount);
            setUrl(response.data.financialAccount.url);
            onFinancialAccountChanged(response.data.financialAccount);
            onBranckCodeChanged(response.data.financialAccount.branch_code);
            onBankCodeChanged(response.data.financialAccount.financial_code);
            onFinancialNameChanged(
              String(response.data.financialAccount.financial_name)
            );
            onBranchNameChanged(
              String(response.data.financialAccount.branch_name)
            );
            onAccountTypeChanged(
              response.data.financialAccount.account_type
                ? response.data.financialAccount.account_type
                : "1"
            );
            console.log(response.data.financialAccount.account_number);
            onAccountNumberChanged(
              String(response.data.financialAccount.account_number)
            );
            onAccountHolderChanged(
              String(response.data.financialAccount.account_name)
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
    <TouchableWithoutFeedback onPress={() => {
      controller.close()
    }}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onBack={() => {
            props.navigation.goBack();
          }}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          text={Translate.t("bankAccount")}
        />
        <CustomSecondaryHeader outUser={user} props={props}
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
                onFocus={() => controller.close()}
                placeholder={Translate.t("bankCode")}
                placeholderTextColor={Colors.deepGrey}
                style={styles.textInput}
                onChangeText={(text) => {
                  onBankCodeChanged(text);
                  if (zenginCode[text]) {
                    onFinancialNameChanged(zenginCode[text]["name"]);
                  } else {
                    onFinancialNameChanged("");
                  }
                }}
                value={bankCode}
                maxLength={4}
              ></TextInput>

              <TextInput
                onFocus={() => controller.close()}
                placeholder={Translate.t("financialInstitutionName")}
                placeholderTextColor={Colors.deepGrey}
                editable={false}
                style={styles.textInput}
                onChangeText={(text) => onFinancialNameChanged(text)}
                value={financialName}
              ></TextInput>
              <TextInput
                onFocus={() => controller.close()}
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
                    } else {
                      onBranchNameChanged("");
                    }
                  }
                }}
                value={branchCode}
                maxLength={3}
              ></TextInput>
              <TextInput
                onFocus={() => controller.close()}
                placeholder={Translate.t("branchName")}
                placeholderTextColor={Colors.deepGrey}
                style={styles.textInput}
                editable={false}
                onChangeText={(text) => onBranchNameChanged(text)}
                value={branchName}
              ></TextInput>
              {/* {alert.warning(accountType)} */}
              <DropDownPicker
                controller={(instance) => {
                  controller = instance;
                }}
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
                defaultValue={String(accountType) ? String(accountType) : "1"}
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
                dropDownStyle={{ backgroundColor: "white" }}
                onChangeItem={(item) => {
                  if (item) {
                    onAccountTypeChanged(item.value);
                  }
                }}
              />
              <TextInput
                onFocus={() => controller.close()}
                maxLength={7}
                placeholder={Translate.t("accountNumber")}
                placeholderTextColor={Colors.deepGrey}
                style={styles.textInput}
                onChangeText={(text) => {
                  onAccountNumberChanged(String(text).replace(/[^0-9]/g, ""))
                }}
                value={accountNumber}
              ></TextInput>
              <TextInput
                onFocus={() => controller.close()}
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
                    if (!accountType) {
                      onAccountTypeChanged("1");
                    } else if (
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

                        if (financialUrl) {
                          request
                            .patch(financialUrl, {
                              financial_name: financialName,
                              account_type: accountType,
                              branch_code: branchCode,
                              branch_name: branchName,
                              account_number: accountNumber,
                              account_name: accountHolder,
                              financial_code: bankCode,
                            })
                            .then(function (response) {
                              onAccountHolderChanged("");
                              onAccountNumberChanged("");
                              onBranchNameChanged("");
                              onFinancialNameChanged("");
                              onAccountTypeChanged("");
                              if(props.route.params.register && props.route.params.authority == "store"){
                                props.navigation.navigate("AccountExamination", {
                                  "authority" : props.route.params.authority
                                })
                              } else if (props.route.params.authority != "store") {
                                props.navigation.reset({
                                  index: 0,
                                  routes: [{ name: "HomeStore" }],
                                });
                                }
                                else {
                                  props.navigation.goBack();
                                }
                            })
                            .catch(function (error) {
                              alert.warning(
                                error.response.data[
                                  Object.keys(error.response.data)[0]
                                ][0]
                              );
                              onLoaded(true);
                            });
                        } else {
                          request
                            .post("financial_account/", {
                              user: url.replace("testserver", "127.0.0.1:8000"),
                              financial_name: financialName,
                              account_type: accountType,
                              branch_code: branchCode,
                              branch_name: branchName,
                              account_number: accountNumber,
                              account_name: accountHolder,
                              financial_code: bankCode,
                            })
                            .then(function (response) {
                              onAccountHolderChanged("");
                              onAccountNumberChanged("");
                              onBranchNameChanged("");
                              onFinancialNameChanged("");
                              onAccountTypeChanged("");
                              if(props.route.params.register && props.route.params.authority == "store"){
                                props.navigation.navigate("AccountExamination", {
                                  "authority" : props.route.params.authority
                                })
                              }  else if (props.route.params.authority != "store") {
                                props.navigation.reset({
                                  index: 0,
                                  routes: [{ name: "HomeStore" }],
                                });
                                }
                                else {
                                  props.navigation.goBack();
                                }
                            })
                            .catch(function (error) {
                              alert.warning(
                                error.response.data[
                                  Object.keys(error.response.data)[0]
                                ][0]
                              );
                              onLoaded(true);
                            });
                        }
                      });
                    } else {
                      alert.warning(Translate.t("fieldNotFilled"));
                    }
                  } else {
                    alert.warning(Translate.t("invalidAccountNumber"));
                  }
                }}
              >
                <View style={styles.saveButtonContainer}>
                  <Text style={styles.saveButtonText}>
                    {Translate.t("save")}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
