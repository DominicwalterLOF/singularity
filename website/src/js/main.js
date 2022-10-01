let scene, camera, renderer, composer, bloomPasss, sat;
var bloomControlFlag = false;
var percentScroll = 0
var sliderX = d("myRangex");
var sliderY = d("myRangey");
var sliderZ = d("myRangez");
var width = window.innerWidth || 1;
var height = window.innerHeight / 2 || 1;
var parameters = { format: THREE.RGBAFormat };
var renderTarget = new THREE.WebGLRenderTarget(width, height, parameters);
var flagRotate = true;
const nD = Math.PI / 2;
var yAngle = 2;
var bottomFlag = false;


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

window.onload = () => {
    init();
    window.addEventListener("resize", onWindowResize, false);
}

scene = new THREE.Scene();
//scene.background = new THREE.Color(0x6080ff);
const loaderB = new THREE.TextureLoader();
scene.background = loaderB.load('../texture/8k_stars_milky_way1.jpg');

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 20000);
camera.position.z = 9;
camera.position.y = 7;

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("../texture/8k_earth_nightmap.jpg");
const cloudsSpecularTexture = loader.load("../texture/8k_earth_clouds.jpg");
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    specularMap: cloudsSpecularTexture,
    specular: 0xffffff,
    emissiveMap: loader.load("../texture/emission.png"),
    emissive: 0xffffff
});

const earthGeometry = new THREE.SphereGeometry(5.2, 50, 50);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);


function addGlowLight(){
    const glowMaterial = new THREE.MeshPhongMaterial({
        color: 0x0099ff,
    });
    glowLight = new THREE.DirectionalLight(0x00eeff, 5);
    glowLight.position.set(0, 24, -54);
    glowLight.castShadow = true;
    //scene.add(glowLight);
    
}

function EnableSun(){
    const geometry = new THREE.SphereGeometry(5, 50, 50);
    const sunGeometry = new THREE.SphereGeometry(3, 10, 10);
    const sunMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xF4E99B
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    //scene.add(sun);
    sun.position.z = -188;
    sun.position.y = 20;
}



var yellowGlow = new THREE.AmbientLight(0xF4E99B, 0.1)
scene.add(yellowGlow);




sunLight = new THREE.PointLight(0xd6b582, 150);
sunLight.position.z = -188;
sunLight.position.y = 61;
sunLight.castShadow = true;
scene.add(sunLight);


function Bloom() {
    bloomPasss = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        6.6,
        0.01,
        0.1
    );
    composer.addPass(bloomPasss);
}

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer = new EffectComposer(renderer, renderTarget);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    document.body.appendChild(renderer.domElement);
    Bloom();
    composer.render();
    importSat();
scene.add(earth);
    
}


let loader1 = new THREE.GLTFLoader();

function importSat(){
    loader1.load('../models/envisat/scene.gltf', function (gltf) {
        sat = gltf.scene.children[0];
        sat.scale.set(0.2, 0.2, 0.2);
        sat.position.set(4, 7, 2);
        scene.add(gltf.scene);
        composer.render();
        animateEarth();
    });
}



function animateEarth() {
    if (yAngle != 360 && flagRotate) {
        earth.rotation.set(yAngle, 0, nD);
        sat.rotation.z = yAngle*10;
        yAngle -= 0.0001;
        scene.background.rotation = yAngle*10 + 2;
        composer.render()
        requestAnimationFrame(animateEarth);
    }
}

var bufferLoad = 0;
var upFlag = true;


function resetEarth(){
flagRotate = true;
yAngle = 2;
bottomFlag = true;
}



function animateCamera(scrollY) {
    if(bufferLoad - percentScroll > 0){
        upFlag = true;
    }
    else{
        upFlag = false
    }
    bufferLoad = percentScroll;
    percentScroll = 1 - (scrollY / window.innerHeight);
    if (bloomControlFlag) {
        if (percentScroll < 0.8) {
            bloomPasss.strength = 0;
        } else {
            bloomPasss.strength = 2.6 * (percentScroll);
            bloomPasss.radius = 1 * (percentScroll);
        }
    }
    if (percentScroll > 0.85) {
        if (!flagRotate) {
            flagRotate = true;
            animateEarth();
            d("side").style.display = "none";
            d("nav").style.display = "none";
            d("mainTitle").style.display = "flex";
        }
        camera.position.y = -8 + 15 * percentScroll;
        camera.position.z = 7 + 2 * percentScroll;
        camera.position.x = 2 - 2 * percentScroll;
        camera.rotation.y = -3 +  3* percentScroll;
    } 
    else if(percentScroll < 0.05){
        if (!flagRotate) {
            flagRotate = true;
            animateEarth();
        }
    }
    else{
        d("side").style.display = "block";
        d("mainTitle").style.display = "none";
        d("nav").style.display = "block";
        if(upFlag){
            yAngle += 0.009;
        }
        else{
            yAngle -= 0.009;
        }
        flagRotate = false;
        earth.rotation.set(yAngle, 0, nD);
        sat.rotation.z = -3 +  3* percentScroll;
        composer.render()
    }
}


window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    animateCamera(scroll);
});