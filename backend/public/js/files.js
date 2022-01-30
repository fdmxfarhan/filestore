function search() {
    // alert('hello');
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    // console.log(tr);
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0].getElementsByTagName("h1")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[2];
        // console.log(td);
        if (td) {
            txtValue = td.textContent || td.innerText;
            txtValue2 = td2.textContent || td2.innerText;
            txtValue3 = td3.textContent || td3.innerText;
            if (txtValue.indexOf(filter) > -1 || txtValue2.indexOf(filter) > -1 || txtValue3.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

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