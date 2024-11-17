import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, reticle, model, hitTestSource, referenceSpace;

// Start AR on button click
document.getElementById("startButton").addEventListener("click", async () => {
    document.getElementById("startButton").style.display = "none";
    await activateXR();
});

async function activateXR() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });

    renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true, canvas, context: gl });
    renderer.autoClear = false;

    scene = new THREE.Scene();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    camera = new THREE.PerspectiveCamera();
    camera.matrixAutoUpdate = false;

    const session = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["hit-test"] });
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

    referenceSpace = await session.requestReferenceSpace("local").catch(() =>
        session.requestReferenceSpace("viewer")
    );
    const viewerSpace = await session.requestReferenceSpace("viewer");

    hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

    // Reticle
    const loader = new GLTFLoader();
    loader.load("https://immersive-web.github.io/webxr-samples/media/gltf/reticle/reticle.gltf", (gltf) => {
        reticle = gltf.scene;
        reticle.visible = false;
        scene.add(reticle);
    });

    // Model
    loader.load("./assets/itfigurinefbx.glb", (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.visible = false;
        scene.add(model);

        const boxHelper = new THREE.BoxHelper(model, 0x00ff00);
        boxHelper.visible = false; // Hide in production
        scene.add(boxHelper);
    });

    session.addEventListener("select", onSelect);
    renderer.xr.setSession(session);
    session.requestAnimationFrame(onXRFrame);
}

function onSelect() {
    if (model && reticle && reticle.visible) {
        const clone = model.clone();
        clone.position.copy(reticle.position);
        clone.visible = true;
        scene.add(clone);
    } else {
        console.warn("Cannot place model. Reticle not visible or model not loaded.");
    }
}

function onXRFrame(time, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);

    const gl = renderer.getContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer);

    const pose = frame.getViewerPose(referenceSpace);
    if (pose) {
        const view = pose.views[0];
        const viewport = session.renderState.baseLayer.getViewport(view);
        renderer.setSize(viewport.width, viewport.height);

        camera.matrix.fromArray(view.transform.matrix);
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.updateMatrixWorld(true);

        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
            const hitPose = hitTestResults[0].getPose(referenceSpace);
            reticle.visible = true;
            reticle.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
            reticle.updateMatrixWorld(true);
        } else {
            reticle.visible = false;
        }

        renderer.render(scene, camera);
    }
}

