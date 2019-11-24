var slideIndex = 0;
let isLoggedIn = sessionStorage.getItem("loggedin")
showSlidesAuto();
//showSlides(slideIndex);

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      window.useruid = user.uid;
      window.useremail = user.email;
      window.path = 'Users/' + useruid;
      console.log("logged in");
      console.log("email", user.email)
      if(user != null){
        window.useremail = user.email;
        document.getElementById("sign_up_now").style.display = "none";
        document.getElementById("find_an_agent").style.display = "block";
        document.getElementById("loginbtn").style.display = 'none';
        document.getElementById("logoutbtn").style.display = 'block';
        document.getElementById("bookmarksTab").style.display = 'block';
      }
    } else {
        document.getElementById("sign_up_now").style.display = "block";
        document.getElementById("find_an_agent").style.display = "none";
        document.getElementById("loginbtn").style.display = 'block';
        document.getElementById("logoutbtn").style.display = 'none';
        document.getElementById("bookmarksTab").style.display = 'none';
    }
});

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" activedot", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " activedot";
  setTimeout(showSlides, 2000); 
}

function showSlidesAuto() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" activedot", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " activedot";
  setTimeout(showSlidesAuto, 7500); // Change image every 7.5 seconds
}
