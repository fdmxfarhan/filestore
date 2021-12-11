$(document).ready(function(){
    $('#link3').addClass('active');

    $('#add-user-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-file-popup').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-file-popup').fadeOut(300);
    })
    $('.close-popup').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-file-popup').fadeOut(300);
    })
});