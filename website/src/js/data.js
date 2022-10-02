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
let loader1 = new THREE.GLTFLoader();
let loader2 = new THREE.GLTFLoader();


function Bloom() {
    bloomPasss = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.1,
        0.1
    );
    composer.addPass(bloomPasss);
}


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x110033);
    scene.background = loaderB.load('../texture/2k_stars_milky_way.jpg');
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 20000);
    camera.position.x = -10;
    camera.position.y = 7;
    camera.position.z = 20;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer = new EffectComposer(renderer, renderTarget);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    document.body.appendChild(renderer.domElement);
    Bloom();
    var yellowlight = new THREE.DirectionalLight(0xffffff, 11)
    scene.add(yellowlight);
    var yellowLight = new THREE.AmbientLight(0xaaddff, 1)
    scene.add(yellowLight);
    composer.render();
    importSat();
}

let sat1;

function importSat() {
    loader1.load('../models/observatory/scene.gltf', function (gltf) {
        sat = gltf.scene.children[0];
        sat.scale.set(0.5, 0.5, 0.5);
        sat.position.set(0, 0, 0);
        sat.rotation.z = -90 * Math.PI / 180
        scene.add(gltf.scene);
        composer.render();
        //controls = new OrbitControls(camera, renderer.domElement);
        
    });

    loader2.load('../models/launchpad/scene.gltf', function (gltf) {
        sat1 = gltf.scene.children[0];
        //sat1.scale.set(0.5, 0.5, 0.5);
        sat1.position.set(-10, 0, 0);
        sat1.rotation.z = 45 * Math.PI / 180
        scene.add(gltf.scene);
        composer.render();
        animateEarth();
    });
}

var x = 0

function animateEarth() {
    //controls.update();
     x -= 0.1;
    camera.position.z += 0.001;
    camera.position.y += 0.001;
    camera.position.x += 0.001;
    //sat.rotation.z = x * Math.PI / 180;
    //sat1.rotation.y = x*2 * Math.PI / 180;
    camera.rotation.x = x*0.01 * Math.PI / 180
    composer.render();
    requestAnimationFrame(animateEarth);
}