$(document).ready(function(){
    $('.menu-collapse-btn').click(() => {
        $('.side-bar-modal').fadeIn(500);
        $('.side-bar').fadeIn(500);
    })
    $('.side-bar-modal').click(() => {
        $('.side-bar-modal').fadeOut(500);
        $('.side-bar').fadeOut(500);
    })
});