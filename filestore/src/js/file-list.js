var fs = require('fs');
var path = require('path');
var api = require('./api');
var pathName = path.join(__dirname, '../files');
var filesContainer = document.getElementById('file-list-container');
var errorMsg = document.getElementById('error-msg');
var successMsg = document.getElementById('success-msg');

var saveEstate = (username, password, estate, files) => {
    var file = path.join(pathName, 'estate.json');
    var estateInfo = {username, password, estate, files};
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
var showSuccess = (text) => {
    successMsg.classList.remove('hidden');
    successMsg.textContent = text;
    setTimeout(() => {
        successMsg.classList.add('hidden');
    }, 3000);
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
var addFile = (data, index) => {
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
    name1.appendChild(document.createTextNode('نام مالک: '));
    var value1 = document.createElement('div');
    value1.classList.add('value');
    value1.appendChild(document.createTextNode(data.ownerName));
    td2.appendChild(name1);
    td2.appendChild(value1);
    
    var td3 = document.createElement('td');
    td3.classList.add('column');
    var name2 = document.createElement('div');
    name2.classList.add('name');
    name2.appendChild(document.createTextNode('تلفن: '));
    var value2 = document.createElement('div');
    value2.classList.add('value');
    value2.appendChild(document.createTextNode(data.phone));
    td3.appendChild(name2);
    td3.appendChild(value2);
    
    var td4 = document.createElement('td');
    td4.classList.add('column');
    var name3 = document.createElement('div');
    name3.classList.add('name');
    name3.appendChild(document.createTextNode('آدرس: '));
    var value3 = document.createElement('div');
    value3.classList.add('value');
    value3.appendChild(document.createTextNode(data.address));
    td4.appendChild(name3);
    td4.appendChild(value3);
    
    info1.appendChild(td1);
    info1.appendChild(td2);
    info1.appendChild(td3);
    info1.appendChild(td4);

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
    
    var tr3 = document.createElement('tr');
    var table2Value1 = document.createElement('td'); table2Value1.classList.add('table-value'); table2Value1.appendChild(document.createTextNode(data.meterage2));tr3.appendChild(table2Value1);
    var table2Value2 = document.createElement('td'); table2Value2.classList.add('table-value'); table2Value2.appendChild(document.createTextNode(data.bedroom2));tr3.appendChild(table2Value2);
    var table2Value3 = document.createElement('td'); table2Value3.classList.add('table-value'); table2Value3.appendChild(document.createTextNode(data.floor2));tr3.appendChild(table2Value3);
    var table2Value4 = document.createElement('td'); table2Value4.classList.add('table-value'); table2Value4.appendChild(document.createTextNode(data.numOfFloors2));tr3.appendChild(table2Value4);
    var table2Value5 = document.createElement('td'); table2Value5.classList.add('table-value'); table2Value5.appendChild(document.createTextNode(data.unit2));tr3.appendChild(table2Value5);
    var table2Value6 = document.createElement('td'); table2Value6.classList.add('table-value'); table2Value6.appendChild(document.createTextNode(data.buildAge2));tr3.appendChild(table2Value6);
    var table2Value7 = document.createElement('td'); table2Value7.classList.add('table-value'); table2Value7.appendChild(document.createTextNode(data.parking2));tr3.appendChild(table2Value7);
    var table2Value8 = document.createElement('td'); table2Value8.classList.add('table-value'); table2Value8.appendChild(document.createTextNode(data.warehouse2));tr3.appendChild(table2Value8);
    var table2Value9 = document.createElement('td'); table2Value9.classList.add('table-value'); table2Value9.appendChild(document.createTextNode(data.elevator2));tr3.appendChild(table2Value9);
    var table2Value10= document.createElement('td');table2Value10.classList.add('table-value');table2Value10.appendChild(document.createTextNode(data.kitchen2));tr3.appendChild(table2Value10);
    var table2Value11= document.createElement('td');table2Value11.classList.add('table-value');table2Value11.appendChild(document.createTextNode(data.view2));tr3.appendChild(table2Value11);
    var table2Value12= document.createElement('td');table2Value12.classList.add('table-value');table2Value12.appendChild(document.createTextNode(data.floortype2));tr3.appendChild(table2Value12);
    var table2Value13= document.createElement('td');table2Value13.classList.add('table-value');table2Value13.appendChild(document.createTextNode(data.service2));tr3.appendChild(table2Value13);
    var table2Value14= document.createElement('td');table2Value14.classList.add('table-value');table2Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem2));tr3.appendChild(table2Value14);
    
    var tr4 = document.createElement('tr');
    var table3Value1 = document.createElement('td'); table3Value1.classList.add('table-value'); table3Value1.appendChild(document.createTextNode(data.meterage3));tr4.appendChild(table3Value1);
    var table3Value2 = document.createElement('td'); table3Value2.classList.add('table-value'); table3Value2.appendChild(document.createTextNode(data.bedroom3));tr4.appendChild(table3Value2);
    var table3Value3 = document.createElement('td'); table3Value3.classList.add('table-value'); table3Value3.appendChild(document.createTextNode(data.floor3));tr4.appendChild(table3Value3);
    var table3Value4 = document.createElement('td'); table3Value4.classList.add('table-value'); table3Value4.appendChild(document.createTextNode(data.numOfFloors3));tr4.appendChild(table3Value4);
    var table3Value5 = document.createElement('td'); table3Value5.classList.add('table-value'); table3Value5.appendChild(document.createTextNode(data.unit3));tr4.appendChild(table3Value5);
    var table3Value6 = document.createElement('td'); table3Value6.classList.add('table-value'); table3Value6.appendChild(document.createTextNode(data.buildAge3));tr4.appendChild(table3Value6);
    var table3Value7 = document.createElement('td'); table3Value7.classList.add('table-value'); table3Value7.appendChild(document.createTextNode(data.parking3));tr4.appendChild(table3Value7);
    var table3Value8 = document.createElement('td'); table3Value8.classList.add('table-value'); table3Value8.appendChild(document.createTextNode(data.warehouse3));tr4.appendChild(table3Value8);
    var table3Value9 = document.createElement('td'); table3Value9.classList.add('table-value'); table3Value9.appendChild(document.createTextNode(data.elevator3));tr4.appendChild(table3Value9);
    var table3Value10= document.createElement('td');table3Value10.classList.add('table-value');table3Value10.appendChild(document.createTextNode(data.kitchen3));tr4.appendChild(table3Value10);
    var table3Value11= document.createElement('td');table3Value11.classList.add('table-value');table3Value11.appendChild(document.createTextNode(data.view3));tr4.appendChild(table3Value11);
    var table3Value12= document.createElement('td');table3Value12.classList.add('table-value');table3Value12.appendChild(document.createTextNode(data.floortype3));tr4.appendChild(table3Value12);
    var table3Value13= document.createElement('td');table3Value13.classList.add('table-value');table3Value13.appendChild(document.createTextNode(data.service3));tr4.appendChild(table3Value13);
    var table3Value14= document.createElement('td');table3Value14.classList.add('table-value');table3Value14.appendChild(document.createTextNode(data.heatingAndCoolingSystem3));tr4.appendChild(table3Value14);
    
    info2.appendChild(tr1);
    info2.appendChild(tr2);
    info2.appendChild(tr3);
    info2.appendChild(tr4);

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
    var moreButton = document.createElement('div');moreButton.classList.add('more');moreButton.id='more-btn-'+index.toString();moreButton.appendChild(document.createTextNode('مشاهده فایل'));info3td3.appendChild(moreButton);


    info3.appendChild(info3td1);
    info3.appendChild(info3td2);
    info3.appendChild(info3td3);

    item.appendChild(info1);
    item.appendChild(info2);
    item.appendChild(info3);
    filesContainer.appendChild(item);
}
var refresh = () => {
    fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
        if(rawdata){
            var estate = JSON.parse(rawdata);
            // console.log(estate);
            fetch(api + `get-files?username=${estate.username}&password=${estate.password}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    saveEstate(estate.username, estate.password, estate.estate, data.files);
                    removeAllChildNodes(filesContainer);
                    for(var i=0; i<data.files.length; i++){
                        addFile(data.files[i], i);
                    }
                    showSuccess('بارگیری با موفقیت انجام شد');
                }).catch(err => {showError('خطای اتصال به اینترنت')});
        }
        else console.log('file not found');
    });
}
fs.readFile(path.join(pathName, 'estate.json'), (err, rawdata) => {
    removeAllChildNodes(filesContainer);
    if(rawdata && JSON.parse(rawdata).files){
        var data = JSON.parse(rawdata);
        console.log(data);
        for(var i=0; i<data.files.length; i++){
            addFile(data.files[i], i);
        }
    }
    else console.log('file not found or does not contain Files data');
});
$(document).ready(() => {
    $('#refresh-btn').click(() => {
        refresh();
    });

})