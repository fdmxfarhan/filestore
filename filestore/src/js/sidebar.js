$(document).ready(() => {
    $("#metrage-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#metrage-min").html(ui.values[0]);
            $("#metrage-max").html(ui.values[1]);
        }
    });
    $("#price1-slider").slider({
        range: true,
        min: 1,
        max: 1000,
        values: [ 0, 300 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#price1-min").html(ui.values[0]);
            $("#price1-max").html(ui.values[1]);
        }
    });
    $("#price2-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#price2-min").html(ui.values[0]);
            $("#price2-max").html(ui.values[1]);
        }
    });
    $("#age-slider").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        isRTL: true,
        classes: {
            "ui-slider": "slider-slider",
            "ui-slider-handle": "slider-handle",
            "ui-slider-range": "slider-range"
        },
        slide: function( event, ui ) {
            $("#age-min").html(ui.values[0]);
            $("#age-max").html(ui.values[1]);
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
    })
});