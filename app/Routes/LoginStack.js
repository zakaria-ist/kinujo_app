import { View, TouchableWithoutFeedback } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";
import LoginScreen from "../Screens/LoginScreen";
import SearchProducts from "../Screens/SearchProducts";
import RegistrationGeneral from "../Screens/RegistrationGeneral";
import RegistrationStore from "../Screens/RegistrationStore";
import SMSAuthentication from "../Screens/SMSAuthentication";
import AccountExamination from "../Screens/AccountExamination";
import Payment from "../Screens/Payment";
import PasswordReset from "../Screens/PasswordReset";
import PasswordResetCompletion from "../Screens/PasswordResetCompletion";
import TermsOfCondition from "../Screens/TermsOfCondition";
import StoreAccountSelection from "../Screens/StoreAccountSelection";
import BankAccountRegistrationOption from "../Screens/BankAccountRegistrationOption";
import RegisterCompletion from "../Screens/RegisterCompletion";
import HomeGeneral from "../Screens/HomeGeneral";
import HomeStoreList from "../Screens/HomeStoreList";
import ChatScreen from "../Screens/ChatScreen";
import FolderContactList from "../Screens/FolderContactList";
import ReceiptView from "../Screens/ReceiptView";
import ReceiptEditing from "../Screens/ReceiptEditing";
import QRCode from "../Screens/QRCode";
import SettingGeneral from "../Screens/SettingGeneral";
import SettingStore from "../Screens/SettingStore";
import Setting from "../Screens/Setting";
import SellerProductList from "../Screens/SellerProductList";
import ProfileEditingGeneral from "../Screens/ProfileEditingGeneral";
import ProfileEditingStore from "../Screens/ProfileEditingStore";
import ExhibitedProductList from "../Screens/ExhibitedProductList";
import PurchaseHistory from "../Screens/PurchaseHistory";
import CustomerList from "../Screens/CustomerList";
import CustomerInformation from "../Screens/CustomerInformation";
import BankAccountRegistration from "../Screens/BankAccountRegistration";
import CountrySearch from "../Screens/CountrySearch";
import ProfileInformation from "../Screens/ProfileInformation";
import StoreInformation from "../Screens/StoreInformation";
import ShippingList from "../Screens/ShippingList";
import PurchaseHistoryDetails from "../Screens/PurchaseHistoryDetails";
import SalesManagement from "../Screens/SalesManagement";
import SalesManagementBottom from "../Screens/SalesManagementBottom";
import Cart from "../Screens/Cart";
import Favorite from "../Screens/Favorite";
import MemoEdit from "../Screens/MemoEdit";
import App from "../../App";
import AdvanceSetting from "../Screens/AdvanceSetting";
import PurchaseCompletion from "../Screens/PurchaseCompletion";
import ProductInformationAdd from "../Screens/ProductInformationAddNew";
import ChatList from "../Screens/ChatList";
import ChatListForward from "../Screens/ChatListForward";
import HomeByCategory from "../Screens/HomeByCategory";
import Contact from "../Screens/Contact";
import HomeShop from "../Screens/HomeShop";
import AdressManagement from "../Screens/AdressManagement";
import ContactSearch from "../Screens/ContactSearch";
import GroupChatCreation from "../Screens/GroupChatCreation";
import GroupChatMember from "../Screens/GroupChatMember";
import FriendSearch from "../Screens/FriendSearch";
import CreateFolder from "../Screens/CreateFolder";
import FolderMemberSelection from "../Screens/FolderMemberSelection";
import GroupFolderCreateCompletion from "../Screens/GroupFolderCreateCompletion";
import ContactShare from "../Screens/ContactShare";
import ProductInformationAddNew from "../Screens/ProductInformationAddNew";
import ChatContact from "../Screens/ChatContact";
import FavoriteChat from "../Screens/FavoriteChat";
import ProductList from "../Screens/ProductList";
// import KinujoStripeCheckout from "../Screens/KinujoStripeCheckout";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Image } from "react-native";
import CustomAlert from "../lib/alert";
const alert = new CustomAlert();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomerInformationDetails from "../Screens/CustomerInformationDetails";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import HomeLogo from "../assets/icons/home.svg";
import PersonLogo from "../assets/icons/bottomPerson.svg";
import ChatLogo from "../assets/icons/chat.svg";
import QRCodeLogo from "../assets/icons/qrcode.svg";
import SettingLogo from "../assets/icons/setting.svg";
import StarLogo from "../assets/icons/star.svg";
import Request from "../lib/request";
import MoneyLogo from "../assets/icons/money.svg";
import { EventRegister } from 'react-native-event-listeners';
import Translate from "../assets/Translates/Translate";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";

