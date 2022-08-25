import axios from 'axios';

// url = "http://192.168.56.148:3000";
url = "https://fileestore.ir";

api = axios.create({
    baseURL: url,
    timeout: 5000,
})

module.exports = api;
