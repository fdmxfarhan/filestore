var fs = require('fs');
var path = require('path');
var loginButton = document.getElementById('login-button');
var successMsg = document.getElementById('success-msg');
var errorMsg = document.getElementById('error-msg');

var pathName = path.join(__dirname, '../files');

var saveEstate = (username, password, estate) => {
    var file = path.join(pathName, 'estate.json');
    var estateInfo = {username, password, estate};
    fs.writeFile(file, JSON.stringify(estateInfo), (err) => {
        if(err) console.log(err);
    })
}

var checkLogin = async() => {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    await fetch(`http://192.168.229.96:3000/api/login?username=${username}&password=${password}`)
        .then(res => res.json())
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
                errorMsg.classList.remove('hidden');
                errorMsg.textContent = 'کد املاک/کلمه عبور یافت نشد';
                setTimeout(() => {
                    errorMsg.classList.add('hidden');
                }, 3000);
            }
        });
}

loginButton.addEventListener('click', checkLogin);