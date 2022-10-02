rocketArray = ["sats/iss", "sats/aqua_satellite", "sats/global_star", "sats/venera_7", "sats/voyager_nasa", "rocket", "observatory", "launchPad", "envisat", "engines/1", "engines/j-2s"];
flagArray = [false,false,false];



if (window.location.href.includes("?")) {
    flagArray = [true,true,true];
    removeOverlay();
    var params = window.location.href.split("?")[1].split("&");
    d("rocket1").src = "../models/" + rocketArray[params[0]] + "/scene.gltf"
    d("rocket2").src = "../models/" + rocketArray[params[1]] + "/scene.gltf"
    //d("sat1").src = "../models/"+ params[2] +"/scene.gltf"
    //d("sat2").src = "../models/"+ params[3] +"/scene.gltf"
}

function removeOverlay() {
    if(flagArray[1] && flagArray[2]){
        d("overlay").style.display = "none";
    }
   
}


for (var ele in rocketArray) {
    d("b1").innerHTML += "<div class = 'pickBox' onclick = 'launch(1, "+ele+")'><p>" + rocketArray[ele] + "</p></div>"
    d("b2").innerHTML += "<div class = 'pickBox' onclick = 'launch(2, "+ele+")'><p>" + rocketArray[ele] + "</p></div>"
}

function launch(side, value){
    flagArray[side] = true;
    d("b" + side).style.display = "none";
    d("rocket" + side).src = "../models/" + rocketArray[value] + "/scene.gltf"
    removeOverlay();
}