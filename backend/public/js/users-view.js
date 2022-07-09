$(document).ready(function(){
    $('#link2').addClass('active');

    $('#add-user-btn').click(() => {
        $('#add-user-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    });
    $('#add-operator-btn').click(() => {
        $('#add-operator-popup').fadeIn(500);
        $('.black-modal').fadeIn(500);
    });
    $('.black-modal').click(() => {
        $('#add-user-popup').fadeOut(500);
        $('#add-operator-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
        users.forEach(user => user.view.fadeOut(300));
    });
    $('.close-popup').click(() => {
        $('#add-user-popup').fadeOut(500);
        $('#add-operator-popup').fadeOut(500);
        $('.black-modal').fadeOut(500);
        users.forEach(user => user.view.fadeOut(300));
    });
    var userLength = parseInt(document.getElementById('user-length').textContent);
    var userLengthMin = parseInt(document.getElementById('user-length-min').textContent);
    var userLengthMax = parseInt(document.getElementById('user-length-max').textContent);
    var users = [];
    for(var i=userLengthMin; i<=userLengthMax; i++){
        users.push({btn: $(`#edit-user-btn${i}`), view: $(`#edit-user-popup${i}`)});
    }
    users.forEach(user => {
        user.btn.click(() => {
            $('.black-modal').fadeIn(500);
            user.view.fadeIn(500);
        });
    });
});