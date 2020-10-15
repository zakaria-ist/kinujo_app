import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import LoginScreen from "../Screens/LoginScreen";
import RegistrationGeneral from "../Screens/RegistrationGeneral";
import RegistrationStore from "../Screens/RegistrationStore";
import SMSAuthentication from "../Screens/SMSAuthentication";
import AccountExamination from "../Screens/AccountExamination";
import PasswordReset from "../Screens/PasswordReset";
import PasswordResetCompletion from "../Screens/PasswordResetCompletion";
import TermsOfCondition from "../Screens/TermsOfCondition";
import StoreAccountSelection from "../Screens/StoreAccountSelection";
import BankAccountRegistration from "../Screens/BankAccountRegistration";
import RegisterCompletion from "../Screens/RegisterCompletion";

const screens = {
  LoginScreen: {
    screen: LoginScreen,
  },
  RegistrationGeneral: {
    screen: RegistrationGeneral,
  },
  RegistrationStore: {
    screen: RegistrationStore,
  },
  SMSAuthentication: {
    screen: SMSAuthentication,
  },
  AccountExamination: {
    screen: AccountExamination,
  },
  PasswordReset: {
    screen: PasswordReset,
  },
  PasswordResetCompletion: {
    screen: PasswordResetCompletion,
  },
  RegisterCompletion: {
    screen: RegisterCompletion,
  },
  TermsOfCondition: {
    screen: TermsOfCondition,
  },
  StoreAccountSelection: {
    screen: StoreAccountSelection,
  },
  BankAccountRegistration: {
    screen: BankAccountRegistration,
  },
};

const LoginStack = createStackNavigator(screens, {
  headerMode: "none",
});

export default createAppContainer(LoginStack);
