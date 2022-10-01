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




function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfe6607);
    scene.background = loaderB.load('../texture/orsky.jpg');
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 20000);
    camera.position.x =11;
    camera.position.y =0;
    camera.position.y =15;
    camera.rotation.z = 90;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer = new EffectComposer(renderer, renderTarget);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    document.body.appendChild(renderer.domElement);
    //Bloom();
    importSat();
    composer.render();
    var yellowGlow = new THREE.AmbientLight(0xF4E99B, 1)
    scene.add(yellowGlow);

}



function importSat() {
    loader1.load('../models/observatory/scene.gltf', function (gltf) {
        sat = gltf.scene.children[0];
        sat.scale.set(0.5,0.5, 0.5);
        sat.position.set(0,0,0);
        scene.add(gltf.scene);
        composer.render();
        const geometry = new THREE.BoxGeometry( 1000, 0.1, 1000 );
const material = new THREE.MeshBasicMaterial( {color: 0x111111} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
        controls = new OrbitControls(camera, renderer.domElement);
        animateEarth();
    });
}


function animateEarth() {
    console.log(camera.position.x, camera.position.y, camera.position.z);
    controls.update();
    composer.render();
    requestAnimationFrame(animateEarth);
}