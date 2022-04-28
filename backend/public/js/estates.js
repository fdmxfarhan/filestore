function searchEstate() {
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
    $('#link4').addClass('active');
    $('#link3').removeClass('active');

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
    var districtsLength = parseInt(document.getElementById('districts-length').textContent);
    var districts = [];
    for (let i = 0; i < districtsLength; i++) {
        districts.push({
            btn: $(`#district-filter-${i}`),
            id: i,
            active: true,
        })
    }
    console.log(districts)
    districts.forEach(district => {
        district.btn.click(() => {
            if(district.active) district.btn.removeClass('active');
            else                district.btn.addClass('active');
            district.active = !district.active;
            var filter = document.getElementById(`district-filter-${district.id}`).getElementsByClassName('district')[0].textContent;
            console.log(filter);
            var table = document.getElementById("myTable");
            var tr = table.getElementsByTagName("tr");
            for (i = 1; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[1];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue == filter) {
                        if(district.active)
                            tr[i].style.display = "";
                        else
                            tr[i].style.display = "none";
                    }
                }
            }
        });
    });

});