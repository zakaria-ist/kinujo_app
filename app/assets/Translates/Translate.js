import React from "react";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-community/async-storage";
import en from "./english.json";
import ja from "./japanese.json";

AsyncStorage.getItem("language").then((language) => {
  if (language) {
    i18n.locale = language;
  } else {
    i18n.locale = Localization.locale;
  }
});

// Set the key-value pairs for the different languages you want to support.

i18n.translations = {
  en,
  ja,
};
// Set the locale once at the beginning of your app.

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default i18n;
