// Basic setu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the model
const loader = new THREE.GLTFLoader();
loader.load('./assets/mario_super_mushroom.glb', function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, -2); // Adjust placement
});

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(6, 5, 5).normalize();
scene.add(light);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

