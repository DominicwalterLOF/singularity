var toastCount = 0;

function d(e){
    return document.getElementById(e);
}

function modalLog(title, text)
{
    var modal = document.getElementById("modal");
    modal.style.display = "block";
}


function returnToast(toastMessage, tcounter) {
    tm = '<div class="tomsg UIS" id = "modalContainer' + tcounter + '"><p style="color: grey;">Server ::::</p><p class = "msgP" id = "toastCont">';
    tm += toastMessage + '</p></div>';
    return tm;
}

function showToast(toastMessage, time) {
    toastCount = toastCount + 1;
    toastRAW = returnToast(toastMessage, toastCount);
    renderToast(toastRAW, toastCount, time);
}

function renderToast(toastRAW, tcnt, timeTo) {
    d("mcm").innerHTML += toastRAW;
    setTimeout(() => {
        d("modalContainer" + tcnt).style.display = "none";
    }, timeTo * 1000)
}

function injectModalContainer(){
    document.body.innerHTML += "<div class='bottomModalContainer' id = 'mcm'></div>";
}


function initUI(){
    injectModalContainer();
    injectLogin();
}


function injectLogin(){
    document.body.innerHTML += `
    <script src="../src/firebase/firebase-app.js"></script>
    <script src="../src/firebase/firebase.js"></script>
    <script src="../src/firebase/firebase-auth.js"></script>
    <script src="../src/firebase/firebase-database.js"></script>
    `
}

initUI();

var userData

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log(firebase.auth().currentUser);
        userData = user;
        loginSuccess();
        var user1 = userData.email.split("@")[0];
    } else {

    }
});

var provider1 = new firebase.auth.GoogleAuthProvider();

var credential;

function googleSignInPopup() {

    var provider1 = new firebase.auth.GoogleAuthProvider();
    console.log("here");
    firebase.auth().signInWithPopup(provider1).then((result) => {
        credential = result.credential;
        console.log(credential[photoURL]);
        console.log("suc");
        var token = credential.accessToken;
        var user = result.user;
        console.log("loggedin");
    }).catch((error) => {
        //var errorCode = error.code;
        //var errorMessage = error.message;
        //var email = error.email;
        //var credential = error.credential;
    });
}


function loginSuccess(){
    d("loginOverlay").style.display = "none";
}