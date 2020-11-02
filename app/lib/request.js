import axios from "axios";

const base = "http://192.168.0.107:8000/api/";
class Request {
  async get(url, params) {
    url = url.replace("testserver", "192.168.0.107:8000");
    return axios.get((url.indexOf(base) != -1 ? "" : base) + url, {
      params: params,
    });
  }

  async post(url, params) {
    url = url.replace("testserver", "192.168.0.107:8000");
    return axios.post((url.indexOf(base) != -1 ? "" : base) + url, params, {
      headers: {
      }
    })
  }

  async delete(url, params) {
    url = url.replace("testserver", "192.168.0.107:8000");
    return axios.delete((url.indexOf(base) != -1 ? "" : base) + url, params, {
      headers: {
      }
    })
  }

  async put(url, params) {
    url = url.replace("testserver", "192.168.0.107:8000");
    return axios.put((url.indexOf(base) != -1 ? "" : base) + url, params);
  }
  async patch(url, params) {
    url = url.replace("testserver", "192.168.0.107:8000");
    return axios.patch((url.indexOf(base) != -1 ? "" : base) + url, params);
  }
}

export default Request;
