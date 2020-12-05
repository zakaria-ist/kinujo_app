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
            text: "OK",
            onPress: () => {
              func();
            },
          },
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

  async prompt() {
    Alert.alert("test", <View></View>);
  }
}

export default CustomAlert;
