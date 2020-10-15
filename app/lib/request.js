import axios from "axios";

const base = "http://127.0.0.1:8000/api/";
class Request {
  async get(url, params) {
    url = url.replace("testserver", "127.0.0.1:8000");
    return axios.get((url.indexOf(base) != -1 ? "" : base) + url, {
      params: params,
    });
  }

  async post(url, params) {
    url = url.replace("testserver", "127.0.0.1:8000");
    return axios.post((url.indexOf(base) != -1 ? "" : base) + url, params);
  }

  async put(url, params) {
    url = url.replace("testserver", "127.0.0.1:8000");
    return axios.put((url.indexOf(base) != -1 ? "" : base) + url, params);
  }
  async patch(url, params) {
    url = url.replace("testserver", "127.0.0.1:8000");
    return axios.patch((url.indexOf(base) != -1 ? "" : base) + url, params);
  }
}

export default Request;
