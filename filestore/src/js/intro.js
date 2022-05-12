$(document).ready(() => {
    var introIndex = 1;
    var clearIntro = () => {
        $('#intro-1').fadeOut(500);
        $('#intro-2').fadeOut(500);
        $('#intro-3').fadeOut(500);
        $('#intro-4').fadeOut(500);
        $('#intro-5').fadeOut(500);
        $('#intro-6').fadeOut(500);
        $('#intro-7').fadeOut(500);
        $('#intro-8').fadeOut(500);
        $('#intro-9').fadeOut(500);
    }
    var loadIntro = (index) => {
        clearIntro();
        if(index == 1) $('#intro-1').delay(500).fadeIn(500);
        if(index == 2) $('#intro-2').delay(500).fadeIn(500);
        if(index == 3) $('#intro-3').delay(500).fadeIn(500);
        if(index == 4) $('#intro-4').delay(500).fadeIn(500);
        if(index == 5) $('#intro-5').delay(500).fadeIn(500);
        if(index == 6) $('#intro-6').fadeIn(500);
        if(index == 7) $('#intro-7').fadeIn(500);
        if(index == 8) $('#intro-8').fadeIn(500);
        if(index == 9) $('#intro-9').fadeIn(500);
        if(index >= 10) {
            $('.intro-modal').fadeOut(500);
            introIndex = 1;
        }
    }
    $('.intro-start-btn').click(() => {
        $('.intro-modal').fadeIn(500);
        $('#intro-1').fadeIn(500);
    });
    $('#intro-start-btn').click(() => {
        $('.intro-modal').fadeIn(500);
        $('#intro-1').fadeIn(500);
    });
    $('.intro-modal').click(() => {
        introIndex++;
        loadIntro(introIndex);
    })
    $('.next-intro').click(() => {
        introIndex++;
        loadIntro(introIndex);
    })
})