import axios from 'axios';

// url = "http://192.168.231.148:3000";
url = "https://fileestore.ir";

api = axios.create({
    baseURL: url,
    timeout: 5000,
})

module.exports = api;
