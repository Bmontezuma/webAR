# WebAR Project Instructions

## 📖 Background Context
In this project, you'll explore creating augmented reality (AR) experiences that run in a browser. Unlike app-based AR (like Unity's ARCore/Vuforia), this web-based approach eliminates the friction of downloading apps, offering a seamless way to share AR experiences.

👉 **Did you know?** 91% of users dislike being forced to install apps. By leveraging **Google's WebXR** and **three.js**, you'll create interactive AR experiences accessible through a simple link or QR code.

---

## 🛠️ Technical Description
This project focuses on:
- Understanding **Web-Based AR** with WebXR and three.js.
- Creating AR experiences shareable via the web.
- Reimagining a traditional business card as a **web-based AR experience**.
- Hosting projects on **GitHub Pages**.
- Expanding creative and technical skills in AR, 3D modeling, and user experience.

---

## 🧠 Learning Goals
By the end of this project, you will:
- Understand how WebXR compares to ARCore.
- Develop a web-based AR experience using WebXR and three.js.
- Host your WebXR project on GitHub Pages.
- Create a QR code to share your AR experience.
- Design a unique, web-based AR business card.
- Share your knowledge with a blog post on AR development.

---

## 📋 Tasks Overview

### Task 0: WebXR Tutorial
- Gain hands-on experience with WebXR using three.js.
- Replace the default 3D model (e.g., sunflower) with your custom model.
- Host your project on **GitHub Pages**.

#### Requirements
1. **Host on GitHub Pages:** The project must be live and accessible.
2. **AR Features:**
   - Display an icon for placing a 3D object in space.
   - Allow users to place the object by clicking the screen.
   - Ensure objects remain in position when moving around in 3D space.
3. **Submit URLs** for:
   - GitHub repository: [GitHub Repo](https://github.com/Bmontezuma/webAR)
   - Live project: [Brandon's WebAR Experience](https://bmontezuma.github.io/webAR/)

---

### Task 1: Business Card Reimagined
Transform your business card into a **web-based AR experience** accessible via QR code.

#### Requirements
1. Host the project on **GitHub Pages**.
2. Create a QR code linking to your project page.
3. Include on the AR experience:
   - Business card details (name, title, contact info).
   - Links to relevant social media (LinkedIn, GitHub, Twitter, etc.).
4. Expand the experience beyond basic card info:
   - Show off projects, hobbies, or your portfolio.
   - Create interactive elements, animations, or games.
5. Submit URLs for:
   - GitHub repository.
   - QR code image.

💡 **Tips for Creativity:**
- Highlight passions and projects that don’t fit on a traditional card.
- Make the experience memorable (e.g., a small interactive game or animation).

---

### Task 2: Share Your Knowledge
Write a blog post to reflect on your journey and share your insights.

#### Requirements
1. Discuss the AR development tools used (Unity vs. WebXR):
   - What you liked about Unity.
   - What you liked about WebXR.
2. Provide a beginner-friendly **WebXR tutorial**:
   - Include tips, tricks, and pitfalls to avoid.
3. Use at least one image at the top of the post.
4. Publish the post on **Medium** or **LinkedIn**.
5. Share the blog post on **LinkedIn** or **Twitter**.

#### Deliverable
- A blog post link (e.g., [Medium Post](https://medium.com)).

---

## 🚀 Final Deliverables

| Task                   | Deliverable                               | Example Link                                     |
|------------------------|-------------------------------------------|-------------------------------------------------|
| **WebXR Tutorial**     | GitHub Repository                        | [https://github.com/Bmontezuma/webAR](#)       |
|                        | Live Project                             | [https://bmontezuma.github.io/webAR/](#)       |
| **Business Card**      | GitHub Repository                        | [](#)                              |
|                        | QR Code                                  | [](#)                     |
| **Blog Post**          | Published Blog Post                      | [](#)                         |

---

## �� Get Creative!
Use this project to show off your creativity and technical skills:
- Share your passions through AR.
- Make your project memorable with interactive elements or animations.
- Demonstrate your unique ability to combine design, AR, and web technologies.

---

# How to Install Node.js and npm

## **Step 1: Download Node.js**
1. Visit the official [Node.js website](https://nodejs.org).
2. Download the **LTS (Long-Term Support)** version for stability.
3. Select the installer for your operating system:
   - **Windows:** `.msi` file
   - **macOS:** `.pkg` file
   - **Linux:** Follow the Linux-specific installation instructions on the website.

---

## **Step 2: Install Node.js**
1. Run the installer you downloaded.
2. Follow the installation wizard:
   - Accept the license agreement.
   - Choose the installation location.
   - Ensure the option to install npm is selected (default).
3. Complete the installation.

---

## **Step 3: Verify Installation**
1. Open a terminal (Command Prompt, PowerShell, or Terminal).
2. Verify Node.js is installed:
```bash
   node -v
```

# How to Use Three.js

## Step 1: Install Three.js
1. Open your terminal in the project directory.
2. Run the following command to install three.js:
```bash
   npm install three
```
### Basic Three.js Setup
Create the following files to start using three.js:

index.html
```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebAR with Three.js</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>WebAR with Three.js</h1>
    <canvas id="webgl-canvas"></canvas>
    <script src="script.js" defer></script>
</body>
</html>
```
### styles.css

```css

body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #202020;
    color: #fff;
    font-family: Arial, sans-serif;
}

canvas {
    width: 100%;
    height: 100%;
}
```
### script.js
```javascript

import * as THREE from 'three';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Set camera position
camera.position.z = 5;

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
```
Step 3: Run the Project\
Serve your project locally using a simple HTTP server.\ Install http-server globally:
```bash
npm install -g http-server
```
Navigate to your project folder and run:
```bash
http-server
```
Open the URL provided in the terminal (e.g., http://localhost:8080) in your browser.
