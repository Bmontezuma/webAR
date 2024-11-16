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
let model; // Declare globally to allow cloning
loader.load(
    './assets/mario_super_mushroom.glb',
    function (gltf) {
        model = gltf.scene; // Store the loaded model
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
light.position.set(6, 5, 5).normalize();
scene.add(light);

// Add placement icon
const iconGeometry = new THREE.SphereGeometry(0.1, 16, 16); // Small sphere
const iconMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const placementIcon = new THREE.Mesh(iconGeometry, iconMaterial);
scene.add(placementIcon);
placementIcon.position.set(0, 0, -3); // Place slightly in front of the camera
placementIcon.renderOrder = 1; // Ensure it renders on top

// Enable object placement using raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const placedObjects = []; // Store placed objects

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(placementIcon);
    if (intersects.length > 0 && model) {
        // Clone the model and place it at the icon's position
        const newModel = model.clone();
        newModel.position.copy(placementIcon.position);
        scene.add(newModel);
        placedObjects.push(newModel); // Keep track of placed objects

        // Move the icon further back after placing the model
        placementIcon.position.z -= 1;

        console.log("Object placed at:", newModel.position);
    }
});

// Animation loop
function animate() {
    // Ensure the icon always stays slightly in front of the camera
    placementIcon.position.z = camera.position.z - 1;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

