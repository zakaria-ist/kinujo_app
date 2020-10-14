import axios from 'axios'
import {
  Alert
} from "react-native";

class CustomAlert{
    async warning(text){
        Alert.alert(
            "Warning",
            text,
            [
              { text: "OK"}
            ],
            { cancelable: false }
          )
    }
} 

export default CustomAlert;