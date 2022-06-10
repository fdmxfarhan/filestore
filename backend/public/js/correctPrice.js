function correctPrice(id){
    var text = document.getElementById(id).value;
    text = text.replaceAll('.', '');
    text = text.replace(/\D/g,'');
    var newText = '';
    for(var i=0; i<text.length; i++){
        var j = text.length - i;
        if(j%3 == 0 && j>1 && i != 0) newText += '.';
        newText += text[i];
    }
    document.getElementById(id).value = newText;
}
