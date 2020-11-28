import axios from "axios";

// const base = "kinujo-develop.c2sg.asia";
const base = "kinujo-demo.c2sg.asia";
// const base = "http://192.168.0.107:8000";
let api = "https://" + base + "/api/";
let httpApi = "http://" + base + "/api/";

class Request {
  async getUrl(){
    return base.replace("api/", "");
  }

  async get(url, params) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    return axios.get(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, {
      params: params,
    });
  }

  async post(url, params, headers = {}) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    return axios.post(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: headers
    })
  }

  async delete(url, params) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    return axios.delete(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params, {
      headers: {
      }
    })
  }

  async put(url, params) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    return axios.put(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params);
  }
  async patch(url, params) {
    url = url.replace("testserver", base.replace("http://", "").replace("https://", ""));
    url = url.replace("http://", "https://");
    return axios.patch(((url.indexOf(api) != -1 || url.indexOf(httpApi) != -1) ? "" : api) + url, params);
  }
}

export default Request;
