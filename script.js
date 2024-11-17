import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, reticle, model, hitTestSource, referenceSpace;

// Start AR on button click
document.getElementById("startButton").addEventListener("click", async () => {
    document.getElementById("startButton").style.display = "none";
    await activateXR();
});

async function activateXR() {
    // Add a canvas for WebGL and initialize THREE.js
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });

    renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true, canvas, context: gl });
    renderer.autoClear = false;

    // Create the scene and add lighting
    scene = new THREE.Scene();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Set up the camera
    camera = new THREE.PerspectiveCamera();
    camera.matrixAutoUpdate = false;

    // Initialize WebXR session
    const session = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["hit-test"] });
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, gl)
    });

    // Reference spaces
    referenceSpace = await session.requestReferenceSpace("local");
    const viewerSpace = await session.requestReferenceSpace("viewer");

    // Create hit-test source
    hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    // Add reticle for AR interaction
    const loader = new GLTFLoader();
    loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
        reticle = gltf.scene;
        reticle.visible = false;
        scene.add(reticle);
    });

    // Load your custom model "ImageToStl.com_bdtronic_logo_opt.glb"
    loader.load("./assets/itfigurinefbx.glb", (gltf) => {
        model = gltf.scene; // Load the model into the global variable
        model.scale.set(1, 1, 1); // Adjust scale if necessary
        model.visible = false; // Initially hide the model
        scene.add(model);

        console.log("Model loaded successfully: itfigurinefbx.glb");
    }, undefined, (error) => {
        console.error("itfigurinefbx.glb", error);
    });

    session.addEventListener("select", onSelect);

    // Start rendering the AR view
    renderer.xr.setSession(session);
    session.requestAnimationFrame(onXRFrame);
}

function onSelect() {
    // Clone and place the model at the reticle's position
    if (model && reticle.visible) {
        const clone = model.clone(); // Clone the loaded model
        clone.position.copy(reticle.position); // Set its position to the reticle
        scene.add(clone); // Add it to the scene

        console.log("Model placed at:", clone.position);
    }
}

function onXRFrame(time, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);

    // Bind the framebuffer
    const gl = renderer.getContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer);

    // Get viewer pose
    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
        const view = pose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        // Hit-test for reticle placement
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
            const hitPose = hitTestResults[0].getPose(referenceSpace);
            reticle.visible = true;
            reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
            reticle.updateMatrixWorld(true);
        } else {
            reticle.visible = false;
        }

        // Render the scene
        renderer.render(scene, camera);
    }
}

