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
}

initUI();