$(document).ready(function(){
    $('#link3').addClass('active');

    $('#add-user-btn').click(() => {
        $('.black-modal').fadeIn(500);
        $('#add-file-popup').fadeIn(500);
    })
    $('.black-modal').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-file-popup').fadeOut(300);
        files.forEach(file => file.view.fadeOut(300));
    })
    $('.close-popup').click(() => {
        $('.black-modal').fadeOut(300);
        $('#add-file-popup').fadeOut(300);
        files.forEach(file => file.view.fadeOut(300));
    });
    var fileLength = parseInt(document.getElementById('file-length').textContent);
    var files = [];
    for(var i=0; i<fileLength; i++){
        files.push({btn: $(`#edit-file-btn${i}`), view: $(`#edit-file-popup${i}`)});
    }
    files.forEach(file => {
        file.btn.click(() => {
            $('.black-modal').fadeIn(500);
            file.view.fadeIn(500);
        });
    });
});