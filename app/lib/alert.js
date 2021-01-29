import axios from "axios";
import { Alert } from "react-native";
import Translate from "../assets/Translates/Translate";
class CustomAlert {
  async warning(text, func) {
    if (func) {
      Alert.alert(
        Translate.t("warning"),
        text,
        [
          {
            text: Translate.t("ok"),
            onPress: () => {
              func();
            },
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        Translate.t("warning"),
        text,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  async ask(text, func) {
    Alert.alert(
      Translate.t("warning"),
      text,
      [
        {
          text: Translate.t("ok"),
          onPress: () => {
            func();
          },
        },
        {
          text: Translate.t("cancel"),
          onPress: () => {
          },
        },
      ],
      { cancelable: false }
    );
  }
}

export default CustomAlert;
