import axios from "axios";
import * as Localization from "expo-localization";

<<<<<<< HEAD
const base = "kinujo-release.c2sg.asia";
// const base = "kinujo-demo.c2sg.asia";
=======
const base = "kinujo-develop.c2sg.asia";
// const base = "kinujo-release.c2sg.asia";
>>>>>>> origin/develop
// const base = "http://192.168.0.107:8000";
let api = "https://" + base + "/api/";
let httpApi = "http://" + base + "/api/";

class Request {
  async getUrl(){
    return base.replace("api/", "");
  }

  async get(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    headers['Accept-Language'] = Localization.locale
    return axios.get(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, {
      params: params,
      headers: headers
    });
  }

  async post(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    headers['Accept-Language'] = Localization.locale
    return axios.post(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: headers
    })
  }

  async delete(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    headers['Accept-Language'] = Localization.locale
    return axios.delete(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: headers
    })
  }

  async put(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    headers['Accept-Language'] = Localization.locale
    return axios.put(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: headers
    })
  }
  async patch(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    headers['Accept-Language'] = Localization.locale
    return axios.patch(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: headers
    })
  }
}

export default Request;
