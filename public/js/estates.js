$(document).ready(function(){
    $('#link4').addClass('active');

    $('#add-user-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-estate-popup').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-estate-popup').fadeOut(300);
    })
    $('.close-popup').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-estate-popup').fadeOut(300);
    })
});