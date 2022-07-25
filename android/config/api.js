import axios from 'axios';

// url = "http://172.26.227.238:3000";
url = "https://fileestore.ir";

api = axios.create({
    baseURL: url,
    timeout: 5000,
})

module.exports = api;
