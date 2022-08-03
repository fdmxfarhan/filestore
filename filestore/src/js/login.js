var fs = require('fs');
var path = require('path');
var api = require('./api');
var genKey = require('./generateCode');
var loginButton = document.getElementById('login-button');
var logoutButton = document.getElementById('logout');
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
var generateAndSaveKey = () => {
    var filePath = path.join(pathName, 'key.json');
    var keyData = {key: genKey(10)};
    fs.writeFile(filePath, JSON.stringify(keyData), (err) => {
        fetch(api + `setLoginKey?key=${keyData.key}&username=${username}&password=${password}`)
            .then(data => {
                if(data.status == 'ok') console.log('key is set');
                else console.log('key was not set');
            })
            .catch(err => console.log(err));
        if(err) console.log(err);
    });
}
var readKey = async () => {
    await fs.readFile(path.join(pathName, 'key.json'), (err, rawdata) => {
        if(rawdata){
            var data = JSON.parse(rawdata);
            console.log(data)
            return data.key;
        }
        else return '';
    });
}
var showError = (text) => {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = text;
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 3000);
}
var checkLogin = () => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    fs.readFile(path.join(pathName, 'key.json'), (err, rawdata) => {
        var key = '';
        if(rawdata){
            var data = JSON.parse(rawdata);
            key = data.key;
        }
        console.log(key)
        fetch(api + `login?username=${username}&password=${password}&key=${key}`)
            .then(res => res.json())
            .then(data => {
                if(data.correct == true){
                    if(data.keyQualified == true){
                        saveEstate(username, password, data.estate);
                        generateAndSaveKey();
                        document.getElementById('login-frame').classList.add('hidden');
                        document.getElementById('home-frame').classList.remove('hidden');
                        successMsg.classList.remove('hidden');
                        successMsg.textContent = 'خوش آمدید';
                        document.getElementById('fullname').textContent = data.estate.name;
                        document.getElementById('address').textContent = data.estate.address;
                        document.getElementById('estate-code').textContent = data.estate.code;
                        document.getElementById('estate-number').textContent = data.estate.area;
                        setTimeout(() => {
                            successMsg.classList.add('hidden');
                        }, 3000);
                    }
                    else{
                        showError('کاربر دیگری قبلا با حساب شما وارد شده.');
                    }
                }
                else{
                    showError('کد املاک/کلمه عبور یافت نشد');
                }
            }).catch(err => {showError('خطای اتصال به اینترنت')});
    });
}
loginButton.addEventListener('click', checkLogin);
logoutButton.addEventListener('click', () => {
    var file = path.join(pathName, 'estate.json');
    fs.unlink(file, () => {
        document.getElementById('home-frame').classList.add('hidden');
        document.getElementById('login-frame').classList.remove('hidden');
    })
});