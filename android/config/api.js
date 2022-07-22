import axios from 'axios';

// url = "http://192.168.152.148:3000";
url = "http://fileestore.ir";

api = axios.create({
    baseURL: url,
    timeout: 5000,
})

module.exports = api;
