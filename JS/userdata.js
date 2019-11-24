let isLoggedIn = sessionStorage.getItem("loggedin")

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
        document.getElementById("loginbtn").style.display = 'none';
        document.getElementById("logoutbtn").style.display = 'block';
        document.getElementById("bookmarksTab").style.display = 'block';
        console.log("Is Logged In")
      }
    } else {
      // No user is signed in.
      document.getElementById("loginbtn").style.display = 'block';
      document.getElementById("logoutbtn").style.display = 'none';
      document.getElementById("bookmarksTab").style.display = 'none';
      console.log("Is NOT Logged In")
    }
});