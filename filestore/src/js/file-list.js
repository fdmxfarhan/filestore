const { shell } = require('electron');
var fs = require('fs');
var path = require('path');
var api = require('./api');
var {convertDate, showPrice} = require('./dateConvert');
var pathName = path.join(__dirname, '../files');
var filesContainer = document.getElementById('file-list-container');
var bookmarksContainer = document.getElementById('file-bookmark-container');
var pageNumbersView = document.getElementById('page-numbers-view');
var errorMsg = document.getElementById('error-msg');
var successMsg = document.getElementById('success-msg');
var loadingScreen = document.getElementById('loading-screen');
var cancleButton = document.getElementById('cancle-refresh-btn');
var downloadBar = document.getElementById('download-bar');
var numberSelect = document.getElementById("numberoffilesinpage");
var pageNumberButtons = [
    document.getElementById('filepage-number-0'),
    document.getElementById('filepage-number-1'),
    document.getElementById('filepage-number-2'),
    document.getElementById('filepage-number-3'),
    document.getElementById('filepage-number-4'),
    document.getElementById('filepage-number-5'),
    document.getElementById('filepage-number-6'),
    document.getElementById('filepage-number-7'),
    document.getElementById('filepage-number-8'),
];
var refreshInterval = null;
var udatePlanTime = 1000;
var activeFile = null;
var activeMenu = 'table';
var refreshCancled = false;
var zoom = 1;
var zoomed = false;
var allFiles = [];
var showingFiles = [];
var currentPage = 1;
var numberOfFilesInPage = 30;
// -----search:
var minMetrage = 0, maxMetrage = 300;
var minPrice1 = 100, maxPrice1 = 500;
var minPrice2 = 1, maxPrice2 = 50;
var minAge = 1, maxAge = 30;
var apartment = true;
var vilage = true;
var old = true;
var business = true;
var office = true;
var officeEstate = true;
var land = true;
var mostaghelat = true;
var sell = true;
var presell = true;
var exchange = true;
var cooperate = true;
var rent = true;
var rent2 = true;
var lastSearchText = '';
// ------------

