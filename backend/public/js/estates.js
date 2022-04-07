$(document).ready(function(){
    $('#link4').addClass('active');

    $('#add-user-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-estate-popup').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-estate-popup').fadeOut(300);
        estates.forEach(estate => estate.view.fadeOut(300));
    })
    $('.close-popup').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-estate-popup').fadeOut(300);
        estates.forEach(estate => estate.view.fadeOut(300));
    })
    var estateLength = parseInt(document.getElementById('estate-length').textContent);
    var estateLengthMin = parseInt(document.getElementById('estate-length-min').textContent);
    var estateLengthMax = parseInt(document.getElementById('estate-length-max').textContent);
    console.log(estateLength)
    var estates = [];
    for(var i=estateLengthMin; i<=estateLengthMax; i++){
        estates.push({btn: $(`#edit-estate-btn${i}`), view: $(`#edit-estate-popup${i}`)});
    }
    estates.forEach(estate => {
        estate.btn.click(() => {
            $('.black-modal').fadeIn(500);
            estate.view.fadeIn(500);
        });
    });
});