$(document).ready(function(){
    var slideNum = 5;
    var slideShow1 = [];
    var currentSlide = 0;
    for(var i=0; i<slideNum; i++){
        slideShow1.push({
            id: i,
            image: $(`#slide1-img${i}`)
        })
    }
    var hideSlides = () => {
        for (let i = 0; i < slideShow1.length; i++) {
            slideShow1[i].image.hide();
        }
    }
    slideShow1[currentSlide].image.show();
    setInterval(() => {
        currentSlide++;
        currentSlide %= slideNum;
        hideSlides();
        slideShow1[currentSlide].image.fadeIn(400);
    }, 3000);
});