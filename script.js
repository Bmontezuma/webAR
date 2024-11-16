// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 5; // Move the camera back to view the model

// Load the Mario Super Mushroom model
const loader = new THREE.GLTFLoader();
loader.load(
    './assets/mario_super_mushroom.glb',
    function (gltf) {
        // Add the loaded model to the scene
        const model = gltf.scene;
        scene.add(model);

        // Position the model
        model.position.set(0, 0, -2); // Adjust the position as needed
    },
    undefined, // Optional: Progress callback
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);

// Add light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(6, 5, 5).normalize(); // Position the light
scene.add(light);

// Optional: Add a grid helper for reference
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

