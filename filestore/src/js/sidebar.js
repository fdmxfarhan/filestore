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
var refresh = true;
var lastSearchText = '';
var activeMenu = 'files';

var search = () => {
    var text = document.getElementById('address-search').value;
    var filesContainer = document.getElementById('file-list-container');
    if(activeMenu == 'bookmarks') filesContainer = document.getElementById('file-bookmark-container');
    var items = filesContainer.getElementsByClassName('item');
    if(text == '' || text.length < lastSearchText.length) filter();
    for(var i=0; i<items.length; i++){
        var address = items[i].getElementsByClassName('info1')[0].getElementsByClassName('column')[1].getElementsByClassName('value')[0].textContent;
        var ownerName = items[i].getElementsByClassName('info1')[0].getElementsByClassName('column')[4].getElementsByClassName('value')[0].textContent;
        var phone = items[i].getElementsByClassName('info1')[0].getElementsByClassName('column')[5].textContent;
        var fileNumber = items[i].getElementsByClassName('info1')[0].getElementsByClassName('column')[6].textContent;
        var metrage = items[i].getElementsByClassName('info2')[0].getElementsByTagName('tr')[1].getElementsByClassName('table-value')[0].textContent;
        if(items[i].style.display != 'none'){
            if(address.indexOf(text) != -1 || ownerName.indexOf(text) != -1 || phone.indexOf(text) != -1 || fileNumber.indexOf(text) != -1 || metrage.indexOf(text) != -1)
                items[i].style.display = '';
            else
                items[i].style.display = 'none';
        }
    }
    lastSearchText = text;
}
var filter = () => {
    var loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    setTimeout(() => {
        maxMetrage = parseInt(document.getElementById('metrage-max-input').value);
        minMetrage = parseInt(document.getElementById('metrage-min-input').value);
        minPrice1 = parseInt(document.getElementById('price1-min-input').value);
        maxPrice1 = parseInt(document.getElementById('price1-max-input').value);
        minPrice2 = parseInt(document.getElementById('price2-min-input').value);
        maxPrice2 = parseInt(document.getElementById('price2-max-input').value);
        var filesContainer = document.getElementById('file-list-container');
        if(activeMenu == 'bookmarks') filesContainer = document.getElementById('file-bookmark-container');
        items = filesContainer.childNodes;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            var metrage = parseInt(item.childNodes[1].childNodes[1].childNodes[0].textContent);
            var fileNumber = item.getElementsByClassName('info1')[0].getElementsByClassName('column')[6].textContent;
            var trackingFileNumber = '13167';
            // if((maxMetrage != 500 && metrage > maxMetrage) || metrage < minMetrage)
            if(!((metrage > minMetrage || isNaN(minMetrage)) && (metrage < maxMetrage || isNaN(maxMetrage))) && !isNaN(metrage)){
                item.style.display = 'none';
            }else {
                if(fileNumber == trackingFileNumber) console.log('metrage ok');
                item.style.display = 'block';
                var price1 = parseInt(item.childNodes[2].childNodes[1].childNodes[1].textContent)/1000000;
                if(fileNumber == trackingFileNumber) console.log({price1, minPrice1, maxPrice1});
                // if((maxPrice1 != 2000 && price1 > maxPrice1) || price1 < minPrice1)
                if(!((price1 > minPrice1 || isNaN(minPrice1)) && (price1 < maxPrice1 || isNaN(maxPrice1))) && !isNaN(price1))
                    item.style.display = 'none';
                else {
                    if(fileNumber == trackingFileNumber) console.log('price1 ok');
                    item.style.display = 'block';
                    var price2 = parseInt(item.childNodes[2].childNodes[0].childNodes[1].textContent)/1000000;
                    // if((maxPrice2 != 100 && price2 > maxPrice2) || price2 < minPrice2)
                    if(!((price2 > minPrice2 || isNaN(minPrice2)) && (price2 < maxPrice2 || isNaN(maxPrice2))) && !isNaN(price2))
                        item.style.display = 'none';
                    else {
                        if(fileNumber == trackingFileNumber) console.log('price2 ok');
                        item.style.display = 'block';
                        var age = parseInt(item.childNodes[1].childNodes[1].childNodes[5].textContent);
                        if(((maxAge != 100 && age > maxAge) || age < minAge) && !isNaN(maxAge))
                            item.style.display = 'none';
                        else {
                            if(fileNumber == trackingFileNumber) console.log('maxAge ok');
                            item.style.display = 'block';
                            var type = item.childNodes[0].childNodes[0].childNodes[1].textContent;
                            var state = item.childNodes[0].childNodes[0].childNodes[0].textContent;
                            if(!apartment         && type == 'آپارتمان ')      {item.style.display = 'none';if(fileNumber == trackingFileNumber) console.log('type incorrect');}
                            else if(!vilage       && type == 'ویلایی ')         item.style.display = 'none';
                            else if(!old          && type == 'کلنگی ')         item.style.display = 'none';
                            else if(!business     && type == 'تجاری ')         item.style.display = 'none';
                            else if(!office       && type == 'اداری ')         item.style.display = 'none';
                            else if(!officeEstate && type == 'موقعیت اداری ') item.style.display = 'none';
                            else if(!land         && type == 'زمین ')          item.style.display = 'none';
                            else if(!mostaghelat  && type == 'مستغلات ')        item.style.display = 'none';
                            else if(!sell         && state == 'فروش ')         item.style.display = 'none';
                            else if(!presell      && state == 'پیش‌فروش ')      item.style.display = 'none';
                            else if(!exchange     && state == 'معاوضه ')       item.style.display = 'none';
                            else if(!cooperate    && state == 'مشارکت ')       item.style.display = 'none';
                            else if(!rent         && state == 'رهن و اجاره ')  item.style.display = 'none';
                            else if(!rent2        && state == 'رهن کامل ')     {item.style.display = 'none';if(fileNumber == trackingFileNumber) console.log('state incorrect');}
                            else {
                                item.style.display = 'block';
                                if(fileNumber == trackingFileNumber) console.log('type and state ok');
                            }
                        }
                    }
                }
            }
        }
    }, 100);
    setTimeout(() => {
        var loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 100);
}
var clearFilters = () => {
    var filesContainer = document.getElementById('file-list-container');
    if(activeMenu == 'bookmarks') filesContainer = document.getElementById('file-bookmark-container');
    var items = filesContainer.getElementsByClassName('item');
    for(var i=0; i<items.length; i++){
        items[i].style.display = '';
    }
}
$(document).ready(() => {
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
    
})