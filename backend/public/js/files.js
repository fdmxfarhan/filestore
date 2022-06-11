function searchFile() {
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
    var fileNumber = 0;
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
    var fileLengthMin = parseInt(document.getElementById('file-length-min').textContent);
    var fileLengthMax = parseInt(document.getElementById('file-length-max').textContent);
    var files = [];
    for(var i=fileLengthMin; i<=fileLengthMax; i++){
        files.push({
            btn: $(`#edit-file-btn${i}`), 
            view: $(`#edit-file-popup${i}`),
            addImageButton: $(`#add-image-to-file-btn-${i}`),
            uploadInputArea: document.getElementById(`upload-input-area-${i}`),
            numberOfImagesInput: document.getElementById(`number-of-images-${i}`),
            numberOfImages: 0,
            id: i,
        });
    }
    files.forEach(file => {
        file.btn.click(() => {
            $('.black-modal').fadeIn(500);
            file.view.fadeIn(500);
        });
        file.addImageButton.click(() => {
            var view = document.createElement('div');
            view.classList.add('image-input-view');
            var input = document.createElement('input');
            input.classList.add('file-input');
            input.type = 'file';
            input.name = `file-${file.numberOfImages}`;
            input.id = `upload-file-input-${file.numberOfImages}`;
            var text = document.createElement('div');
            text.classList.add('.text');
            text.textContent = 'انتخاب فایل';
            
            view.appendChild(input);
            view.appendChild(text);
            file.uploadInputArea.appendChild(view);
            input.addEventListener('change', () => {
                var url = input.files[0];
                text.textContent = url.name;
            })
            file.numberOfImages++;
            file.numberOfImagesInput.value = file.numberOfImages;
        });
    });


    $('#upload-file-input').change(() => {
        var input = this;
        var url = document.getElementById('upload-file-input').files[0];
        document.getElementById('upload-file-input-text').textContent = url.name;
    });
    $('#add-image-to-file-btn').click(() => {
        var view = document.createElement('div');
        view.classList.add('image-input-view');
        var input = document.createElement('input');
        input.classList.add('file-input');
        input.type = 'file';
        input.name = `file-${fileNumber}`;
        input.id = `upload-file-input-${fileNumber}`;
        var text = document.createElement('div');
        text.classList.add('.text');
        text.textContent = 'انتخاب فایل';
        
        view.appendChild(input);
        view.appendChild(text);
        document.getElementById('upload-input-area').appendChild(view);
        input.addEventListener('change', () => {
            var url = input.files[0];
            text.textContent = url.name;
        })
        fileNumber++;
        document.getElementById('number-of-images').value = fileNumber;
    })
});