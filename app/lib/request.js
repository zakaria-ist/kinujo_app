import axios from "axios";
import * as Localization from "expo-localization";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const base = "kinujo-release.c2sg.asia";
// const base = "kinujo-develop.c2sg.asia";
// const base = "http://192.168.0.107:8000";
let payment = "https://" + base + "/payments/";
let api = "https://" + base + "/api/";
let httpApi = "http://" + base + "/api/";

class Request {
  async getUrl() {
    return base.replace("api/", "");
  }

  getApiUrl(){
    return api;
  }

  getPaymentUrl(){
    return payment;
  }

  async get(url, params, headers = {}) {
    url = url.replace(
      "testserver",
      base.replace("http://", "").replace("https://", "")
    );
    url = url.replace("http://", "https://");
    headers["Accept-Language"] = Localization.locale;
    return axios.get(
      (url.indexOf(api) != -1 || url.indexOf(httpApi) != -1 ? "" : api) + url,
      {
        params: params,
        headers: headers,
      }
    );
  }

  async post(url, params, headers = {}) {
    url = url.replace(
      "testserver",
      base.replace("http://", "").replace("https://", "")
    );
    url = url.replace("http://", "https://");
    headers["Accept-Language"] = Localization.locale;
    return axios.post(
      (url.indexOf(api) != -1 || url.indexOf(httpApi) != -1 ? "" : api) + url,
      params,
      {
        headers: headers,
      }
    );
  }

  async delete(url, params, headers = {}) {
    url = url.replace(
      "testserver",
      base.replace("http://", "").replace("https://", "")
    );
    url = url.replace("http://", "https://");
    headers["Accept-Language"] = Localization.locale;
    return axios.delete(
      (url.indexOf(api) != -1 || url.indexOf(httpApi) != -1 ? "" : api) + url,
      params,
      {
        headers: headers,
      }
    );
  }

  async put(url, params, headers = {}) {
    url = url.replace(
      "testserver",
      base.replace("http://", "").replace("https://", "")
    );
    url = url.replace("http://", "https://");
    headers["Accept-Language"] = Localization.locale;
    return axios.put(
      (url.indexOf(api) != -1 || url.indexOf(httpApi) != -1 ? "" : api) + url,
      params,
      {
        headers: headers,
      }
    );
  }
  async patch(url, params, headers = {}) {
    url = url.replace(
      "testserver",
      base.replace("http://", "").replace("https://", "")
    );
    url = url.replace("http://", "https://");
    headers["Accept-Language"] = Localization.locale;
    return axios.patch(
      (url.indexOf(api) != -1 || url.indexOf(httpApi) != -1 ? "" : api) + url,
      params,
      {
        headers: headers,
      }
    );
  }

  async addFriend(userId, friendId) {
    let customer = await db.collection('users').doc(String(userId)).collection("customers").doc(String(friendId)).get();
    if(customer && customer.data()){
      db.collection("users")
      .doc(String(userId))
      .collection("customers")
      .doc(String(friendId))
      .set(
        {
          blockMode: false,
          secretMode: false
        },
        {
          merge: true,
        }
      );
    }

    db.collection("users")
      .doc(String(userId))
      .collection("friends")
      .where("id", "==", String(friendId))
      .get()
      .then((snapshot) => {
        if (snapshot && snapshot.size > 0) {
          snapshot.forEach((docRef) => {
            db.collection("users")
              .doc(String(userId))
              .collection("friends")
              .doc(docRef.id)
              .set(
                {
                  delete: false,
                  cancel: false,
                },
                {
                  merge: true,
                }
              );
          });
        } else {
          db.collection("users")
            .doc(String(userId))
            .collection("friends")
            .add({
              type: "user",
              id: String(friendId),
            });
        }
      });
  }

  async displayError(error){
    if (
      error &&
      error.response &&
      error.response.data &&
      Object.keys(error.response.data).length > 0
    ) {
      let tmpErrorMessage =
        error.response.data[
          Object.keys(error.response.data)[0]
        ][0] +
        "(" +
        Object.keys(error.response.data)[0] +
        ")";
      // alert.warning(tmpErrorMessage);
      let errorMessage = String(
        tmpErrorMessage.split("(").pop()
      );
      alert.warning(Translate.t("(" + errorMessage));
    } else if (callingCode == "") {
      alert.warning(Translate.t("callingCode"));
    }
  }
}

export default Request;