removeAllChildNodes(filesContainer);
var search = () => {
    var text = document.getElementById('address-search').value;
    if(text == '' || text.length < lastSearchText.length) filter();
    filteredFiles = showingFiles;
    showingFiles = [];
    for(var i=0; i<filteredFiles.length; i++){
        var address = '', ownerName = '', phone = '', fileNumber = '', metrage = '';
        if(filteredFiles[i].address)      address = filteredFiles[i].address.toString();
        if(filteredFiles[i].ownerName)    ownerName = filteredFiles[i].ownerName.toString();
        if(filteredFiles[i].phone)        phone = filteredFiles[i].phone.toString();
        if(filteredFiles[i].fileNumber)   fileNumber = filteredFiles[i].fileNumber.toString();
        if(filteredFiles[i].metrage)      metrage = filteredFiles[i].metrage.toString();
        if(address.indexOf(text) != -1 || ownerName.indexOf(text) != -1 || phone.indexOf(text) != -1 || fileNumber.indexOf(text) != -1 || metrage.indexOf(text) != -1)
            showingFiles.push(filteredFiles[i]);
    }
    lastSearchText = text;
    showFiles();
}
var filter = () => {
    showingFiles = [];
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    setTimeout(() => {
        maxMetrage = parseInt(document.getElementById('metrage-max-input').value);
        minMetrage = parseInt(document.getElementById('metrage-min-input').value);
        minPrice1 = parseInt(document.getElementById('price1-min-input').value);
        maxPrice1 = parseInt(document.getElementById('price1-max-input').value);
        minPrice2 = parseInt(document.getElementById('price2-min-input').value);
        maxPrice2 = parseInt(document.getElementById('price2-max-input').value);
        for (let i = 0; i < allFiles.length; i++) {
            var metrage = parseInt(allFiles[i].meterage);
            var price1 = parseInt(allFiles[i].price)/1000000;
            var price2 = parseInt(allFiles[i].fullPrice)/1000000;
            var age = parseInt(allFiles[i].buildAge);
            var type = allFiles[i].type;
            var state = allFiles[i].state;
            if((metrage > minMetrage || isNaN(minMetrage) ) && (metrage < maxMetrage || isNaN(maxMetrage)) || isNaN(metrage)){
                if((price1 > minPrice1 || isNaN(minPrice1) ) && (price1 < maxPrice1 || isNaN(maxPrice1)) || isNaN(price1)){
                    if((price2 > minPrice2 || isNaN(minPrice2)) && (price2 < maxPrice2 || isNaN(maxPrice2)) || isNaN(price2)){
                        if((((maxAge != 100 || age < maxAge) && age > minAge))){
                            if(!apartment         && type == 'آپارتمان');
                            else if(!vilage       && type == 'ویلایی');
                            else if(!old          && type == 'کلنگی');
                            else if(!business     && type == 'تجاری');
                            else if(!office       && type == 'اداری');
                            else if(!officeEstate && type == 'موقعیت اداری');
                            else if(!land         && type == 'زمین');
                            else if(!mostaghelat  && type == 'مستغلات');
                            else if(!sell         && state == 'فروش');
                            else if(!presell      && state == 'پیش‌فروش');
                            else if(!exchange     && state == 'معاوضه');
                            else if(!cooperate    && state == 'مشارکت');
                            else if(!rent         && state == 'رهن و اجاره');
                            else if(!rent2        && state == 'رهن کامل');
                            else {
                                showingFiles.push(allFiles[i]);
                            }
                        }
                    }
                }
            }
        }
        showFiles();
    }, 100);
    setTimeout(() => {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 100);
}
var clearFilters = () => {
    showingFiles = allFiles;
    showFiles();
}
var updatePlans = () => {
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var estate = JSON.parse(rawdata);
            fetch(api + `login?username=${estate.username}&password=${estate.password}`)
                .then(res => res.json())
                .then(data => {
                    if(data.correct == true){
                        if(data.estate.planType != 'free' && data.estate.payed){
                            var payDate = (new Date(data.estate.payDate)).getTime();
                            var now = (new Date()).getTime();
                            var endDate = 0;
                            if(data.estate.planType == 'trial')  endDate = payDate + 3 * 24 * 60 * 60 * 1000;
                            if(data.estate.planType == '1 ماهه') endDate = payDate + 1 * 30 * 24 * 60 * 60 * 1000;
                            if(data.estate.planType == '3 ماهه') endDate = payDate + 3 * 30 * 24 * 60 * 60 * 1000;
                            if(data.estate.planType == '6 ماهه') endDate = payDate + 6 * 30 * 24 * 60 * 60 * 1000;
                            if(data.estate.planType == '1 ساله') endDate = payDate + 12 * 30 * 24 * 60 * 60 * 1000;
                            if(endDate - now < 0) {
                                document.getElementById('plan-info').classList.add('hidden');
                                document.getElementById('no-plan-info').classList.remove('hidden');
                                document.getElementById('refresh-btn').classList.add('red');
                                document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                            }
                            else {
                                document.getElementById('plan-info').classList.remove('hidden');
                                document.getElementById('no-plan-info').classList.add('hidden');
                                document.getElementById('days-to-pay').textContent = Math.floor((endDate - now)/(1000*60*60*24));
                                document.getElementById('refresh-btn').classList.remove('red');
                                document.getElementById('refresh-btn').textContent= 'بارگیری اطلاعات جدید';
                                clearInterval(refreshInterval);
                            }
                        }
                        else{
                            document.getElementById('plan-info').classList.add('hidden');
                            document.getElementById('no-plan-info').classList.remove('hidden');
                            document.getElementById('refresh-btn').classList.add('red');
                            document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                        }
                    }else console.log('cnnot connect to server!!')
                }).catch(err => console.log(err));
        }
    });
}
var saveEstate = (username, password, estate, files, bookmarks=[]) => {
    var file = path.join(pathName, 'estate.json');
    var estateInfo = {username, password, estate, files, bookmarks};
    fs.writeFile(file, JSON.stringify(estateInfo), (err) => {
        if(err) console.log(err);
    })
}
var showError = (text) => {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = text;
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 5000);
}
var showSuccess = (text) => {
    successMsg.classList.remove('hidden');
    successMsg.textContent = text;
    setTimeout(() => {
        successMsg.classList.add('hidden');
    }, 5000);
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
var getPrice = (price) => {
    if(price > 1000000000){
        return Math.floor(price/100000000)/10 + ' میلیارد تومان';
    }
    else if(price > 1000000){
        return Math.floor(price/100000)/10 + ' میلیون تومان';
    }
    else{
        return price/100000 + ' میلیون';
    }
}
var getAddress = (address) => {
    var newAddress = '';
    for(var i=0; i<address.length; i++){
        if(i > 30) return newAddress + '...';
        newAddress += address[i];
    }
    return newAddress;
}
var addFile = (data, index) => {
    if(typeof(data) == 'undefined') return;
    // console.log(index);
    var item = document.createElement('div');
    item.classList.add('item');
    var info1 = document.createElement('table');
    info1.classList.add('info1');
    var td1 = document.createElement('td');
    td1.classList.add('column');
    td1.classList.add('col20');
    td1.classList.add('overflow-hidden');
    var label1 = document.createElement('div');
    label1.classList.add('label');
    label1.classList.add('green');
    label1.appendChild(document.createTextNode(data.state + ' '));
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        label1.classList.add('border-blue');
    else
        label1.classList.add('border-purple');
    
    var label2 = document.createElement('div');
    label2.classList.add('label');
    label2.classList.add('blue');
    label2.appendChild(document.createTextNode(data.type + ' '));
    td1.appendChild(label1);
    td1.appendChild(label2);
    
    var td2 = document.createElement('td');
    td2.classList.add('column');
    var name1 = document.createElement('div');
    name1.classList.add('name');
    name1.appendChild(document.createTextNode('آدرس: '));
    var value1 = document.createElement('div');
    value1.classList.add('value');
    value1.appendChild(document.createTextNode(data.address));
    td2.appendChild(name1);
    td2.appendChild(value1);
    
    var td3 = document.createElement('td');
    td3.classList.add('column');
    var name2 = document.createElement('div');
    name2.classList.add('name');
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        name2.appendChild(document.createTextNode('قیمت رهن: '));
    else
        name2.appendChild(document.createTextNode('قیمت متری: ')); 
    var value2 = document.createElement('div');
    value2.classList.add('value');
    value2.appendChild(document.createTextNode(getPrice(data.price)));
    td3.appendChild(name2);
    td3.appendChild(value2);

    var tdDate = document.createElement('td');
    tdDate.classList.add('column');
    var valueDate = document.createElement('div');
    valueDate.appendChild(document.createTextNode(data.date));
    tdDate.appendChild(valueDate);
    
    
    var td4 = document.createElement('td');
    td4.classList.add('column');
    var name3 = document.createElement('div');
    name3.classList.add('name');
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        name3.appendChild(document.createTextNode('قیمت اجاره: '));
    else
        name3.appendChild(document.createTextNode('قیمت کل: '));

    var value3 = document.createElement('div');
    value3.classList.add('value');
    value3.appendChild(document.createTextNode(getPrice(data.fullPrice)));
    td4.appendChild(name3);
    td4.appendChild(value3);
    
    var td5 = document.createElement('td');
    td5.classList.add('column');
    td5.classList.add('hidden');
    var name4 = document.createElement('div');
    name4.classList.add('name');
    name4.appendChild(document.createTextNode('نام مالک: '));
    var value4 = document.createElement('div');
    value4.classList.add('value');
    value4.appendChild(document.createTextNode(data.ownerName));
    td5.appendChild(name4);
    td5.appendChild(value4);

    var td6 = document.createElement('td');
    td6.classList.add('column');
    td6.classList.add('hidden');
    td6.appendChild(document.createTextNode(data.phone));
    
    var td7 = document.createElement('td');
    td7.classList.add('column');
    td7.classList.add('hidden');
    td7.appendChild(document.createTextNode(data.fileNumber));
    
    info1.appendChild(td1);
    info1.appendChild(td2);
    info1.appendChild(td3);
    info1.appendChild(td4);
    info1.appendChild(td5);
    info1.appendChild(td6);
    info1.appendChild(td7);
    info1.appendChild(tdDate);

    // Table 2
    var info2 = document.createElement('table');
    info2.classList.add('info2');
    var tr1 = document.createElement('tr');
    
    var tableTitle1 = document.createElement('td'); tableTitle1.classList.add('table-title'); tableTitle1.appendChild(document.createTextNode('متراژ'));tr1.appendChild(tableTitle1);
    var tableTitle2 = document.createElement('td'); tableTitle2.classList.add('table-title'); tableTitle2.appendChild(document.createTextNode('خواب'));tr1.appendChild(tableTitle2);
    var tableTitle3 = document.createElement('td'); tableTitle3.classList.add('table-title'); tableTitle3.appendChild(document.createTextNode('طبقه'));tr1.appendChild(tableTitle3);
    var tableTitle4 = document.createElement('td'); tableTitle4.classList.add('table-title'); tableTitle4.appendChild(document.createTextNode('طبقات'));tr1.appendChild(tableTitle4);
    var tableTitle5 = document.createElement('td'); tableTitle5.classList.add('table-title'); tableTitle5.appendChild(document.createTextNode('واحد'));tr1.appendChild(tableTitle5);
    var tableTitle6 = document.createElement('td'); tableTitle6.classList.add('table-title'); tableTitle6.appendChild(document.createTextNode('سن بنا'));tr1.appendChild(tableTitle6);
    var tableTitle7 = document.createElement('td'); tableTitle7.classList.add('table-title'); tableTitle7.appendChild(document.createTextNode('پارکینگ'));tr1.appendChild(tableTitle7);
    var tableTitle8 = document.createElement('td'); tableTitle8.classList.add('table-title'); tableTitle8.appendChild(document.createTextNode('انباری'));tr1.appendChild(tableTitle8);
    var tableTitle9 = document.createElement('td'); tableTitle9.classList.add('table-title'); tableTitle9.appendChild(document.createTextNode('آسانسور'));tr1.appendChild(tableTitle9);
    var tableTitle10= document.createElement('td');tableTitle10.classList.add('table-title');tableTitle10.appendChild(document.createTextNode('آشپزخانه'));tr1.appendChild(tableTitle10);
    var tableTitle11= document.createElement('td');tableTitle11.classList.add('table-title');tableTitle11.appendChild(document.createTextNode('نما'));tr1.appendChild(tableTitle11);
    var tableTitle12= document.createElement('td');tableTitle12.classList.add('table-title');tableTitle12.appendChild(document.createTextNode('کف'));tr1.appendChild(tableTitle12);
    var tableTitle13= document.createElement('td');tableTitle13.classList.add('table-title');tableTitle13.appendChild(document.createTextNode('سرویس'));tr1.appendChild(tableTitle13);
    var tableTitle14= document.createElement('td');tableTitle14.classList.add('table-title');tableTitle14.appendChild(document.createTextNode('سرمایش و گرمایش'));tr1.appendChild(tableTitle14);
    
    var tr2 = document.createElement('tr');
    var table1Value1 = document.createElement('td'); table1Value1.classList.add('table-value'); table1Value1.appendChild(document.createTextNode(data.meterage));tr2.appendChild(table1Value1);
    var table1Value2 = document.createElement('td'); table1Value2.classList.add('table-value'); table1Value2.appendChild(document.createTextNode(data.bedroom));tr2.appendChild(table1Value2);
    var table1Value3 = document.createElement('td'); table1Value3.classList.add('table-value'); table1Value3.appendChild(document.createTextNode(data.floor));tr2.appendChild(table1Value3);
    var table1Value4 = document.createElement('td'); table1Value4.classList.add('table-value'); table1Value4.appendChild(document.createTextNode(data.numOfFloors));tr2.appendChild(table1Value4);
    var table1Value5 = document.createElement('td'); table1Value5.classList.add('table-value'); table1Value5.appendChild(document.createTextNode(data.unit));tr2.appendChild(table1Value5);
    var table1Value6 = document.createElement('td'); table1Value6.classList.add('table-value'); table1Value6.appendChild(document.createTextNode(data.buildAge));tr2.appendChild(table1Value6);
    var table1Value7 = document.createElement('td'); table1Value7.classList.add('table-value'); table1Value7.appendChild(document.createTextNode(data.parking));tr2.appendChild(table1Value7);
    var table1Value8 = document.createElement('td'); table1Value8.classList.add('table-value'); table1Value8.appendChild(document.createTextNode(data.warehouse));tr2.appendChild(table1Value8);
    var table1Value9 = document.createElement('td'); table1Value9.classList.add('table-value'); table1Value9.appendChild(document.createTextNode(data.elevator));tr2.appendChild(table1Value9);
    var table1Value10= document.createElement('td');table1Value10.classList.add('table-value');table1Value10.appendChild(document.createTextNode(data.kitchen));tr2.appendChild(table1Value10);
    var table1Value11= document.createElement('td');table1Value11.classList.add('table-value');table1Value11.appendChild(document.createTextNode(data.view));tr2.appendChild(table1Value11);
    var table1Value12= document.createElement('td');table1Value12.classList.add('table-value');table1Value12.appendChild(document.createTextNode(data.floortype));tr2.appendChild(table1Value12);
    var table1Value13= document.createElement('td');table1Value13.classList.add('table-value');table1Value13.appendChild(document.createTextNode(data.service));tr2.appendChild(table1Value13);
    var table1Value14= document.createElement('td');table1Value14.classList.add('table-value');table1Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem));tr2.appendChild(table1Value14);
    
    // var tr3 = document.createElement('tr');
    // var table2Value1 = document.createElement('td'); table2Value1.classList.add('table-value'); table2Value1.appendChild(document.createTextNode(data.meterage2));tr3.appendChild(table2Value1);
    // var table2Value2 = document.createElement('td'); table2Value2.classList.add('table-value'); table2Value2.appendChild(document.createTextNode(data.bedroom2));tr3.appendChild(table2Value2);
    // var table2Value3 = document.createElement('td'); table2Value3.classList.add('table-value'); table2Value3.appendChild(document.createTextNode(data.floor2));tr3.appendChild(table2Value3);
    // var table2Value4 = document.createElement('td'); table2Value4.classList.add('table-value'); table2Value4.appendChild(document.createTextNode(data.numOfFloors2));tr3.appendChild(table2Value4);
    // var table2Value5 = document.createElement('td'); table2Value5.classList.add('table-value'); table2Value5.appendChild(document.createTextNode(data.unit2));tr3.appendChild(table2Value5);
    // var table2Value6 = document.createElement('td'); table2Value6.classList.add('table-value'); table2Value6.appendChild(document.createTextNode(data.buildAge2));tr3.appendChild(table2Value6);
    // var table2Value7 = document.createElement('td'); table2Value7.classList.add('table-value'); table2Value7.appendChild(document.createTextNode(data.parking2));tr3.appendChild(table2Value7);
    // var table2Value8 = document.createElement('td'); table2Value8.classList.add('table-value'); table2Value8.appendChild(document.createTextNode(data.warehouse2));tr3.appendChild(table2Value8);
    // var table2Value9 = document.createElement('td'); table2Value9.classList.add('table-value'); table2Value9.appendChild(document.createTextNode(data.elevator2));tr3.appendChild(table2Value9);
    // var table2Value10= document.createElement('td');table2Value10.classList.add('table-value');table2Value10.appendChild(document.createTextNode(data.kitchen2));tr3.appendChild(table2Value10);
    // var table2Value11= document.createElement('td');table2Value11.classList.add('table-value');table2Value11.appendChild(document.createTextNode(data.view2));tr3.appendChild(table2Value11);
    // var table2Value12= document.createElement('td');table2Value12.classList.add('table-value');table2Value12.appendChild(document.createTextNode(data.floortype2));tr3.appendChild(table2Value12);
    // var table2Value13= document.createElement('td');table2Value13.classList.add('table-value');table2Value13.appendChild(document.createTextNode(data.service2));tr3.appendChild(table2Value13);
    // var table2Value14= document.createElement('td');table2Value14.classList.add('table-value');table2Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem2));tr3.appendChild(table2Value14);
    
    // var tr4 = document.createElement('tr');
    // var table3Value1 = document.createElement('td'); table3Value1.classList.add('table-value'); table3Value1.appendChild(document.createTextNode(data.meterage3));tr4.appendChild(table3Value1);
    // var table3Value2 = document.createElement('td'); table3Value2.classList.add('table-value'); table3Value2.appendChild(document.createTextNode(data.bedroom3));tr4.appendChild(table3Value2);
    // var table3Value3 = document.createElement('td'); table3Value3.classList.add('table-value'); table3Value3.appendChild(document.createTextNode(data.floor3));tr4.appendChild(table3Value3);
    // var table3Value4 = document.createElement('td'); table3Value4.classList.add('table-value'); table3Value4.appendChild(document.createTextNode(data.numOfFloors3));tr4.appendChild(table3Value4);
    // var table3Value5 = document.createElement('td'); table3Value5.classList.add('table-value'); table3Value5.appendChild(document.createTextNode(data.unit3));tr4.appendChild(table3Value5);
    // var table3Value6 = document.createElement('td'); table3Value6.classList.add('table-value'); table3Value6.appendChild(document.createTextNode(data.buildAge3));tr4.appendChild(table3Value6);
    // var table3Value7 = document.createElement('td'); table3Value7.classList.add('table-value'); table3Value7.appendChild(document.createTextNode(data.parking3));tr4.appendChild(table3Value7);
    // var table3Value8 = document.createElement('td'); table3Value8.classList.add('table-value'); table3Value8.appendChild(document.createTextNode(data.warehouse3));tr4.appendChild(table3Value8);
    // var table3Value9 = document.createElement('td'); table3Value9.classList.add('table-value'); table3Value9.appendChild(document.createTextNode(data.elevator3));tr4.appendChild(table3Value9);
    // var table3Value10= document.createElement('td');table3Value10.classList.add('table-value');table3Value10.appendChild(document.createTextNode(data.kitchen3));tr4.appendChild(table3Value10);
    // var table3Value11= document.createElement('td');table3Value11.classList.add('table-value');table3Value11.appendChild(document.createTextNode(data.view3));tr4.appendChild(table3Value11);
    // var table3Value12= document.createElement('td');table3Value12.classList.add('table-value');table3Value12.appendChild(document.createTextNode(data.floortype3));tr4.appendChild(table3Value12);
    // var table3Value13= document.createElement('td');table3Value13.classList.add('table-value');table3Value13.appendChild(document.createTextNode(data.service3));tr4.appendChild(table3Value13);
    // var table3Value14= document.createElement('td');table3Value14.classList.add('table-value');table3Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem3));tr4.appendChild(table3Value14);
    
    info2.appendChild(tr1);
    info2.appendChild(tr2);
    // info2.appendChild(tr3);
    // info2.appendChild(tr4);

    var info3 = document.createElement('table');
    info3.classList.add('info3');
    var info3td1 = document.createElement('td');
    var info3name1;
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل'){
        info3name1 = document.createElement('div');info3name1.classList.add('name');info3name1.appendChild(document.createTextNode('قیمت رهن: '));info3td1.appendChild(info3name1);
    }else{
        info3name1 = document.createElement('div');info3name1.classList.add('name');info3name1.appendChild(document.createTextNode('قیمت متری: '));info3td1.appendChild(info3name1);
    }
    var info3value1 = document.createElement('div');info3value1.classList.add('value');info3value1.appendChild(document.createTextNode(data.price));info3td1.appendChild(info3value1);
    var info3td2 = document.createElement('td');
    var info3name2;
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل'){
        info3name2 = document.createElement('div');info3name2.classList.add('name');info3name2.appendChild(document.createTextNode('قیمت اجاره: '));info3td2.appendChild(info3name2);
    }else{
        info3name2 = document.createElement('div');info3name2.classList.add('name');info3name2.appendChild(document.createTextNode('قیمت کل: '));info3td2.appendChild(info3name2);
    }
    var info3value2 = document.createElement('div');info3value2.classList.add('value');info3value2.appendChild(document.createTextNode(data.fullPrice));info3td2.appendChild(info3value2);
    var info3td3 = document.createElement('td');
    // var moreButton = document.createElement('div');moreButton.classList.add('more');moreButton.id='more-btn-'+index.toString();moreButton.appendChild(document.createTextNode('مشاهده فایل'));info3td3.appendChild(moreButton);

    info3.appendChild(info3td1);
    info3.appendChild(info3td2);
    info3.appendChild(info3td3);
    if(activeMenu == 'table'){
        info1.classList.add('hidden');
        info2.classList.add('hidden');
    }
    info3.classList.add('hidden');
    
    var info4 = document.createElement('table');
    info4.classList.add('info4');
    var tr5 = document.createElement('tr');
    var table4Value1 = document.createElement('td'); table4Value1.classList.add('metrage'); table4Value1.appendChild(document.createTextNode(data.meterage));tr5.appendChild(table4Value1);
    var table4Value2 = document.createElement('td'); table4Value2.classList.add('bedroom'); table4Value2.appendChild(document.createTextNode(data.bedroom));tr5.appendChild(table4Value2);
    var table4Value3 = document.createElement('td'); table4Value3.classList.add('floor'); table4Value3.appendChild(document.createTextNode(data.floor));tr5.appendChild(table4Value3);
    var table4Value4 = document.createElement('td'); table4Value4.classList.add('build-age'); table4Value4.appendChild(document.createTextNode(data.buildAge));tr5.appendChild(table4Value4);
    var table4Value5 = document.createElement('td'); table4Value5.classList.add('address'); table4Value5.appendChild(document.createTextNode(getAddress(data.address)));tr5.appendChild(table4Value5);
    var table4Value55 = document.createElement('td'); table4Value55.classList.add('date'); table4Value55.appendChild(document.createTextNode(data.date));tr5.appendChild(table4Value55);
    var table4Value555 = document.createElement('td'); table4Value555.classList.add('price'); table4Value555.appendChild(document.createTextNode(getPrice(data.price)));tr5.appendChild(table4Value555);
    var table4Value6 = document.createElement('td'); table4Value6.classList.add('price'); table4Value6.appendChild(document.createTextNode(getPrice(data.fullPrice)));tr5.appendChild(table4Value6);
    info4.appendChild(tr5);
    if(data.type == 'کلنگی' || data.type == 'مستغلات' || data.type == 'زمین')
        info4.classList.add('border-red');
    else if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        info4.classList.add('border-blue');
    else
        info4.classList.add('border-purple');
    
    
    info1.classList.add('info-1');
    info2.classList.add('info-2');
    info3.classList.add('info-3');
    info4.classList.add('info-4');
    if(activeMenu == 'files') info4.classList.add('hidden');
    item.appendChild(info1);
    item.appendChild(info2);
    item.appendChild(info3);
    item.appendChild(info4);
    item.id='more-btn-'+index.toString();
    filesContainer.appendChild(item);
}
var getBookmarks = () => {
    var rawdata = fs.readFileSync(path.join(pathName, 'estate.json'));
    if(rawdata){
        var data = JSON.parse(rawdata);
        var bookmarks = [];
        if(data.bookmarks) bookmarks = data.bookmarks;
        return bookmarks;
    }
}
var bookmarkIndex = (file) => {
    bookmarks = getBookmarks();
    var index = -1;
    for (let i = 0; i < bookmarks.length; i++) {
        if(bookmarks[i].fileNumber == file.fileNumber)
            index = i;
    }
    return index;
}
var loadData = (file, len, id) => {
    $('#file-popup').removeClass('border-blue');
    $('#file-popup').removeClass('border-purple');
    $('#file-state').removeClass('border-blue');
    $('#file-state').removeClass('border-purple');
    if(bookmarkIndex(file) != -1) {
        $('.mark-file-btn-o').show();
        $('.mark-file-btn').hide();
    }else {
        $('.mark-file-btn-o').hide();
        $('.mark-file-btn').show();
    }
    if(file.state == 'رهن و اجاره' || file.state == 'رهن کامل'){
        $('#file-state').addClass('border-blue');
        $('#file-popup').addClass('border-blue');
    }else{
        $('#file-state').addClass('border-purple');
        $('#file-popup').addClass('border-purple');
    }
    if(id == len-1) $('#next-file-btn').hide();
    else $('#next-file-btn').show();
    if(id == 0) $('#prev-file-btn').hide();
    else $('#prev-file-btn').show();
    $('#file-type').text(file.type)
    $('#file-state').text(file.state)
    $('#file-owner').text(file.ownerName)
    $('#file-phone').text(file.phone)
    $('#file-address').text(file.address)
    $('#file-meterage').text(file.meterage)
    $('#file-bedroom').text(file.bedroom)
    $('#file-floor').text(file.floor)
    $('#file-numOfFloors').text(file.numOfFloors)
    $('#file-unit').text(file.unit)
    $('#file-buildAge').text(file.buildAge)
    $('#file-parking').text(file.parking)
    $('#file-warehouse').text(file.warehouse)
    $('#file-elevator').text(file.elevator)
    $('#file-kitchen').text(file.kitchen)
    $('#file-view').text(file.view)
    $('#file-floortype').text(file.floortype)
    $('#file-service').text(file.service)
    $('#file-heatingAndCoolingSystem').text(file.heatingAndCoolingSystem)
    $('#file-meterage2').text(file.meterage2)
    $('#file-bedroom2').text(file.bedroom2)
    $('#file-floor2').text(file.floor2)
    $('#file-numOfFloors2').text(file.numOfFloors2)
    $('#file-unit2').text(file.unit2)
    $('#file-buildAge2').text(file.buildAge2)
    $('#file-parking2').text(file.parking2)
    $('#file-warehouse2').text(file.warehouse2)
    $('#file-elevator2').text(file.elevator2)
    $('#file-kitchen2').text(file.kitchen2)
    $('#file-view2').text(file.view2)
    $('#file-floortype2').text(file.floortype2)
    $('#file-service2').text(file.service2)
    $('#file-heatingAndCoolingSystem2').text(file.heatingAndCoolingSystem2)
    $('#file-meterage3').text(file.meterage3)
    $('#file-bedroom3').text(file.bedroom3)
    $('#file-floor3').text(file.floor3)
    $('#file-numOfFloors3').text(file.numOfFloors3)
    $('#file-unit3').text(file.unit3)
    $('#file-buildAge3').text(file.buildAge3)
    $('#file-parking3').text(file.parking3)
    $('#file-warehouse3').text(file.warehouse3)
    $('#file-elevator3').text(file.elevator3)
    $('#file-kitchen3').text(file.kitchen3)
    $('#file-view3').text(file.view3)
    $('#file-floortype3').text(file.floortype3)
    $('#file-service3').text(file.service3)
    $('#file-heatingAndCoolingSystem3').text(file.heatingAndCoolingSystem3)
    $('#file-options').text(file.options)
    $('#file-area').text(file.area)
    $('#file-lone').text(file.lone)
    $('#file-changable').text(file.changable)
    $('#file-discount').text(file.discount)
    $('#file-documentState').text(file.documentState)
    $('#file-transfer').text(file.transfer)
    $('#file-advertiser').text(file.advertiser)
    $('#file-date').text(file.date)
    if(file.price)
        $('#file-price').text(file.price)
    else
        $('#file-price').text(0)
    if(file.fullPrice)
        $('#file-fullPrice').text(file.fullPrice)
    else
        $('#file-fullPrice').text(0)
    if(file.price)
        $('#file-price2').text(showPrice(file.price))
    else
        $('#file-price2').text(0)
    if(file.fullPrice)
        $('#file-fullPrice2').text(showPrice(file.fullPrice))
    else
        $('#file-fullPrice2').text(0)
    $('#file-number').text(file.fileNumber)
    $('#file-role').text(file.role)
    $('#popup-index').text(id)
    var imagesView = document.getElementById('file-images-view');
    removeAllChildNodes(imagesView);
    for (let j = 0; j < file.images.length; j++) {
        var link = document.createElement('a');
        link.href = api.slice(0, -4) + file.images[j].link;
        link.target = '_blank';
        var img = document.createElement('img');
        img.src = api.slice(0, -4) + file.images[j].link;
        link.appendChild(img);
        imagesView.appendChild(link);
    }
    if(file.state == 'رهن و اجاره' || file.state == 'رهن کامل'){
        $('#file-price2-label').text('قیمت رهن');
        $('#file-fullPrice2-label').text('قیمت اجاره');
    }else{
        $('#file-price2-label').text('قیمت متری');
        $('#file-fullPrice2-label').text('قیمت کل');
    }
}
var loadPDFData = (file) => {
    $('#pdf-file-ownerName').text(typeof(file.ownerName) == 'undefined' ? '-' : file.ownerName == '' ? '-' : file.ownerName);
    $('#pdf-file-constPhone').text(typeof(file.constPhone) == 'undefined' ? '-' : file.constPhone == '' ? '-' : file.constPhone);
    $('#pdf-file-address').text(typeof(file.address) == 'undefined' ? '-' : file.address == '' ? '-' : file.address);
    $('#pdf-file-phone').text(typeof(file.phone) == 'undefined' ? '-' : file.phone == '' ? '-' : file.phone);
    $('#pdf-file-date').text(typeof(file.date) == 'undefined' ? '-' : file.date == '' ? '-' : file.date);
    $('#pdf-file-type').text(typeof(file.type) == 'undefined' ? '-' : file.type == '' ? '-' : file.type);
    $('#pdf-file-fileNumber').text(typeof(file.fileNumber) == 'undefined' ? '-' : file.fileNumber == '' ? '-' : file.fileNumber);
    $('#pdf-file-state').text(typeof(file.state) == 'undefined' ? '-' : file.state == '' ? '-' : file.state);
    $('#pdf-file-role').text(typeof(file.role) == 'undefined' ? '-' : file.role == '' ? '-' : file.role);
    $('#pdf-file-meterage').text(typeof(file.meterage) == 'undefined' ? '-' : file.meterage == '' ? '-' : file.meterage);
    $('#pdf-file-bedroom').text(typeof(file.bedroom) == 'undefined' ? '-' : file.bedroom == '' ? '-' : file.bedroom);
    $('#pdf-file-floor').text(typeof(file.floor) == 'undefined' ? '-' : file.floor == '' ? '-' : file.floor);
    $('#pdf-file-numOfFloors').text(typeof(file.numOfFloors) == 'undefined' ? '-' : file.numOfFloors == '' ? '-' : file.numOfFloors);
    $('#pdf-file-unit').text(typeof(file.unit) == 'undefined' ? '-' : file.unit == '' ? '-' : file.unit);
    $('#pdf-file-buildAge').text(typeof(file.buildAge) == 'undefined' ? '-' : file.buildAge == '' ? '-' : file.buildAge);
    $('#pdf-file-parking').text(typeof(file.parking) == 'undefined' ? '-' : file.parking == '' ? '-' : file.parking);
    $('#pdf-file-warehouse').text(typeof(file.warehouse) == 'undefined' ? '-' : file.warehouse == '' ? '-' : file.warehouse);
    $('#pdf-file-elevator').text(typeof(file.elevator) == 'undefined' ? '-' : file.elevator == '' ? '-' : file.elevator);
    $('#pdf-file-kitchen').text(typeof(file.kitchen) == 'undefined' ? '-' : file.kitchen == '' ? '-' : file.kitchen);
    $('#pdf-file-view').text(typeof(file.view) == 'undefined' ? '-' : file.view == '' ? '-' : file.view);
    $('#pdf-file-floortype').text(typeof(file.floortype) == 'undefined' ? '-' : file.floortype == '' ? '-' : file.floortype);
    $('#pdf-file-service').text(typeof(file.service) == 'undefined' ? '-' : file.service == '' ? '-' : file.service);
    $('#pdf-file-heatingAndCoolingSystem').text(typeof(file.heatingAndCoolingSystem) == 'undefined' ? '-' : file.heatingAndCoolingSystem == '' ? '-' : file.heatingAndCoolingSystem);
    $('#pdf-file-meterage2').text(typeof(file.meterage2) == 'undefined' ? '-' : file.meterage2 == '' ? '-' : file.meterage2);
    $('#pdf-file-bedroom2').text(typeof(file.bedroom2) == 'undefined' ? '-' : file.bedroom2 == '' ? '-' : file.bedroom2);
    $('#pdf-file-floor2').text(typeof(file.floor2) == 'undefined' ? '-' : file.floor2 == '' ? '-' : file.floor2);
    $('#pdf-file-numOfFloors2').text(typeof(file.numOfFloors2) == 'undefined' ? '-' : file.numOfFloors2 == '' ? '-' : file.numOfFloors2);
    $('#pdf-file-unit2').text(typeof(file.unit2) == 'undefined' ? '-' : file.unit2 == '' ? '-' : file.unit2);
    $('#pdf-file-buildAge2').text(typeof(file.buildAge2) == 'undefined' ? '-' : file.buildAge2 == '' ? '-' : file.buildAge2);
    $('#pdf-file-parking2').text(typeof(file.parking2) == 'undefined' ? '-' : file.parking2 == '' ? '-' : file.parking2);
    $('#pdf-file-warehouse2').text(typeof(file.warehouse2) == 'undefined' ? '-' : file.warehouse2 == '' ? '-' : file.warehouse2);
    $('#pdf-file-elevator2').text(typeof(file.elevator2) == 'undefined' ? '-' : file.elevator2 == '' ? '-' : file.elevator2);
    $('#pdf-file-kitchen2').text(typeof(file.kitchen2) == 'undefined' ? '-' : file.kitchen2 == '' ? '-' : file.kitchen2);
    $('#pdf-file-view2').text(typeof(file.view2) == 'undefined' ? '-' : file.view2 == '' ? '-' : file.view2);
    $('#pdf-file-floortype2').text(typeof(file.floortype2) == 'undefined' ? '-' : file.floortype2 == '' ? '-' : file.floortype2);
    $('#pdf-file-service2').text(typeof(file.service2) == 'undefined' ? '-' : file.service2 == '' ? '-' : file.service2);
    $('#pdf-file-heatingAndCoolingSystem2').text(typeof(file.heatingAndCoolingSystem2) == 'undefined' ? '-' : file.heatingAndCoolingSystem2 == '' ? '-' : file.heatingAndCoolingSystem2);
    $('#pdf-file-meterage3').text(typeof(file.meterage3) == 'undefined' ? '-' : file.meterage3 == '' ? '-' : file.meterage3);
    $('#pdf-file-bedroom3').text(typeof(file.bedroom3) == 'undefined' ? '-' : file.bedroom3 == '' ? '-' : file.bedroom3);
    $('#pdf-file-floor3').text(typeof(file.floor3) == 'undefined' ? '-' : file.floor3 == '' ? '-' : file.floor3);
    $('#pdf-file-numOfFloors3').text(typeof(file.numOfFloors3) == 'undefined' ? '-' : file.numOfFloors3 == '' ? '-' : file.numOfFloors3);
    $('#pdf-file-unit3').text(typeof(file.unit3) == 'undefined' ? '-' : file.unit3 == '' ? '-' : file.unit3);
    $('#pdf-file-buildAge3').text(typeof(file.buildAge3) == 'undefined' ? '-' : file.buildAge3 == '' ? '-' : file.buildAge3);
    $('#pdf-file-parking3').text(typeof(file.parking3) == 'undefined' ? '-' : file.parking3 == '' ? '-' : file.parking3);
    $('#pdf-file-warehouse3').text(typeof(file.warehouse3) == 'undefined' ? '-' : file.warehouse3 == '' ? '-' : file.warehouse3);
    $('#pdf-file-elevator3').text(typeof(file.elevator3) == 'undefined' ? '-' : file.elevator3 == '' ? '-' : file.elevator3);
    $('#pdf-file-kitchen3').text(typeof(file.kitchen3) == 'undefined' ? '-' : file.kitchen3 == '' ? '-' : file.kitchen3);
    $('#pdf-file-view3').text(typeof(file.view3) == 'undefined' ? '-' : file.view3 == '' ? '-' : file.view3);
    $('#pdf-file-floortype3').text(typeof(file.floortype3) == 'undefined' ? '-' : file.floortype3 == '' ? '-' : file.floortype3);
    $('#pdf-file-service3').text(typeof(file.service3) == 'undefined' ? '-' : file.service3 == '' ? '-' : file.service3);
    $('#pdf-file-heatingAndCoolingSystem3').text(typeof(file.heatingAndCoolingSystem3) == 'undefined' ? '-' : file.heatingAndCoolingSystem3 == '' ? '-' : file.heatingAndCoolingSystem3);
    $('#pdf-file-options').text(typeof(file.options) == 'undefined' ? '-' : file.options == '' ? '-' : file.options);
    $('#pdf-file-price').text(typeof(file.price) == 'undefined' ? '-' : file.price == '' ? '-' : file.price);
    $('#pdf-file-fullPrice').text(typeof(file.fullPrice) == 'undefined' ? '-' : file.fullPrice == '' ? '-' : file.fullPrice);
    $('#pdf-file-area').text(typeof(file.area) == 'undefined' ? '-' : file.area == '' ? '-' : file.area);
    $('#pdf-file-lone').text(typeof(file.lone) == 'undefined' ? '-' : file.lone == '' ? '-' : file.lone);
    $('#pdf-file-changable').text(typeof(file.changable) == 'undefined' ? '-' : file.changable == '' ? '-' : file.changable);
    $('#pdf-file-discount').text(typeof(file.discount) == 'undefined' ? '-' : file.discount == '' ? '-' : file.discount);
    $('#pdf-file-documentState').text(typeof(file.documentState) == 'undefined' ? '-' : file.documentState == '' ? '-' : file.documentState);
    $('#pdf-file-transfer').text(typeof(file.transfer) == 'undefined' ? '-' : file.transfer == '' ? '-' : file.transfer);
    $('#pdf-file-advertiser').text(typeof(file.advertiser) == 'undefined' ? '-' : file.advertiser == '' ? '-' : file.advertiser);
    if(file.state == 'رهن و اجاره' || file.state == 'رهن کامل'){
        $('#pdf-file-price-label').text('قیمت رهن');
        $('#pdf-file-fullPrice-label').text('قیمت اجاره');
    }else{
        $('#pdf-file-price-label').text('قیمت متری');
        $('#pdf-file-fullPrice-label').text('قیمت کل');
    }
}
var updatePlanPrices = () => {
    fetch(api + `get-settings`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('onemonthfulltext').textContent = data.settings.oneMonthFullText;
            document.getElementById('threemonthfulltext').textContent = data.settings.threeMonthFullText;
            document.getElementById('sixmonthfulltext').textContent = data.settings.sixMonthFullText;
            document.getElementById('oneyearfulltext').textContent = data.settings.oneYearFullText;
            document.getElementById('onemonthtext').textContent = data.settings.oneMonthText;
            document.getElementById('threemonthtext').textContent = data.settings.threeMonthText;
            document.getElementById('sixmonthtext').textContent = data.settings.sixMonthText;
            document.getElementById('oneyeartext').textContent = data.settings.oneYearText;
        }).catch(err => {
            showError('خطای اتصال به اینترنت');
            console.log(err);
        });
}
var refresh = () => {
    refreshCancled = false;
    var downloadPercent = 10;
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var estate = JSON.parse(rawdata);
            loadingScreen.classList.remove('hidden');
            cancleButton.classList.remove('hidden');
            downloadBar.classList.remove('hidden');

            var downloadInterval = setInterval(() => {
                document.getElementById('download-bar-handle').style.width = `${downloadPercent}%`;
                document.getElementById('download-bar-text').textContent = `${downloadPercent}%`;
                if(downloadPercent<99) downloadPercent++;
                else clearInterval(downloadInterval);
            }, 170);
            var res = fetch(api + `get-files?username=${estate.username}&password=${estate.password}`)
                .then(res => res.json())
                .then(data => {
                    if(data.status == 'ok'){
                        saveEstate(estate.username, estate.password, estate.estate, data.files);
                        removeAllChildNodes(filesContainer);
                        allFiles = data.files;
                        showingFiles = allFiles;
                        showFiles();
                        // updateHandlers(data.files);
                        downloadBar.classList.add('hidden');
                        loadingScreen.classList.add('hidden');
                        cancleButton.classList.add('hidden');
                        clearInterval(downloadInterval);
                        document.getElementById('refresh-btn').classList.remove('red');
                        document.getElementById('refresh-btn').textContent= 'بارگیری اطلاعات جدید';
                        showSuccess('بارگیری با موفقیت انجام شد');
                    }
                    else if(data.status == 'not payed'){
                        updatePlanPrices();
                        loadingScreen.classList.add('hidden');
                        $('#plans-popup').fadeIn(500);
                        $('.black-modal').fadeIn(500);
                        document.getElementById('plan-info').classList.add('hidden');
                        document.getElementById('no-plan-info').classList.remove('hidden');
                        document.getElementById('refresh-btn').classList.add('red');
                        document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                        refreshInterval = setInterval(updatePlans, udatePlanTime);
                    }
                }).catch(err => {
                    showError('خطای اتصال به اینترنت');
                    loadingScreen.classList.add('hidden');
                    cancleButton.classList.add('hidden');
                    console.log(err);
                });
        }
        else console.log('file not found');
    });
    document.getElementById('download-bar-handle').style.width = `${0}%`;
    document.getElementById('download-bar-text').textContent = `${0}%`;
}
var refresh2 = () => {
    var downloadPercent = 10;
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var estate = JSON.parse(rawdata);
            loadingScreen.classList.remove('hidden');
            downloadBar.classList.remove('hidden');
            cancleButton.classList.remove('hidden');
            var downloadInterval = setInterval(() => {
                document.getElementById('download-bar-handle').style.width = `${downloadPercent}%`;
                document.getElementById('download-bar-text').textContent = `${downloadPercent}%`;
                if(downloadPercent<99) downloadPercent++;
                else clearInterval(downloadInterval);
            }, 170);
            // var availableFileNumers = [];
            // if(estate.files){
            //     for (let i = 0; i < estate.files.length; i++) {
            //         if(estate.files[i])
            //             availableFileNumers.push(estate.files[i].fileNumber);
            //     }
            // }
            var res = fetch(api + `get-files2`,{
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({
                        username: estate.username,
                        password: estate.password,
                        // availableFileNumers: availableFileNumers
                    }) // body data type must match "Content-Type" header
                }).then(res => res.json())
                .then(data => {
                    if(data.status == 'ok'){
                        fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
                            if(rawdata){
                                var estate = JSON.parse(rawdata);
                                allFiles = data.files.concat(allFiles);
                                showingFiles = allFiles;
                                showFiles();
                                if(estate.files) data.files = data.files.concat(estate.files);
                                saveEstate(estate.username, estate.password, estate.estate, data.files);
                                downloadBar.classList.add('hidden');
                                loadingScreen.classList.add('hidden');
                                cancleButton.classList.add('hidden');
                                clearInterval(downloadInterval);
                                document.getElementById('refresh-btn').classList.remove('red');
                                document.getElementById('refresh-btn').textContent= 'بارگیری اطلاعات جدید';
                                showSuccess('بارگیری با موفقیت انجام شد');
                            }
                        });
                    }
                    else if(data.status == 'not payed'){
                        updatePlanPrices();
                        loadingScreen.classList.add('hidden');
                        $('#plans-popup').fadeIn(500);
                        $('.black-modal').fadeIn(500);
                        document.getElementById('plan-info').classList.add('hidden');
                        document.getElementById('no-plan-info').classList.remove('hidden');
                        document.getElementById('refresh-btn').classList.add('red');
                        document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                        refreshInterval = setInterval(updatePlans, udatePlanTime);
                    }
                }).catch(err => {
                    showError('خطای اتصال به اینترنت');
                    loadingScreen.classList.add('hidden');
                    cancleButton.classList.add('hidden');
                    console.log(err);
                });
        }
        else console.log('file not found');
    });
    document.getElementById('download-bar-handle').style.width = `${0}%`;
    document.getElementById('download-bar-text').textContent = `${0}%`;
}
var activePageNumber = (n) => {
    pageNumberButtons[1].classList.remove('active');
    pageNumberButtons[2].classList.remove('active');
    pageNumberButtons[3].classList.remove('active');
    pageNumberButtons[4].classList.remove('active');
    pageNumberButtons[5].classList.remove('active');
    pageNumberButtons[6].classList.remove('active');
    pageNumberButtons[7].classList.remove('active');
    pageNumberButtons[n].classList.add('active');
}
var updatePageHandlers = () => {
    var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
    var begin = numberOfFilesInPage * (currentPage - 1);
    var end   = numberOfFilesInPage * (currentPage);
    var moreButtons = [];
    for (let i = begin; i<end && i < showingFiles.length; i++) {
        moreButtons.push({btn: $(`#more-btn-${i}`),id: i,data: showingFiles[i]});
    }
    moreButtons.forEach(more => {
        more.btn.click(() => {            
            $('#file-popup').fadeIn(500);
            $('#next-file-btn').fadeIn(500);
            $('#prev-file-btn').fadeIn(500);
            $('.black-modal').fadeIn(500);
            loadData(more.data, moreButtons.length, more.id);
            activeFile = more.data;
        });
    });
}
var showFiles = () => {
    removeAllChildNodes(filesContainer);
    var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
    var begin = numberOfFilesInPage * (currentPage - 1);
    var end   = numberOfFilesInPage * (currentPage);
    for(var i=begin; i<end && i<showingFiles.length; i++){
        addFile(showingFiles[i], i);
    }
    updatePageHandlers();
    if(currentPage < 4){
        pageNumberButtons[1].textContent = 1;
        pageNumberButtons[2].textContent = 2;
        pageNumberButtons[3].textContent = 3;
        pageNumberButtons[4].textContent = 4;
        pageNumberButtons[5].textContent = 5;
        pageNumberButtons[6].textContent = 6;
        pageNumberButtons[7].textContent = 7;
        activePageNumber(currentPage);
    }
    else if(currentPage > maxpage-4){
        pageNumberButtons[1].textContent = maxpage - 6;
        pageNumberButtons[2].textContent = maxpage - 5;
        pageNumberButtons[3].textContent = maxpage - 4;
        pageNumberButtons[4].textContent = maxpage - 3;
        pageNumberButtons[5].textContent = maxpage - 2;
        pageNumberButtons[6].textContent = maxpage - 1;
        pageNumberButtons[7].textContent = maxpage;
        activePageNumber(7 - (maxpage - currentPage));
    }
    else{
        pageNumberButtons[1].textContent = currentPage - 3;
        pageNumberButtons[2].textContent = currentPage - 2;
        pageNumberButtons[3].textContent = currentPage - 1;
        pageNumberButtons[4].textContent = currentPage;
        pageNumberButtons[5].textContent = currentPage + 1;
        pageNumberButtons[6].textContent = currentPage + 2;
        pageNumberButtons[7].textContent = currentPage + 3;
        activePageNumber(4);
    }
    pageNumberButtons[8].textContent = maxpage;
}
fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
    document.getElementById('loading-screen').classList.remove('hidden');
    if(rawdata && JSON.parse(rawdata).files){
        var data = JSON.parse(rawdata);
        allFiles = data.files;
        showingFiles = allFiles;
        showFiles();
        document.getElementById('fullname').textContent = data.estate.name;
        document.getElementById('address').textContent = data.estate.address;
        document.getElementById('estate-code').textContent = data.estate.code;
        document.getElementById('estate-number').textContent = data.estate.area;
        if(data.estate.planType != 'free' && data.estate.payed){
            var payDate = (new Date(data.estate.payDate)).getTime();
            var now = (new Date()).getTime();
            var endDate = 0;
            if(data.estate.planType == 'trial')  endDate = payDate + 3 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '1 ماهه') endDate = payDate + 1 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '3 ماهه') endDate = payDate + 3 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '6 ماهه') endDate = payDate + 6 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '1 ساله') endDate = payDate + 12 * 30 * 24 * 60 * 60 * 1000;
            if(endDate - now < 0) {
                document.getElementById('plan-info').classList.add('hidden');
                document.getElementById('no-plan-info').classList.remove('hidden');
                document.getElementById('refresh-btn').classList.add('red');
                document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                refreshInterval = setInterval(updatePlans, udatePlanTime);
            }
            else {
                document.getElementById('days-to-pay').textContent = Math.floor((endDate - now)/(1000*60*60*24));
                document.getElementById('refresh-btn').classList.remove('red');
                document.getElementById('refresh-btn').textContent = 'بارگیری اطلاعات جدید';
            }
        }
        else{
            document.getElementById('plan-info').classList.add('hidden');
            document.getElementById('no-plan-info').classList.remove('hidden');
            document.getElementById('refresh-btn').classList.add('red');
            document.getElementById('refresh-btn').textContent = 'خرید اشتراک';
            var estate = data;
            refreshInterval = setInterval(updatePlans, udatePlanTime);
        }
        // updateHandlers(data.files);
    }
    else if(rawdata){
        var data = JSON.parse(rawdata);
        document.getElementById('fullname').textContent = data.estate.name;
        document.getElementById('address').textContent = data.estate.address;
        document.getElementById('estate-code').textContent = data.estate.code;
        if(data.estate.planType != 'free' && data.estate.payed){
            var payDate = (new Date(data.estate.payDate)).getTime();
            var now = (new Date()).getTime();
            var endDate = 0;
            if(data.estate.planType == 'trial')  endDate = payDate + 3 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '1 ماهه') endDate = payDate + 1 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '3 ماهه') endDate = payDate + 3 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '6 ماهه') endDate = payDate + 6 * 30 * 24 * 60 * 60 * 1000;
            if(data.estate.planType == '1 ساله') endDate = payDate + 12 * 30 * 24 * 60 * 60 * 1000;
            if(endDate - now < 0) {
                document.getElementById('plan-info').classList.add('hidden');
                document.getElementById('no-plan-info').classList.remove('hidden');
                document.getElementById('refresh-btn').classList.add('red');
                document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
                refreshInterval = setInterval(updatePlans, udatePlanTime);
            }
            else {
                document.getElementById('days-to-pay').textContent = Math.floor((endDate - now)/(1000*60*60*24));
                document.getElementById('refresh-btn').classList.remove('red');
                document.getElementById('refresh-btn').textContent= 'بارگیری اطلاعات جدید';
            }
        }
        else{
            document.getElementById('plan-info').classList.add('hidden');
            document.getElementById('no-plan-info').classList.remove('hidden');
            document.getElementById('refresh-btn').classList.add('red');
            document.getElementById('refresh-btn').textContent= 'خرید اشتراک';
            refreshInterval = setInterval(updatePlans, udatePlanTime);
        }
    }
    else console.log('file not found or does not contain Files data');
    document.getElementById('loading-screen').classList.add('hidden');
});
var payPlan = (plan) => {
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var data = JSON.parse(rawdata);
            var url = api + `pay-estate?username=${data.username}&password=${data.password}&plan=${plan}`;
            window.open(url, '_blank').focus();
        }
        else console.log('file not found');
    });
}
var addBookmark = (data, index) => {
    var item = document.createElement('div');
    item.classList.add('item');
    var info1 = document.createElement('table');
    info1.classList.add('info1');
    var td1 = document.createElement('td');
    td1.classList.add('column');
    td1.classList.add('col20');
    td1.classList.add('overflow-hidden');
    var label1 = document.createElement('div');
    label1.classList.add('label');
    label1.classList.add('green');
    label1.appendChild(document.createTextNode(data.state + ' '));
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        label1.classList.add('border-blue');
    else
        label1.classList.add('border-purple');
    
    var label2 = document.createElement('div');
    label2.classList.add('label');
    label2.classList.add('blue');
    label2.appendChild(document.createTextNode(data.type + ' '));
    td1.appendChild(label1);
    td1.appendChild(label2);
    
    var td2 = document.createElement('td');
    td2.classList.add('column');
    var name1 = document.createElement('div');
    name1.classList.add('name');
    name1.appendChild(document.createTextNode('آدرس: '));
    var value1 = document.createElement('div');
    value1.classList.add('value');
    value1.appendChild(document.createTextNode(data.address));
    td2.appendChild(name1);
    td2.appendChild(value1);
    
    var td3 = document.createElement('td');
    td3.classList.add('column');
    var name2 = document.createElement('div');
    name2.classList.add('name');
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        name2.appendChild(document.createTextNode('قیمت رهن: '));
    else
        name2.appendChild(document.createTextNode('قیمت متری: ')); 
    var value2 = document.createElement('div');
    value2.classList.add('value');
    value2.appendChild(document.createTextNode(getPrice(data.price)));
    td3.appendChild(name2);
    td3.appendChild(value2);

    var tdDate = document.createElement('td');
    tdDate.classList.add('column');
    var valueDate = document.createElement('div');
    valueDate.appendChild(document.createTextNode(data.date));
    tdDate.appendChild(valueDate);
    
    
    var td4 = document.createElement('td');
    td4.classList.add('column');
    var name3 = document.createElement('div');
    name3.classList.add('name');
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        name3.appendChild(document.createTextNode('قیمت اجاره: '));
    else
        name3.appendChild(document.createTextNode('قیمت کل: '));

    var value3 = document.createElement('div');
    value3.classList.add('value');
    value3.appendChild(document.createTextNode(getPrice(data.fullPrice)));
    td4.appendChild(name3);
    td4.appendChild(value3);
    
    var td5 = document.createElement('td');
    td5.classList.add('column');
    td5.classList.add('hidden');
    var name4 = document.createElement('div');
    name4.classList.add('name');
    name4.appendChild(document.createTextNode('نام مالک: '));
    var value4 = document.createElement('div');
    value4.classList.add('value');
    value4.appendChild(document.createTextNode(data.ownerName));
    td5.appendChild(name4);
    td5.appendChild(value4);

    var td6 = document.createElement('td');
    td6.classList.add('column');
    td6.classList.add('hidden');
    td6.appendChild(document.createTextNode(data.phone));
    
    var td7 = document.createElement('td');
    td7.classList.add('column');
    td7.classList.add('hidden');
    td7.appendChild(document.createTextNode(data.fileNumber));
    
    info1.appendChild(td1);
    info1.appendChild(td2);
    info1.appendChild(td3);
    info1.appendChild(td4);
    info1.appendChild(td5);
    info1.appendChild(td6);
    info1.appendChild(td7);
    info1.appendChild(tdDate);

    // Table 2
    var info2 = document.createElement('table');
    info2.classList.add('info2');
    var tr1 = document.createElement('tr');
    
    var tableTitle1 = document.createElement('td'); tableTitle1.classList.add('table-title'); tableTitle1.appendChild(document.createTextNode('متراژ'));tr1.appendChild(tableTitle1);
    var tableTitle2 = document.createElement('td'); tableTitle2.classList.add('table-title'); tableTitle2.appendChild(document.createTextNode('خواب'));tr1.appendChild(tableTitle2);
    var tableTitle3 = document.createElement('td'); tableTitle3.classList.add('table-title'); tableTitle3.appendChild(document.createTextNode('طبقه'));tr1.appendChild(tableTitle3);
    var tableTitle4 = document.createElement('td'); tableTitle4.classList.add('table-title'); tableTitle4.appendChild(document.createTextNode('طبقات'));tr1.appendChild(tableTitle4);
    var tableTitle5 = document.createElement('td'); tableTitle5.classList.add('table-title'); tableTitle5.appendChild(document.createTextNode('واحد'));tr1.appendChild(tableTitle5);
    var tableTitle6 = document.createElement('td'); tableTitle6.classList.add('table-title'); tableTitle6.appendChild(document.createTextNode('سن بنا'));tr1.appendChild(tableTitle6);
    var tableTitle7 = document.createElement('td'); tableTitle7.classList.add('table-title'); tableTitle7.appendChild(document.createTextNode('پارکینگ'));tr1.appendChild(tableTitle7);
    var tableTitle8 = document.createElement('td'); tableTitle8.classList.add('table-title'); tableTitle8.appendChild(document.createTextNode('انباری'));tr1.appendChild(tableTitle8);
    var tableTitle9 = document.createElement('td'); tableTitle9.classList.add('table-title'); tableTitle9.appendChild(document.createTextNode('آسانسور'));tr1.appendChild(tableTitle9);
    var tableTitle10= document.createElement('td');tableTitle10.classList.add('table-title');tableTitle10.appendChild(document.createTextNode('آشپزخانه'));tr1.appendChild(tableTitle10);
    var tableTitle11= document.createElement('td');tableTitle11.classList.add('table-title');tableTitle11.appendChild(document.createTextNode('نما'));tr1.appendChild(tableTitle11);
    var tableTitle12= document.createElement('td');tableTitle12.classList.add('table-title');tableTitle12.appendChild(document.createTextNode('کف'));tr1.appendChild(tableTitle12);
    var tableTitle13= document.createElement('td');tableTitle13.classList.add('table-title');tableTitle13.appendChild(document.createTextNode('سرویس'));tr1.appendChild(tableTitle13);
    var tableTitle14= document.createElement('td');tableTitle14.classList.add('table-title');tableTitle14.appendChild(document.createTextNode('سرمایش و گرمایش'));tr1.appendChild(tableTitle14);
    
    var tr2 = document.createElement('tr');
    var table1Value1 = document.createElement('td'); table1Value1.classList.add('table-value'); table1Value1.appendChild(document.createTextNode(data.meterage));tr2.appendChild(table1Value1);
    var table1Value2 = document.createElement('td'); table1Value2.classList.add('table-value'); table1Value2.appendChild(document.createTextNode(data.bedroom));tr2.appendChild(table1Value2);
    var table1Value3 = document.createElement('td'); table1Value3.classList.add('table-value'); table1Value3.appendChild(document.createTextNode(data.floor));tr2.appendChild(table1Value3);
    var table1Value4 = document.createElement('td'); table1Value4.classList.add('table-value'); table1Value4.appendChild(document.createTextNode(data.numOfFloors));tr2.appendChild(table1Value4);
    var table1Value5 = document.createElement('td'); table1Value5.classList.add('table-value'); table1Value5.appendChild(document.createTextNode(data.unit));tr2.appendChild(table1Value5);
    var table1Value6 = document.createElement('td'); table1Value6.classList.add('table-value'); table1Value6.appendChild(document.createTextNode(data.buildAge));tr2.appendChild(table1Value6);
    var table1Value7 = document.createElement('td'); table1Value7.classList.add('table-value'); table1Value7.appendChild(document.createTextNode(data.parking));tr2.appendChild(table1Value7);
    var table1Value8 = document.createElement('td'); table1Value8.classList.add('table-value'); table1Value8.appendChild(document.createTextNode(data.warehouse));tr2.appendChild(table1Value8);
    var table1Value9 = document.createElement('td'); table1Value9.classList.add('table-value'); table1Value9.appendChild(document.createTextNode(data.elevator));tr2.appendChild(table1Value9);
    var table1Value10= document.createElement('td');table1Value10.classList.add('table-value');table1Value10.appendChild(document.createTextNode(data.kitchen));tr2.appendChild(table1Value10);
    var table1Value11= document.createElement('td');table1Value11.classList.add('table-value');table1Value11.appendChild(document.createTextNode(data.view));tr2.appendChild(table1Value11);
    var table1Value12= document.createElement('td');table1Value12.classList.add('table-value');table1Value12.appendChild(document.createTextNode(data.floortype));tr2.appendChild(table1Value12);
    var table1Value13= document.createElement('td');table1Value13.classList.add('table-value');table1Value13.appendChild(document.createTextNode(data.service));tr2.appendChild(table1Value13);
    var table1Value14= document.createElement('td');table1Value14.classList.add('table-value');table1Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem));tr2.appendChild(table1Value14);
    
    info2.appendChild(tr1);
    info2.appendChild(tr2);

    var info3 = document.createElement('table');
    info3.classList.add('info3');
    var info3td1 = document.createElement('td');
    var info3name1;
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل'){
        info3name1 = document.createElement('div');info3name1.classList.add('name');info3name1.appendChild(document.createTextNode('قیمت رهن: '));info3td1.appendChild(info3name1);
    }else{
        info3name1 = document.createElement('div');info3name1.classList.add('name');info3name1.appendChild(document.createTextNode('قیمت متری: '));info3td1.appendChild(info3name1);
    }
    var info3value1 = document.createElement('div');info3value1.classList.add('value');info3value1.appendChild(document.createTextNode(data.price));info3td1.appendChild(info3value1);
    var info3td2 = document.createElement('td');
    var info3name2;
    if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل'){
        info3name2 = document.createElement('div');info3name2.classList.add('name');info3name2.appendChild(document.createTextNode('قیمت اجاره: '));info3td2.appendChild(info3name2);
    }else{
        info3name2 = document.createElement('div');info3name2.classList.add('name');info3name2.appendChild(document.createTextNode('قیمت کل: '));info3td2.appendChild(info3name2);
    }
    var info3value2 = document.createElement('div');info3value2.classList.add('value');info3value2.appendChild(document.createTextNode(data.fullPrice));info3td2.appendChild(info3value2);
    var info3td3 = document.createElement('td');
    // var moreButton = document.createElement('div');moreButton.classList.add('more');moreButton.id='more-btn-'+index.toString();moreButton.appendChild(document.createTextNode('مشاهده فایل'));info3td3.appendChild(moreButton);

    info3.appendChild(info3td1);
    info3.appendChild(info3td2);
    info3.appendChild(info3td3);
    info1.classList.add('hidden');
    info2.classList.add('hidden');
    info3.classList.add('hidden');
    
    var info4 = document.createElement('table');
    info4.classList.add('info4');
    var tr5 = document.createElement('tr');
    var table4Value1 = document.createElement('td'); table4Value1.classList.add('metrage'); table4Value1.appendChild(document.createTextNode(data.meterage));tr5.appendChild(table4Value1);
    var table4Value2 = document.createElement('td'); table4Value2.classList.add('bedroom'); table4Value2.appendChild(document.createTextNode(data.bedroom));tr5.appendChild(table4Value2);
    var table4Value3 = document.createElement('td'); table4Value3.classList.add('floor'); table4Value3.appendChild(document.createTextNode(data.floor));tr5.appendChild(table4Value3);
    var table4Value4 = document.createElement('td'); table4Value4.classList.add('build-age'); table4Value4.appendChild(document.createTextNode(data.buildAge));tr5.appendChild(table4Value4);
    var table4Value5 = document.createElement('td'); table4Value5.classList.add('address'); table4Value5.appendChild(document.createTextNode(getAddress(data.address)));tr5.appendChild(table4Value5);
    var table4Value55 = document.createElement('td'); table4Value55.classList.add('date'); table4Value55.appendChild(document.createTextNode(data.date));tr5.appendChild(table4Value55);
    var table4Value555 = document.createElement('td'); table4Value555.classList.add('price'); table4Value555.appendChild(document.createTextNode(getPrice(data.price)));tr5.appendChild(table4Value555);
    var table4Value6 = document.createElement('td'); table4Value6.classList.add('price'); table4Value6.appendChild(document.createTextNode(getPrice(data.fullPrice)));tr5.appendChild(table4Value6);
    info4.appendChild(tr5);
    if(data.type == 'کلنگی' || data.type == 'مستغلات' || data.type == 'زمین')
        info4.classList.add('border-red');
    else if(data.state == 'رهن و اجاره' || data.state == 'رهن کامل')
        info4.classList.add('border-blue');
    else
        info4.classList.add('border-purple');
    info1.classList.add('info-1');
    info2.classList.add('info-2');
    info3.classList.add('info-3');
    info4.classList.add('info-4');
    item.appendChild(info1);
    item.appendChild(info2);
    item.appendChild(info3);
    item.appendChild(info4);
    item.id='more-bookmark-btn-'+index.toString();
    bookmarksContainer.appendChild(item);
}
var updateBookmarksHandlers = (data) => {
    var moreButtons = [];
    for (let i = 0; i < data.length; i++) {
        moreButtons.push({btn: $(`#more-bookmark-btn-${i}`), id: i, data: data[i]});
    }
    moreButtons.forEach(more => {
        more.btn.click(() => {            
            $('#file-popup').fadeIn(500);
            $('#next-file-btn').fadeIn(500);
            $('#prev-file-btn').fadeIn(500);
            $('.black-modal').fadeIn(500);
            loadData(more.data, moreButtons.length, more.id);
            activeFile = more.data;
        });
    });
}
var loadBookmarks = () => {
    var bookmarks = getBookmarks();
    removeAllChildNodes(bookmarksContainer);
    for (let i = 0; i < bookmarks.length; i++) {
        addBookmark(bookmarks[i], i);
    }
    updateBookmarksHandlers(bookmarks);
}
var updateNews = () => {
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var estate = JSON.parse(rawdata);
            fetch(api + `get-news?username=${estate.username}&password=${estate.password}`)
                .then(res => res.json())
                .then(data => {
                    var newsContainer = document.getElementById('news-container');
                    for (let i = 0; i < data.length; i++) {
                        var news = document.createElement('div');
                        news.classList.add('news');
                        var h1 = document.createElement('h1');    h1.textContent = data[i].title; news.appendChild(h1);
                        var p = document.createElement('p');      p.textContent = data[i].text;   news.appendChild(p);
                        var date = document.createElement('div'); date.textContent = convertDate(new Date(data[i].date)); date.classList.add('date'); news.appendChild(date);
                        var seen = document.createElement('div'); seen.classList.add('seen');
                        var icon = document.createElement('i');   icon.classList.add('fa'); icon.classList.add('fa-eye'); seen.appendChild(icon);
                        var num  = document.createElement('div'); num.classList.add('num'); num.textContent = data[i].seen; seen.appendChild(num);
                        news.appendChild(seen);
                        newsContainer.appendChild(news);
                    }
                }).catch(err => console.log(err));
        }
    });
}
var onChangeNumber = () => {
    var x = numberSelect.value;
    if(x == 'all') numberOfFilesInPage = 10000000;
    else numberOfFilesInPage = parseInt(x);
    currentPage = 1;
    showFiles();
}
updateNews();
setInterval(updateNews, 10 * 60 * 1000);
$(document).ready(() => {
    $('#next-file-btn').hide();
    $('#prev-file-btn').hide();
    var closeAll = () => {
        $('#plans-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
        $('#file-popup').fadeOut(500);
        $('#next-file-btn').fadeOut(500);
        $('#prev-file-btn').fadeOut(500);
    }
    $('#refresh-btn').click(() => {
        refresh2();
    });
    $('#refresh-btn2').click(() => {
        refresh();
    });
    $('.close-popup').click(() =>{
        closeAll();
    });
    $('.black-modal').click(() =>{
        closeAll();
    });
    $('#plan0-btn').click(() => {payPlan(0);closeAll();});
    $('#plan1-btn').click(() => {payPlan(1);closeAll();});
    $('#plan2-btn').click(() => {payPlan(2);closeAll();});
    $('#plan3-btn').click(() => {payPlan(3);closeAll();});
    $('#pro-search-btn').click(() => {
        $('#pro-search-view').slideToggle(500);
    })
    $('#view-table-btn').click(() => {
        document.getElementById('loading-screen').classList.remove('hidden');
        setTimeout(() => {
            $('#view-table-btn').addClass('active');
            $('#view-bookmark-btn').removeClass('active');
            $('#view-column-btn').removeClass('active');
            $('.info4-header').show();
            $('.info-4').removeClass('hidden');
            $('.info-1').addClass('hidden');
            $('.info-2').addClass('hidden');
            pageNumbersView.style.display = '';
            filesContainer.style.display = '';
            bookmarksContainer.style.display = 'none';
            activeMenu = 'table';
            document.getElementById('loading-screen').classList.add('hidden');
        }, 10);
    });
    $('#view-column-btn').click(() => {
        document.getElementById('loading-screen').classList.remove('hidden');
        setTimeout(() => {
            $('#view-table-btn').removeClass('active');
            $('#view-bookmark-btn').removeClass('active');
            $('#view-column-btn').addClass('active');
            $('.info4-header').hide();
            $('.info-4').addClass('hidden');
            $('.info-1').removeClass('hidden');
            $('.info-2').removeClass('hidden');
            pageNumbersView.style.display = '';
            filesContainer.style.display = '';
            bookmarksContainer.style.display = 'none';
            activeMenu = 'files';
            document.getElementById('loading-screen').classList.add('hidden');
        }, 10);
    });
    $('#view-bookmark-btn').click(() => {
        document.getElementById('loading-screen').classList.remove('hidden');
        setTimeout(() => {
            $('#view-table-btn').removeClass('active');
            $('#view-bookmark-btn').addClass('active');
            $('#view-column-btn').removeClass('active');
            pageNumbersView.style.display = 'none';
            filesContainer.style.display = 'none';
            bookmarksContainer.style.display = '';
            loadBookmarks();
            activeMenu = 'bookmarks';
            document.getElementById('loading-screen').classList.add('hidden');
        }, 10);
    });
    $('#delete-files').click(() => {
        removeAllChildNodes(filesContainer);
        fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
            if(rawdata){
                var estate = JSON.parse(rawdata);
                estate.files = [];
                saveEstate(estate.username, estate.password, estate.estate, estate.files);

            }
        });
    });
    $('#file-print-button').click(() => {
        document.getElementById('home-frame').classList.add('hidden');
        document.getElementById('file-print-frame').classList.remove('hidden');
        $('#file-popup').fadeOut(500);
        $('#next-file-btn').fadeOut(500);
        $('#prev-file-btn').fadeOut(500);
        $('.black-modal').fadeOut(500);
        loadPDFData(activeFile);
        var beforePrint = function () {
            // alert('Functionality to run before printing.');
        };
        var afterPrint = function () {
            // alert('Functionality to run after printing');
            document.getElementById('home-frame').classList.remove('hidden');
            document.getElementById('file-print-frame').classList.add('hidden');
            $('#file-popup').fadeIn(500);
            $('#next-file-btn').fadeIn(500);
            $('#prev-file-btn').fadeIn(500);
            $('.black-modal').fadeIn(500);
        };
        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function (mql) {
                //alert($(mediaQueryList).html());
                if (mql.matches) {
                    beforePrint();
                } else {
                    afterPrint();
                }
            });
        }
        window.onbeforeprint = beforePrint;
        window.onafterprint = afterPrint;
        setTimeout(() => {
            window.print();
        }, 1000);
    });
    $('.mark-file-btn').click(() => {
        $('.mark-file-btn').hide();
        $('.mark-file-btn-o').show();
        fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
            if(rawdata){
                var data = JSON.parse(rawdata);
                if(!data.bookmarks) data.bookmarks = [];
                var index = -1;
                for(var i=0; i<data.bookmarks.length; i++)
                    if(data.bookmarks[i].fileNumber == activeFile.fileNumber)
                        index = i;
                if(index == -1) data.bookmarks.push(activeFile);
                saveEstate(data.username, data.password, data.estate, data.files, data.bookmarks);
            }
        });
    });
    $('.mark-file-btn-o').click(() => {
        $('.mark-file-btn-o').hide();
        $('.mark-file-btn').show();
        fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
            if(rawdata){
                var data = JSON.parse(rawdata);
                if(!data.bookmarks) data.bookmarks = [];
                var index = -1;
                for(var i=0; i<data.bookmarks.length; i++)
                    if(data.bookmarks[i].fileNumber == activeFile.fileNumber)
                        index = i;
                if(index != -1) data.bookmarks.splice(index, 1);
                saveEstate(data.username, data.password, data.estate, data.files, data.bookmarks);
                loadBookmarks();
            }
        });
    });
    $('#cancle-refresh-btn').click(() => {
        refreshCancled = true;
        downloadBar.classList.add('hidden');
        loadingScreen.classList.add('hidden');
    });
    $('#zoom-in').click(() => {
        document.getElementById('file-popup').style.transform = "scale(1.16)";
        $('#zoom-in').hide();
        $('#zoom-out').show();
    });
    $('#zoom-out').click(() => {
        document.getElementById('file-popup').style.transform = "scale(1)";
        $('#zoom-in').show();
        $('#zoom-out').hide();
    });
    $('#open-website').click(() => {
        shell.openExternal("https://fileestore.ir")
    });
    $('#prev-filepage-btn').click(() => {
        if(currentPage > 1) currentPage--;
        showFiles();
    });
    $('#next-filepage-btn').click(() => {
        if(currentPage < showingFiles.length/numberOfFilesInPage) currentPage++;
        showFiles();
    });
    $('#filepage-number-1').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 1;
        else if(currentPage > maxpage-4) currentPage = maxpage - 6;
        else currentPage = currentPage - 3;
        showFiles();
    })
    $('#filepage-number-2').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 2;
        else if(currentPage > maxpage-4) currentPage = maxpage - 5;
        else currentPage = currentPage - 2;
        showFiles();
    })
    $('#filepage-number-3').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 3;
        else if(currentPage > maxpage-4) currentPage = maxpage - 4;
        else currentPage = currentPage - 1;
        showFiles();
    })
    $('#filepage-number-4').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 4;
        else if(currentPage > maxpage-4) currentPage = maxpage - 3;
        else currentPage = currentPage;
        showFiles();
    })
    $('#filepage-number-5').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 5;
        else if(currentPage > maxpage-4) currentPage = maxpage - 2;
        else currentPage = currentPage + 1;
        showFiles();
    })
    $('#filepage-number-6').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 6;
        else if(currentPage > maxpage-4) currentPage = maxpage - 1;
        else currentPage = currentPage + 2;
        showFiles();
    })
    $('#filepage-number-7').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        if(currentPage < 4) currentPage = 7;
        else if(currentPage > maxpage-4) currentPage = maxpage;
        else currentPage = currentPage + 3;
        showFiles();
    })
    $('#filepage-number-8').click(() => {
        var maxpage = Math.floor(showingFiles.length/numberOfFilesInPage);
        currentPage = maxpage;
        showFiles();
    })
    $('#next-file-btn').click(() => {
        if(activeMenu != 'bookmarks'){
            var index = parseInt(document.getElementById('popup-index').textContent);
            loadData(showingFiles[index+1], showingFiles.length, index+1);
            activeFile = showingFiles[index+1].data;
        }
        else{
            var bookmarks = getBookmarks();
            var index = parseInt(document.getElementById('popup-index').textContent);
            loadData(bookmarks[index+1], bookmarks.length, index+1);
            activeFile = bookmarks[index+1].data;
        }
    });
    $('#prev-file-btn').click(() => {
        if(activeMenu != 'bookmarks'){
            var index = parseInt(document.getElementById('popup-index').textContent);
            loadData(showingFiles[index-1], showingFiles.length, index-1);
            activeFile = showingFiles[index-1].data;
        }
        else{
            var bookmarks = getBookmarks();
            var index = parseInt(document.getElementById('popup-index').textContent);
            loadData(bookmarks[index-1], bookmarks.length, index-1);
            activeFile = bookmarks[index-1].data;
        }
    });

    // ---- search:
    $("#metrage-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 200, 500 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#metrage-min").html(500 - ui.values[1]);
            if(500 - ui.values[0] == 500)
                $("#metrage-max").html((500 - ui.values[0]).toString() + '+');
            else
                $("#metrage-max").html(500 - ui.values[0]);
            minMetrage = 500 - ui.values[1];
            maxMetrage = 500 - ui.values[0];
            // filter();
        }
    });
    $("#price1-slider").slider({
        range: true,
        min: 0,
        max: 1900,
        values: [ 1500, 1900 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            // $("#price1-min").html(1000 - ui.values[1]);
            if(2000 - ui.values[0] < 1000)
                $("#price1-min").html((2000 - ui.values[1]).toString());
            else
               $("#price1-min").html((Math.floor((2000 - ui.values[1])/100)/10).toString());
            if(2000 - ui.values[0] == 2000)
                $("#price1-max").html('2+ میلیارد');
            else if(2000 - ui.values[0] < 1000)
                $("#price1-max").html((2000 - ui.values[0]).toString() + ' میلیون');
            else
               $("#price1-max").html((Math.floor((2000 - ui.values[0])/100)/10).toString() + ' میلیارد');
            minPrice1 = 2000 - ui.values[1];
            maxPrice1 = 2000 - ui.values[0];
            // filter();
        }
    });
    $("#price2-slider").slider({
        range: true,
        min: 0,
        max: 99,
        values: [ 50, 99 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#price2-min").html(100 - ui.values[1]);
            if(100 - ui.values[0] == 100)
                $("#price2-max").html((100 - ui.values[0]).toString() + '+ میلیون');
            else
                $("#price2-max").html((100 - ui.values[0]).toString() + ' میلیون');
            minPrice2 = 100 - ui.values[1];
            maxPrice2 = 100 - ui.values[0];
            // filter();    
        }
    });
    $("#age-slider").slider({
        range: true,
        min: 0,
        max: 99,
        values: [ 70, 99 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#age-min").html(100 - ui.values[1]);
            if(100 - ui.values[0] == 100)
                $("#age-max").html((100 - ui.values[0]).toString() + '+');
            else
                $("#age-max").html(100 - ui.values[0]);
            minAge = 100 - ui.values[1];
            maxAge = 100 - ui.values[0];
            // filter();    
        }
    });
    $('#apartment-btn').click(() => {
        if(document.getElementById('apartment-btn').className.split(/\s+/)[1] == 'active'){
            $('#apartment-btn').removeClass('active');
            apartment = false;
        }else{
            $('#apartment-btn').addClass('active');
            apartment = true;
        }
        // filter();
    })
    $('#vilage-btn').click(() => {
        if(document.getElementById('vilage-btn').className.split(/\s+/)[1] == 'active'){
            $('#vilage-btn').removeClass('active');
            vilage = false;
        }else{
            $('#vilage-btn').addClass('active');
            vilage = true;
        }
        // filter();
    })
    $('#old-btn').click(() => {
        if(document.getElementById('old-btn').className.split(/\s+/)[1] == 'active'){
            $('#old-btn').removeClass('active');
            old = false;
        }else{
            $('#old-btn').addClass('active');
            old = true;
        }
        // filter();
    })
    $('#business-btn').click(() => {
        if(document.getElementById('business-btn').className.split(/\s+/)[1] == 'active'){
            $('#business-btn').removeClass('active');
            business = false;
        }else{
            $('#business-btn').addClass('active');
            business = true;
        }
        // filter();
    })
    $('#office-btn').click(() => {
        if(document.getElementById('office-btn').className.split(/\s+/)[1] == 'active'){
            $('#office-btn').removeClass('active');
            office = false;
        }else{
            $('#office-btn').addClass('active');
            office = true;
        }
        // filter();
    })
    $('#office-estate-btn').click(() => {
        if(document.getElementById('office-estate-btn').className.split(/\s+/)[1] == 'active'){
            $('#office-estate-btn').removeClass('active');
            officeEstate = false;
        }else{
            $('#office-estate-btn').addClass('active');
            officeEstate = true;
        }
        // filter();
    })
    $('#land-btn').click(() => {
        if(document.getElementById('land-btn').className.split(/\s+/)[1] == 'active'){
            $('#land-btn').removeClass('active');
            land = false;
        }else{
            $('#land-btn').addClass('active');
            land = true;
        }
        // filter();
    })
    $('#mostaghelat-btn').click(() => {
        if(document.getElementById('mostaghelat-btn').className.split(/\s+/)[1] == 'active'){
            $('#mostaghelat-btn').removeClass('active');
            mostaghelat = false;
        }else{
            $('#mostaghelat-btn').addClass('active');
            mostaghelat = true;
        }
        // filter();
    })
    $('#sell-btn').click(() => {
        if(document.getElementById('sell-btn').className.split(/\s+/)[1] == 'active'){
            $('#sell-btn').removeClass('active');
            sell = false;
        }else{
            $('#sell-btn').addClass('active');
            sell = true;
        }
        // filter();
    })
    $('#presell-btn').click(() => {
        if(document.getElementById('presell-btn').className.split(/\s+/)[1] == 'active'){
            $('#presell-btn').removeClass('active');
            presell = false;
        }else{
            $('#presell-btn').addClass('active');
            presell = true;
        }
        // filter();
    })
    $('#exchange-btn').click(() => {
        if(document.getElementById('exchange-btn').className.split(/\s+/)[1] == 'active'){
            $('#exchange-btn').removeClass('active');
            exchange = false;
        }else{
            $('#exchange-btn').addClass('active');
            exchange = true;
        }
        // filter();
    })
    $('#cooperate-btn').click(() => {
        if(document.getElementById('cooperate-btn').className.split(/\s+/)[1] == 'active'){
            $('#cooperate-btn').removeClass('active');
            cooperate = false;
        }else{
            $('#cooperate-btn').addClass('active');
            cooperate = true;
        }
        // filter();
    })
    $('#rent-btn').click(() => {
        if(document.getElementById('rent-btn').className.split(/\s+/)[1] == 'active'){
            $('#rent-btn').removeClass('active');
            rent = false;
        }else{
            $('#rent-btn').addClass('active');
            rent = true;
        }
        // filter();
    })
    $('#rent2-btn').click(() => {
        if(document.getElementById('rent2-btn').className.split(/\s+/)[1] == 'active'){
            $('#rent2-btn').removeClass('active');
            rent2 = false;
        }else{
            $('#rent2-btn').addClass('active');
            rent2 = true;
        }
        // filter();
    });
    $('#refresh-btn').click(() => {
        // setTimeout(filter, 1000);
    });
    $('#filter-btn').click(() => {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
    });
    $('#filter-btn').click(() => {
        filter();
    });
    $('.clear-filters-btn').click(() => {
        document.getElementById('loading-screen').classList.remove('hidden');
        setTimeout(() => {
            clearFilters();
            document.getElementById('loading-screen').classList.add('hidden');
        }, 10);
    });
    $('#view-table-btn').click(() => {
        activeMenu = 'files';
    });
    $('#view-column-btn').click(() => {
        activeMenu = 'files';
    });
    $('#view-bookmark-btn').click(() => {
        activeMenu = 'bookmarks';
    });
    document.getElementById('address-search').addEventListener('keyup', search);
    // ------------



    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('#file-popup').fadeOut(500);
            $('#next-file-btn').fadeOut(500);
            $('#prev-file-btn').fadeOut(500);
            $('.black-modal').fadeOut(500);
            activeFile = null;
        }
        if (e.keyCode  == 39) { //next
            if(activeMenu != 'bookmarks'){
                var index = parseInt(document.getElementById('popup-index').textContent);
                if(index < showingFiles.length-1) {
                    loadData(showingFiles[index+1], showingFiles.length, index+1);
                    activeFile = showingFiles[index+1].data;
                }
            }
            else{
                var bookmarks = getBookmarks();
                var index = parseInt(document.getElementById('popup-index').textContent);
                if(index < bookmarks.length-1) {
                    loadData(bookmarks[index+1], bookmarks.length, index+1);
                    activeFile = bookmarks[index+1].data;
                }
            }
        }
        if (e.keyCode  == 37) { //prev
            if(activeMenu != 'bookmarks'){
                var index = parseInt(document.getElementById('popup-index').textContent);
                if(index > 0) {
                    loadData(showingFiles[index-1], showingFiles.length, index-1);
                    activeFile = showingFiles[index-1].data;
                }
            }
            else{
                var bookmarks = getBookmarks();
                var index = parseInt(document.getElementById('popup-index').textContent);
                if(index > 0) {
                    loadData(bookmarks[index-1], bookmarks.length, index-1);
                    activeFile = bookmarks[index-1].data;
                }
            }
        }
    });
    numberSelect.addEventListener('change', onChangeNumber);
});



