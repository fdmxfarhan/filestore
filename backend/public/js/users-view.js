$(document).ready(function(){
    $('#link2').addClass('active');

    $('#add-user-btn').click(() => {
        $('#add-user-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    });
    $('.black-modal').click(() => {
        $('#add-user-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    });
    $('.close-popup').click(() => {
        $('#add-user-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
    });
    
});