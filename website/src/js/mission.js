let scene, camera, render, composer, screenShake, bloomPass, halfTone, sat, rocket, renderer, controls;
var bloomControlFlag = false;
var percentScroll = 0
var width = window.innerWidth || 1;
var height = window.innerHeight / 2 || 1;
var parameters = { format: THREE.RGBAFormat };
var renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    composer.render();
}


window.onload = () => {
    init();
    window.addEventListener("resize", onWindowResize, false);
    composer.render();
}

const loaderB = new THREE.TextureLoader();

//camera.position.y = 7;



function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfe6607);
    //scene.background = new THREE.Color(0x11ff11);
    
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 20000);
    scene.background = loaderB.load('../texture/orsky.jpg');
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer = new EffectComposer(renderer, renderTarget);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    document.body.appendChild(renderer.domElement);
    loadRocket();
    //controls = new OrbitControls(camera, renderer.domElement);
    LaunchView();
    Bloom();
    screenShake = ScreenShake();
    clockTicks();
    enableLight();
    scene.add(sunLight);

}

function Bloom() {
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.15,
        0.9,
        0.01
    );


    if (true) {
        halfTone = new HalftonePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight)
        )
        halfTone.uniforms['radius'].value = 1.456;
        halfTone.uniforms['scatter'].value = 2.56;
        halfTone.uniforms['greyscale'].value = true;


    }


    if (true) {
        outLine = new ShaderPass(VerticalBlurShader);

        
    }
    composer.addPass(bloomPass);
    composer.addPass(outLine);
    composer.addPass(halfTone);

}


let loader1 = new THREE.GLTFLoader();

function loadLaunch() {
    loader1.load('../models/launchPad/scene.gltf', function (gltf) {
        launchPad = gltf.scene.children[0];
        launchPad.scale.set(1, 1, 1);
        launchPad.position.set(0, 0, 0);
        launchPad.castShadow = true;
        scene.add(gltf.scene);
        composer.render();
    });
    loadControlRoom()
}

function alignCamera() {
    camera.position.set(12.17, 1.44, -1.45)
}

function hoverCamera() {
    camera.position.set(9.44, 0.22, -0.29)
    camera.rotation.set(2, 1.271, -1)
}

function longShot() {
    camera.position.set(74.71432827580888, 8.11589064729044374, -32.218548415078715)
    camera.rotation.set(0.8287532176108234, 0.1174255938986901, 0.85861242308107)
}

function LaunchView() {
    camera.position.set(7.808222899433659, 0.1132892233281298644, -6.38074482082219)
    camera.rotation.x = 1.8698173562864382;
    camera.rotation.y = 0.7420762840143686;
    camera.rotation.z = -1.998739040876278;
}

let loader2 = new THREE.GLTFLoader();

function loadRocket() {
    loadLaunch();
    loader2.load('../models/rocket/scene.gltf', function (gltf) {
        rocket = gltf.scene.children[0];
        rocket.scale.set(0.1, 0.1, 0.1);
        rocket.castShadow = true;
        rocket.position.set(11.5, 0.5, 0);
        scene.add(gltf.scene);
        composer.render();
    });
}
let loader3 = new THREE.GLTFLoader();
let cr;
function loadControlRoom(){
    loader2.load('../models/buildings/cr.gltf', function (gltf) {
        cr = gltf.scene.children[0];
        cr.scale.set(0.1, 0.1, 0.1);
        cr.castShadow = true;
        cr.position.set(11.5, 0.5, 0);
        scene.add(gltf.scene);
        composer.render();
        flag = true
    });
}

function enableLight() {
    var yellowGlow = new THREE.AmbientLight(0xFfffff, 1)
    scene.add(yellowGlow);
}

var flag = false;



function clockTicks() {
    requestAnimationFrame(clockTicks);
    if (flag) {
        launchRocket()  
    }
    
    screenShake.update(camera);
    //controls.update();
    composer.render();
}

function crLight(){
    sunLight = new THREE.PointLight(0xd6b582, 0.5);
    sunLight.position.x = 11.5;
    sunLight.position.y = 0.5;
    sunLight.position.z = 0;
    sunLight.castShadow = true;
}


sunLight = new THREE.PointLight(0xd6b582, 0.5);
sunLight.position.x = -50;
sunLight.position.y = 6;
sunLight.position.z = 6;
sunLight.castShadow = true;


function launchRocket() {
    if (true && rocket.position.y < 65) {
        rocket.position.y += 0.02;
        camera.position.y += 0.01;
        camera.position.z += 0.001;
        camera.rotation.x -= 0.0001;
        camera.rotation.y -= 0.0002;
        camera.rotation.z += 0.0001;
        scene.background.rotation += 0.0001;
        console.log(rocket.position.y);
    }
}