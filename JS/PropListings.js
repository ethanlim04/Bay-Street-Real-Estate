var database = firebase.database();
let page = 1;
let indexKey;
let length = 1;
sessionStorage.setItem("reqIndex", null);
sessionStorage.setItem("reqPage", null);

function setPage(pageNumb){
  page = pageNumb
  setup();
}

function addPage(){
  page++;
  setup();
}

function setup(){
  var ref = database.ref("Houses");
  ref.on("value", gotData, errData);
}

function gotData(data){
  console.log(data.val());
  var houses = data.val();

  for (i = 1; i < houses[page].length; i++) {
    let error = false
    let tempVal = i*page
    console.log(houses[page].length);
    let houseIndex = houses[page][i];

    let aAboutKey = Object.keys(houseIndex['aAbout']);
    let aDescriptionKey = Object.keys(houseIndex['aDiscription']);
    let aboutKey = Object.keys(houseIndex['about']);
    let benifitsKey = Object.keys(houseIndex['benifits']);
    let dateKey = Object.keys(houseIndex['date']);
    let nameKey = Object.keys(houseIndex['name']);
    let specs;
    try {
    let specsKey = Object.keys(houseIndex['specs']);
    let specs = houseIndex['specs'][specsKey];
    }
    catch(err) {
      let specsKey = null;
      let specs = null;
    }

    let pictures;
    try {
      console.log(houseIndex["pictureURLs"]);
      pictures = houseIndex["pictureURLs"];
      pictures = pictures.split(";")
      error = false;
    }
    catch(err) {
      pictures = "Pictures/ICON.png";
      error = true;
    }

    let houseArray = [houseIndex['aAbout'][aAboutKey], houseIndex['aDiscription'][aDescriptionKey], houseIndex['about'][aboutKey], houseIndex['benifits'][benifitsKey], houseIndex['date'][dateKey], houseIndex['name'][nameKey], specs, pictures];

    console.log(houseArray);

    let bookmark = document.createElement("img");
    let row = document.createElement("article");
    let leftColumn = document.createElement("article");
    let rightColumn = document.createElement("article");
    let title = document.createElement("h1");
    let img = document.createElement("img");
    let desc = document.createElement("p");
    let abt = document.createElement('p');

    bookmark.className += "bookmark";
    row.className += "row";
    leftColumn.className += "column left";
    rightColumn.className += "column right";
    img.className += "img";

    if (error == false) {img.setAttribute("src", houseArray[7][0]);}
    else if (error == true) {img.setAttribute("src", houseArray[7]);}

    bookmark.setAttribute("src", "Pictures/Bookmark.png");
    bookmark.setAttribute("onmouseover", "turn_red(this)");
    bookmark.setAttribute("onmouseout", "turn_transparent(this)");
    bookmark.setAttribute("onclick", "bookmark(" + tempVal + ")");

    title.innerHTML = houseArray[5];
    desc.innerHTML = houseArray[1];
    abt.innerHTML = houseArray[0];

    leftColumn.appendChild(img);
    rightColumn.appendChild(bookmark);
    rightColumn.appendChild(title);
    rightColumn.appendChild(abt);
    rightColumn.appendChild(desc);
    row.appendChild(leftColumn);
    row.appendChild(rightColumn);
    document.getElementById("main-container").appendChild(row);

    
    let callFunc = "openPage(" + tempVal + ")";

    title.setAttribute("onClick", callFunc);
  }
  console.log("Complete");
}

function errData(err){
  console.log("!!!ERROR!!!");
  console.log(err);
}

function openPage(a) {
  console.log(a);
  sessionStorage.setItem("reqIndex", a);
  sessionStorage.setItem("reqPage", page);
  window.location.href = "openPage.html";
}
//https://youtu.be/NcewaPfFR6Y

function scroll() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      page++;
      setup();
    }
}

function turn_red(x) {
  x.removeAttribute("src");
  x.setAttribute("src", "Pictures/Bookmark_on.png");
}

function turn_transparent(x) {
  x.removeAttribute("src");
  x.setAttribute("src", "Pictures/Bookmark.png");
}

function bookmark(x) {
  console.log(x);
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
        writeUserData(user.uid, user.email, x)
        let mark = document.getElementsByClassName("bookmark")[x-1];
        mark.removeAttribute("src");
        mark.setAttribute("src", "Pictures/Bookmark_on.png");
      }
    } else {
      // No user is signed in.
      tologin();
    }
  });
}

function writeUserData(userId, email, index) {
  firebase.database().ref("users/" + userId).set({
    email: email
    //some more user data
  });
  firebase.database().ref("users/" + userId).push({
    index: "index"
  });
  var ref = database.ref("users");
  ref.on("value", gotDataBM, errDataBM);
  console.log("LENGTH", length)
  firebase.database().ref("users/" + userId + "/" + indexKey).set({
    [length]: index
    //some more user data
  });
}

function errDataBM(err){
  console.log("!!!ERROR!!!");
  console.log(err);
}

function gotDataBM(data) {
  console.log(data.val());
  var users = data.val();
  let userKey = Object.keys(users[window.useruid]);
  console.log(userKey);
  if (userKey[0] != "email") {indexKey = userKey[0];}
  else {indexKey = userKey[1];}
  length = Object.keys(users[window.useruid][indexKey]).length;
}