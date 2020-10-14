import axios from 'axios'

const base = "http://127.0.0.1:8000/api/"
class Request{
    async get(url, params){
        return axios.get(base + url, {
            params: params
        });
    }

    async post(url, params){
        return axios.post(base + url, params);
    }
} 

export default Request;