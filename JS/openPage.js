console.log(sessionStorage.getItem("reqPage"));
console.log(sessionStorage.getItem("reqIndex"));
let slideIndex = 0;
let database = firebase.database();
let page = sessionStorage.getItem("reqPage");
let reqIndex = sessionStorage.getItem("reqIndex");

function setup(){
  let ref = database.ref("Houses");
  ref.on("value", gotData, errData);
}

function gotData(data){
  console.log(data.val());
  let houses = data.val();

  let error = false
  console.log(houses[page].length);
  let houseIndex = houses[page][reqIndex];

  let aAboutKey = Object.keys(houseIndex['aAbout']);
  let aDescriptionKey = Object.keys(houseIndex['aDiscription']);
  let aboutKey = Object.keys(houseIndex['about']);
  let benifitsKey = Object.keys(houseIndex['benifits']);
  let dateKey = Object.keys(houseIndex['date']);
  let nameKey = Object.keys(houseIndex['name']);
  let specs;
  try {
    let specsKey = Object.keys(houseIndex['specs']);
    specs = houseIndex['specs'][specsKey][0];
    
    }
    catch(err) {
      let specsKey = null;
      specs = "None";
    }

  let pictures;
  try {
    console.log(houseIndex["pictureURLs"]);
    pictures = houseIndex["pictureURLs"];
    if (pictures.includes(";")) {pictures = pictures.split(";")}
    else {pictures = [houseIndex["pictureURLs"]]}
    error = false;
  }
  catch(err) {
    console.log(err)
    pictures = ["Pictures/ICON.png"];
    error = true;
  }

  let houseArray = [houseIndex['aAbout'][aAboutKey], houseIndex['aDiscription'][aDescriptionKey], houseIndex['about'][aboutKey], houseIndex['benifits'][benifitsKey], houseIndex['date'][dateKey], houseIndex['name'][nameKey], specs, pictures];

  console.log(houseArray);

  for (i = 0; i < pictures.length; i++) {
    let tempVal = i+1
    var slide = document.createElement("article");
    let numberText = document.createElement("article");
    let img = document.createElement("img");
    let dot = document.createElement("span");

    slide.className += "mySlides fade";
    numberText.className += "numbertext";
    numberText.style.color = "black";
    img.style.width = "100%";
    dot.className += "dot";
    console.log("URL" + houseArray[7])
    if (error == false) {img.setAttribute("src", houseArray[7][i]);}
    else if (error == true) {img.setAttribute("src", houseArray[7]);}
    dot.setAttribute("onClick", "currentSlide(" + tempVal + ")")

    numberText.innerHTML = i+1 + " / " + pictures.length;

    slide.appendChild(numberText);
    slide.appendChild(img);
    document.getElementById("slideshow-container").appendChild(slide);
    document.getElementById("dots_container").appendChild(dot);
  }

  document.getElementById("listing_header").innerHTML = houseArray[5];

  document.getElementById("date").innerHTML = houseArray[4];
  document.getElementById("details").innerHTML = houseArray[2];
  document.getElementById("benifits").innerHTML = houseArray[3];
  document.getElementById("specs").innerHTML = houseArray[6];

  console.log("Complete");
  if (pictures.length > 1) { showSlidesAuto(); }
  else { slide.style.display = "block"; }
}

function errData(err){
  console.log("!!!ERROR!!!");
  console.log(err);
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
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
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
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

  setTimeout(showSlidesAuto, 7500);
}