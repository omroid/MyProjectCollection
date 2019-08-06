function homeInit(nextModules, divId) {


    var slideIndex = 0;
    let divElement = document.getElementById(divId);
    let url = "home.html";
   

 
    let delegateObj = {
        onSuccess: function (response) {
            if (response) {
                divElement.innerHTML = response;
                //fillparameters
                insertParametersObj(this, divElement);

                showSlides(slideIndex);
            }
        }.bind(this),
        onFailure: function (response) {
            console.log("bad");
        }.bind(this),
        onCompletion: function (response) {
        }.bind(this)
    };



    sendHttpRequest(url, delegateObj);



}

function plusSlides(n) {
    this.showSlides(slideIndex += n);
}


function currentSlide(n) {
    this.showSlides(slideIndex = n);
}

function showSlides(n) {

    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n >= slides.length) { n = 0 }
 
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[n].style.display = "block";
    dots[n].className += " active";
}

