/*
// Using a popup.
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
firebase.auth().signInWithPopup(provider).then(function(result) {
 // This gives you a Google Access Token.
 var token = result.credential.accessToken;
 // The signed-in user info.
 var user = result.user;
});*/

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
      }
    } else {
      // No user is signed in.
    }
});


function login(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;
  var success = true;
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    success = false
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
    // ...
    
  });
  if (success == true) {
    exit()
    console.log("logged in");
    document.getElementById("loginbtn").style.display = 'none';
    document.getElementById("logoutbtn").style.display = 'block';
    document.getElementById("bookmarksTab").style.display = 'block';
    document.getElementById("sign_up_now").style.display = 'none';
  }
}
  
function logout(){
  firebase.auth().signOut();
  console.log("logged out");
  document.getElementById("loginbtn").style.display = 'block';
  document.getElementById("logoutbtn").style.display = 'none';
  document.getElementById("bookmarksTab").style.display = 'none';
  document.getElementById("sign_up_now").style.display = 'block';
}
  
 
  
function register(){
  if (document.getElementById("register_password_field").value == document.getElementById("register_confirm_field").value){
    var userEmail = document.getElementById("register_email_field").value;
    var userPass = document.getElementById("register_password_field").value;
    mistakes = false;
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);
      if (errorMessage){
        mistakes = true;
      };
      // ...
    //firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    });
  }else if (document.getElementById("register_password_field").value !== document.getElementById("register_confirm_field").value){
    window.alert("Error : passwords do not match");
    mistakes = true;
  }
  window.useremail = document.getElementById("register_email_field").value
  document.getElementById("register_email_field").value = '';
  document.getElementById("register_password_field").value = '';
  document.getElementById("register_confirm_field").value = '';

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("account created")
      console.log(window.useruid)
      document.getElementById("register_email_field").value = '';
      window.useruid = user.uid
      /*firebase.database().ref('Users/').child(window.useruid).once('value', function(snapshot){
        x = String(snapshot.val())
        console.log(x)
        if(x == 'null'){
          //console.log("hi")
          //listvars.push(useruid)
          adduser(window.useremail);
          //console.log(user);
        }
      });*/
      
      var user = firebase.auth().currentUser;

      user.sendEmailVerification().then(function() {
        // Email sent.
        console.log("email sent")
        window.alert("Verification email sent to:" + window.useruid)
      }).catch(function(error) {
        // An error happened.
      });
    } else {
      // User not logged in or has just logged out.
    }
  });
}
  
function tologin(){
  document.getElementById("register").style.display = "None";
  document.getElementById("login").style.display = "block";
  console.log("login")
}
function toregister(){
  document.getElementById("login").style.display = "None";
  document.getElementById("register").style.display = "block";
  console.log("reg")
}
function exit() {
  document.getElementById("login").style.display = "None";
  document.getElementById("register").style.display = "None";
  console.log("exit")
}

function adduser(useremail){

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("fuck me")
      document.getElementById("register_email_field").value = '';
      window.useruid = user.uid
      path = 'Users/' + window.useruid + "/";
      window.num_trips = 1;
      firebase.database().ref('Users/').child(window.useruid).once('value', function(snapshot){
        x = String(snapshot.val())
        console.log(x)
        if(x == 'null'){
          //console.log("hi")
          //listvars.push(useruid)
          firebase.database().ref(path).set({
            'num trips': num_trips,
            'useremail': useremail
        });   
          //console.log(user);
        }
      });

    } else {
      // User not logged in or has just logged out.
    }
  });


}