const request = new Request();
let lastRoute = "";

function BottomNavigationGeneral(props) {
  if (props && props.route && props.route.state) {
    if(lastRoute != props.route.state.routeNames[props.route.state.index]){
      AsyncStorage.getItem("user").then(function (url) {
        request
          .get(url)
          .then(function (response) {
            console.log(response.data)
            if(response.data.is_approved && response.data.is_seller){
              alert.warning(Translate.t("account_approved"), ()=>{
                // props.navigation.navigate("HomeStore");
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: "HomeStore" }],
                });
              })
            }
          })
        })
      lastRoute = props.route.state.routeNames[props.route.state.index];
    }
  }
  let isShow = false;

  if (props && props.route && props.route.state) {
    isShow =
      props.route.state.routeNames[props.route.state.index] == "Chat" ||
      props.route.state.routeNames[props.route.state.index] == "ChatScreen" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupChatMember" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupChatCreation" ||
      props.route.state.routeNames[props.route.state.index] ==
        "FolderMemberSelection" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupFolderCreateCompletion" ||
      props.route.state.routeNames[props.route.state.index] == "CreateFolder" ||
      props.route.state.routeNames[props.route.state.index] == "FavoriteChat";
  }
  if (isShow) {
    return (
      <Tab.Navigator
        initialRouteName="HomeGeneral"
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          activeTintColor: "#e91e63",
        }}
      >
        <Tab.Screen
          name="HomeGeneral"
          component={HomeGeneral}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: () => <HomeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ContactStore"
          component={Contact}
          options={{
            tabBarLabel: "Contact",
            tabBarIcon: () => <PersonLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatList}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: () => <ChatLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="FavoriteChat"
          component={FavoriteChat}
          options={{
            tabBarLabel: "FavoriteChat",
            tabBarIcon: () => <StarLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarLabel: "QRCode",
            tabBarIcon: () => <QRCodeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="SettingGeneral"
          component={SettingGeneral}
          options={{
            tabBarLabel: "Setting",
            tabBarIcon: () => <SettingLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SellerProductList"
          component={SellerProductList}
        />
        <Tab.Screen
          name="ShippingList"
          component={ShippingList}
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductList"
          component={ProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeShop"
          component={HomeShop}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatListForward"
          component={ChatListForward}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingGeneral"
          component={ProfileEditingGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeStoreList"
          component={HomeStoreList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerList"
          component={CustomerList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="App"
          component={App}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistory"
          component={PurchaseHistory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Setting"
          component={Setting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformation"
          component={CustomerInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformationDetails"
          component={CustomerInformationDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="StoreInformation"
          component={StoreInformation}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Cart"
          component={Cart}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Favorite"
          component={Favorite}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="MemoEdit"
          component={MemoEdit}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdvanceSetting"
          component={AdvanceSetting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAddNew"
          component={ProductInformationAddNew}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAdd"
          component={ProductInformationAdd}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatList"
          component={ChatList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactGeneral"
          component={BottomNavigationGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactSearch"
          component={ContactSearch}
        />
        {/* <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatScreen"
          component={ChatScreen}
        /> */}
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FriendSearch"
          component={FriendSearch}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatCreation"
          component={GroupChatCreation}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CreateFolder"
          component={CreateFolder}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatMember"
          component={GroupChatMember}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdressManagement"
          component={AdressManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptView"
          component={ReceiptView}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptEditing"
          component={ReceiptEditing}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SearchProducts"
          component={SearchProducts}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Payment"
          component={Payment}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderContactList"
          component={FolderContactList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatContact"
          component={ChatContact}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeByCategory"
          component={HomeByCategory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseCompletion"
          component={PurchaseCompletion}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistoryDetails"
          component={PurchaseHistoryDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupFolderCreateCompletion"
          component={GroupFolderCreateCompletion}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        initialRouteName="HomeStore"
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          activeTintColor: "#e91e63",
        }}
        backBehavior="history"
      >
        <Tab.Screen
          name="HomeStore"
          component={HomeGeneral}
          options={{
            unmountOnBlur: true,
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Home",
            tabBarIcon: () => <HomeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ContactStore"
          component={Contact}
          options={{
            unmountOnBlur: true,
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Contact",
            tabBarIcon: () => <PersonLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeStoreList"
          component={HomeStoreList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SellerProductList"
          component={SellerProductList}
        />
        <Tab.Screen
          name="Chat"
          component={ChatList}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Chat",
            tabBarIcon: () => <ChatLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatCreation"
          component={GroupChatCreation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductList"
          component={ProductList}
        />
        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "QRCode",
            tabBarIcon: () => <QRCodeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="SettingGeneral"
          component={SettingGeneral}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Setting",
            tabBarIcon: () => <SettingLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ShippingList"
          component={ShippingList}
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeShop"
          component={HomeShop}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatListForward"
          component={ChatListForward}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingGeneral"
          component={ProfileEditingGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingStore"
          component={ProfileEditingStore}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerList"
          component={CustomerList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="App"
          component={App}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistory"
          component={PurchaseHistory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Setting"
          component={Setting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformation"
          component={CustomerInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformationDetails"
          component={CustomerInformationDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="StoreInformation"
          component={StoreInformation}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Cart"
          component={Cart}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Favorite"
          component={Favorite}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="MemoEdit"
          component={MemoEdit}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdvanceSetting"
          component={AdvanceSetting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAddNew"
          component={ProductInformationAddNew}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAdd"
          component={ProductInformationAdd}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatList"
          component={ChatList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactGeneral"
          component={BottomNavigationGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactSearch"
          component={ContactSearch}
        />
        {/* <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatScreen"
          component={ChatScreen}
        /> */}
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FriendSearch"
          component={FriendSearch}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CreateFolder"
          component={CreateFolder}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatMember"
          component={GroupChatMember}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdressManagement"
          component={AdressManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptView"
          component={ReceiptView}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptEditing"
          component={ReceiptEditing}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SearchProducts"
          component={SearchProducts}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Payment"
          component={Payment}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderContactList"
          component={FolderContactList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatContact"
          component={ChatContact}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeByCategory"
          component={HomeByCategory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseCompletion"
          component={PurchaseCompletion}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistoryDetails"
          component={PurchaseHistoryDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupFolderCreateCompletion"
          component={GroupFolderCreateCompletion}
        />
      </Tab.Navigator>
    );
  }
}

class CustomTabButton extends React.Component {
  render() {
    const {
      onPress,
      onLongPress,
      show,
      accessibilityLabel,
      ...props
    } = this.props;

    if (!show) return null;

    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onLongPress={onLongPress}
        hitSlop={{ left: 15, right: 15, top: 5, bottom: 5 }}
        accessibilityLabel={accessibilityLabel}
      >
        <View {...props} />
      </TouchableWithoutFeedback>
    );
  }
}

function BottomNavigationStore(props) {
  let isShow = false;
  if (props && props.route && props.route.state) {
    // alert.warning(props.route.state.routeNames[props.route.state.index]);
    isShow =
      props.route.state.routeNames[props.route.state.index] == "Chat" ||
      props.route.state.routeNames[props.route.state.index] == "ChatScreen" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupChatMember" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupChatCreation" ||
      props.route.state.routeNames[props.route.state.index] ==
        "FolderMemberSelection" ||
      props.route.state.routeNames[props.route.state.index] ==
        "GroupFolderCreateCompletion" ||
      props.route.state.routeNames[props.route.state.index] == "CreateFolder" ||
      props.route.state.routeNames[props.route.state.index] == "FavoriteChat";
  }
  if (isShow) {
    return (
      <Tab.Navigator
        initialRouteName="HomeStore"
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          activeTintColor: "#e91e63",
        }}
      >
        <Tab.Screen
          name="HomeStore"
          component={HomeGeneral}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: () => <HomeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ContactStore"
          component={Contact}
          options={{
            tabBarLabel: "Contact",
            tabBarIcon: () => <PersonLogo width={25} height={25} />,
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatList}
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: () => <ChatLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeStoreList"
          component={HomeStoreList}
        />
        <Tab.Screen
          name="FavoriteChat"
          component={FavoriteChat}
          options={{
            tabBarLabel: "FavoriteChat",
            tabBarIcon: () => <StarLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarLabel: "QRCode",
            tabBarIcon: () => <QRCodeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="SettingStore"
          component={SettingStore}
          options={{
            tabBarLabel: "Setting",
            tabBarIcon: () => <SettingLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ShippingList"
          component={ShippingList}
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeShop"
          component={HomeShop}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatListForward"
          component={ChatListForward}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingGeneral"
          component={ProfileEditingGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingStore"
          component={ProfileEditingStore}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerList"
          component={CustomerList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="App"
          component={App}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistory"
          component={PurchaseHistory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Setting"
          component={Setting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SellerProductList"
          component={SellerProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductList"
          component={ProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformation"
          component={CustomerInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformationDetails"
          component={CustomerInformationDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="StoreInformation"
          component={StoreInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SalesManagement"
          component={SalesManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Cart"
          component={Cart}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Favorite"
          component={Favorite}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="MemoEdit"
          component={MemoEdit}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdvanceSetting"
          component={AdvanceSetting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAddNew"
          component={ProductInformationAddNew}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAdd"
          component={ProductInformationAdd}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatList"
          component={ChatList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactGeneral"
          component={BottomNavigationGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactSearch"
          component={ContactSearch}
        />
        {/* <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatScreen"
          component={ChatScreen}
        /> */}
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FriendSearch"
          component={FriendSearch}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatCreation"
          component={GroupChatCreation}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CreateFolder"
          component={CreateFolder}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatMember"
          component={GroupChatMember}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdressManagement"
          component={AdressManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptView"
          component={ReceiptView}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptEditing"
          component={ReceiptEditing}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SearchProducts"
          component={SearchProducts}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Payment"
          component={Payment}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderContactList"
          component={FolderContactList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatContact"
          component={ChatContact}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeByCategory"
          component={HomeByCategory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseCompletion"
          component={PurchaseCompletion}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistoryDetails"
          component={PurchaseHistoryDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupFolderCreateCompletion"
          component={GroupFolderCreateCompletion}
        />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        initialRouteName="HomeStore"
        tabBarOptions={{
          showLabel: false,
          showIcon: true,
          activeTintColor: "#e91e63",
        }}
        backBehavior="history"
      >
        <Tab.Screen
          name="HomeStore"
          component={HomeGeneral}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Home",
            tabBarIcon: () => <HomeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="ContactStore"
          component={Contact}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Contact",
            tabBarIcon: () => <PersonLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatList}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Chat",
            tabBarIcon: () => <ChatLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="SalesManagementBottom"
          component={SalesManagementBottom}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "SalesManagementBottom",
            tabBarIcon: () => <MoneyLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatCreation"
          component={GroupChatCreation}
        />
        <Tab.Screen
          name="QRCode"
          component={QRCode}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "QRCode",
            tabBarIcon: () => <QRCodeLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          name="SettingStore"
          component={SettingStore}
          options={{
            tabBarButton: (props) => <CustomTabButton show={true} {...props} />,
            tabBarLabel: "Setting",
            tabBarIcon: () => <SettingLogo width={25} height={25} />,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeStoreList"
          component={HomeStoreList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SellerProductList"
          component={SellerProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductList"
          component={ProductList}
        />
        <Tab.Screen
          name="ShippingList"
          component={ShippingList}
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeShop"
          component={HomeShop}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatListForward"
          component={ChatListForward}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingGeneral"
          component={ProfileEditingGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileEditingStore"
          component={ProfileEditingStore}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerList"
          component={CustomerList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="App"
          component={App}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistory"
          component={PurchaseHistory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Setting"
          component={Setting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformation"
          component={CustomerInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CustomerInformationDetails"
          component={CustomerInformationDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProfileInformation"
          component={ProfileInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="StoreInformation"
          component={StoreInformation}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SalesManagement"
          component={SalesManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Cart"
          component={Cart}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Favorite"
          component={Favorite}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="MemoEdit"
          component={MemoEdit}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdvanceSetting"
          component={AdvanceSetting}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAddNew"
          component={ProductInformationAddNew}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ProductInformationAdd"
          component={ProductInformationAdd}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatList"
          component={ChatList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactGeneral"
          component={BottomNavigationGeneral}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ContactSearch"
          component={ContactSearch}
        />
        {/* <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatScreen"
          component={ChatScreen}
        /> */}
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FriendSearch"
          component={FriendSearch}
        />

        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="CreateFolder"
          component={CreateFolder}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupChatMember"
          component={GroupChatMember}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="AdressManagement"
          component={AdressManagement}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptView"
          component={ReceiptView}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ReceiptEditing"
          component={ReceiptEditing}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="SearchProducts"
          component={SearchProducts}
          tabBarOptions={{
            keyboardHidesTabBar: true,
          }}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="Payment"
          component={Payment}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderContactList"
          component={FolderContactList}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="ChatContact"
          component={ChatContact}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="HomeByCategory"
          component={HomeByCategory}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseCompletion"
          component={PurchaseCompletion}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="PurchaseHistoryDetails"
          component={PurchaseHistoryDetails}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        />
        <Tab.Screen
          options={{
            tabBarButton: (props) => (
              <CustomTabButton show={false} {...props} />
            ),
          }}
          name="GroupFolderCreateCompletion"
          component={GroupFolderCreateCompletion}
        />
      </Tab.Navigator>
    );
  }
}

const linking = {
  prefixes: [
    'net.c2sg.kinujo://',
  ],
  config: {
    // screens: {
    //   HomeStore: {
    //     screens: {
    //       Cart: {
    //         path: 'complete/:status/:snapIds/:seller',
    //       },
    //     },
    //   },
      screens: {
        Cart: {
          path: 'cancelled/:status',
        },
      },
      screens: {
        HomeStore: {
          path: 'complete/:status/:snapIds/:seller',
        },
      },
    // },
  },
};

export default function LoginStack() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="CountrySearch" component={CountrySearch}/>
        <Stack.Screen
          name="RegistrationGeneral"
          component={RegistrationGeneral}
        />
        <Stack.Screen name="RegistrationStore" component={RegistrationStore} />
        <Stack.Screen name="SMSAuthentication" component={SMSAuthentication} />
        <Stack.Screen
          name="AccountExamination"
          component={AccountExamination}
        />
        <Stack.Screen name="PasswordReset" component={PasswordReset} />
        <Stack.Screen
          name="PasswordResetCompletion"
          component={PasswordResetCompletion}
        />
        <Stack.Screen
          name="RegisterCompletion"
          component={RegisterCompletion}
        />
        <Stack.Screen name="TermsOfCondition" component={TermsOfCondition} />
        <Stack.Screen
          name="StoreAccountSelection"
          component={StoreAccountSelection}
        />
        <Stack.Screen
          name="BankAccountRegistrationOption"
          component={BankAccountRegistrationOption}
        />
        <Stack.Screen name="HomeGeneral" component={BottomNavigationGeneral} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ContactShare" component={ContactShare} />
        {/* <Stack.Screen name="CreateFolder" component={CreateFolder} />
        <Stack.Screen
          name="FolderMemberSelection"
          component={FolderMemberSelection}
        /> */}
        <Stack.Screen
          name="BankAccountRegistration"
          component={BankAccountRegistration}
        />
        <Stack.Screen name="HomeStore" component={BottomNavigationStore} />
        <Stack.Screen
          name="ProductInformationAddNew"
          component={ProductInformationAddNew}
        />
        <Stack.Screen
          name="ExhibitedProductList"
          component={ExhibitedProductList}
        />
        {/* <Stack.Screen
          name="KinujoStripeCheckout"
          component={KinujoStripeCheckout}
        /> */}
        {/* <Stack.Screen name="HomeStoreList" component={HomeStoreList} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
