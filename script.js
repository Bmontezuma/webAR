import * as THREE from "https://unpkg.com/three@0.126.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, reticle, helmetModel, hitTestSource, referenceSpace;

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

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 15, 10);
  scene.add(directionalLight);

  // Add ambient light for overall brightness
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Add hemisphere light for natural light effect
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.5);
  hemisphereLight.position.set(0, 20, 0);
  scene.add(hemisphereLight);

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

  // Load the Damaged Helmet model
  loader.load("https://github.com/KhronosGroup/glTF-Sample-Models/raw/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb", (gltf) => {
    helmetModel = gltf.scene;
  });

  session.addEventListener("select", onSelect);

  // Start rendering the AR view
  renderer.xr.setSession(session);
  session.requestAnimationFrame(onXRFrame);
}

function onSelect() {
  // Clone and place the helmet model at the reticle's position
  if (helmetModel && reticle.visible) {
    const clone = helmetModel.clone();
    clone.position.copy(reticle.position);
    scene.add(clone);
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

