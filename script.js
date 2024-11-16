import { ARButton } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/webxr/ARButton.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // Enable WebXR
document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer)); // Add AR button for AR mode

// Load the Mario Super Mushroom model
const loader = new THREE.GLTFLoader();
let model; // Declare globally to allow cloning
loader.load(
    './assets/neon_game_controller.glb',
    function (gltf) {
        model = gltf.scene;
        scene.add(model);
        model.visible = false; // Hide the default model until placement
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);

// Add light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(6, 5, 5).normalize();
scene.add(light);

// Array to store placed objects
const placedObjects = [];

// Real-world placement with AR hit-test
let hitTestSource = null;
let localSpace = null;

// Session start for AR
renderer.xr.addEventListener('sessionstart', async () => {
    const session = renderer.xr.getSession();

    // Set up hit testing
    const viewerSpace = await session.requestReferenceSpace('viewer');
    hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
    localSpace = await session.requestReferenceSpace('local');
});

// Session end cleanup
renderer.xr.addEventListener('sessionend', () => {
    hitTestSource = null;
    localSpace = null;
});

// Animation loop
function animate() {
    renderer.setAnimationLoop(() => {
        if (hitTestSource) {
            const frame = renderer.xr.getFrame();
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(localSpace);

                // Update placement icon to follow hit-test results
                if (model) {
                    model.visible = true;
                    model.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
                }
            }
        }

        renderer.render(scene, camera);
    });
}

animate();

// Tap to place objects
window.addEventListener('click', () => {
    if (model && model.visible) {
        const newModel = model.clone();
        scene.add(newModel);
        placedObjects.push(newModel);

        console.log('Object placed at:', newModel.position);
    }
});

