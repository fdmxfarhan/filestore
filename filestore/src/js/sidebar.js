var minMetrage = 0, maxMetrage = 300;
var minPrice1 = 100, maxPrice1 = 500;
var minPrice2 = 1, maxPrice2 = 50;
var minAge = 1, maxAge = 30;

var filter = () => {
    var filesContainer = document.getElementById('file-list-container');
    items = filesContainer.childNodes;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        var metrage = parseInt(item.childNodes[1].childNodes[1].childNodes[0].textContent);
        if((maxMetrage != 500 && metrage > maxMetrage) || metrage < minMetrage)
            item.style.display = 'none';
        else {
            item.style.display = 'block';
            var price1 = parseInt(item.childNodes[2].childNodes[1].childNodes[1].textContent)/1000000;
            if((maxPrice1 != 2000 && price1 > maxPrice1) || price1 < minPrice1)
                item.style.display = 'none';
            else {
                item.style.display = 'block';
                var price2 = parseInt(item.childNodes[2].childNodes[0].childNodes[1].textContent)/1000000;
                if((maxPrice2 != 100 && price2 > maxPrice2) || price2 < minPrice2)
                    item.style.display = 'none';
                else {
                    item.style.display = 'block';
                    var age = parseInt(item.childNodes[1].childNodes[1].childNodes[5].textContent);
                    if((maxAge != 100 && age > maxAge) || age < minAge)
                        item.style.display = 'none';
                    else {
                        item.style.display = 'block';
                        
                    }
                }
            }
        }
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
            filter();
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
            filter();
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
            filter();    
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
            filter();    
        }
    });



    $('#apartment-btn').click(() => {
        if(document.getElementById('apartment-btn').className.split(/\s+/)[1] == 'active')
            $('#apartment-btn').removeClass('active');
        else
            $('#apartment-btn').addClass('active');
    })

    $('#vilage-btn').click(() => {
        if(document.getElementById('vilage-btn').className.split(/\s+/)[1] == 'active')
            $('#vilage-btn').removeClass('active');
        else
            $('#vilage-btn').addClass('active');
    })

    $('#old-btn').click(() => {
        if(document.getElementById('old-btn').className.split(/\s+/)[1] == 'active')
            $('#old-btn').removeClass('active');
        else
            $('#old-btn').addClass('active');
    })

    $('#business-btn').click(() => {
        if(document.getElementById('business-btn').className.split(/\s+/)[1] == 'active')
            $('#business-btn').removeClass('active');
        else
            $('#business-btn').addClass('active');
    })

    $('#office-btn').click(() => {
        if(document.getElementById('office-btn').className.split(/\s+/)[1] == 'active')
            $('#office-btn').removeClass('active');
        else
            $('#office-btn').addClass('active');
    })

    $('#office-estate-btn').click(() => {
        if(document.getElementById('office-estate-btn').className.split(/\s+/)[1] == 'active')
            $('#office-estate-btn').removeClass('active');
        else
            $('#office-estate-btn').addClass('active');
    })

    $('#land-btn').click(() => {
        if(document.getElementById('land-btn').className.split(/\s+/)[1] == 'active')
            $('#land-btn').removeClass('active');
        else
            $('#land-btn').addClass('active');
    })

    $('#mostaghelat-btn').click(() => {
        if(document.getElementById('mostaghelat-btn').className.split(/\s+/)[1] == 'active')
            $('#mostaghelat-btn').removeClass('active');
        else
            $('#mostaghelat-btn').addClass('active');
    })
    $('#sell-btn').click(() => {
        if(document.getElementById('sell-btn').className.split(/\s+/)[1] == 'active')
            $('#sell-btn').removeClass('active');
        else
            $('#sell-btn').addClass('active');
    })
    $('#presell-btn').click(() => {
        if(document.getElementById('presell-btn').className.split(/\s+/)[1] == 'active')
            $('#presell-btn').removeClass('active');
        else
            $('#presell-btn').addClass('active');
    })
    $('#exchange-btn').click(() => {
        if(document.getElementById('exchange-btn').className.split(/\s+/)[1] == 'active')
            $('#exchange-btn').removeClass('active');
        else
            $('#exchange-btn').addClass('active');
    })
    $('#cooperate-btn').click(() => {
        if(document.getElementById('cooperate-btn').className.split(/\s+/)[1] == 'active')
            $('#cooperate-btn').removeClass('active');
        else
            $('#cooperate-btn').addClass('active');
    })
    $('#rent-btn').click(() => {
        if(document.getElementById('rent-btn').className.split(/\s+/)[1] == 'active')
            $('#rent-btn').removeClass('active');
        else
            $('#rent-btn').addClass('active');
    })
    $('#rent2-btn').click(() => {
        if(document.getElementById('rent2-btn').className.split(/\s+/)[1] == 'active')
            $('#rent2-btn').removeClass('active');
        else
            $('#rent2-btn').addClass('active');
    });
    $('#refresh-btn').click(() => {
        setTimeout(filter, 1000);
    });
});