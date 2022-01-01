var fs = require('fs');
var path = require('path');
var api = require('./api');
var loginButton = document.getElementById('login-button');
var successMsg = document.getElementById('success-msg');
var errorMsg = document.getElementById('error-msg');

var pathName = path.join(__dirname, '../files');

fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
    if(rawdata){
        document.getElementById('home-frame').classList.remove('hidden');
    }
    else document.getElementById('login-frame').classList.remove('hidden');
});

var saveEstate = (username, password, estate) => {
    var file = path.join(pathName, 'estate.json');
    var estateInfo = {username, password, estate};
    fs.writeFile(file, JSON.stringify(estateInfo), (err) => {
        if(err) console.log(err);
    })
}
var showError = (text) => {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = text;
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 3000);
}
var checkLogin = async() => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    await fetch(api + `login?username=${username}&password=${password}`)
        .then(res => res.json())
        // .catch(err => {showError('خطای اتصال به اینترنت')})
        .then(data => {
            if(data.correct == true){
                saveEstate(username, password, data.estate);
                document.getElementById('login-frame').classList.add('hidden');
                document.getElementById('home-frame').classList.remove('hidden');
                successMsg.classList.remove('hidden');
                successMsg.textContent = 'خوش آمدید';
                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 3000);
            }
            else{
                showError('کد املاک/کلمه عبور یافت نشد');
            }
        }).catch(err => {showError('خطای اتصال به اینترنت')});
}

loginButton.addEventListener('click', checkLogin);