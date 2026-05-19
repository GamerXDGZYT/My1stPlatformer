// 1. Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a1a1a'); // Dark background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6; // Move camera back so we can see the emblem

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Makes it look sharp on high-res screens
document.body.appendChild(renderer.domElement);

// 2. Create the Emblem Base
// CylinderGeometry arguments: radiusTop, radiusBottom, height, radialSegments
const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 64);

// MeshStandardMaterial reacts to light, giving it a realistic metallic look
const material = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Starts as Gold
    metalness: 0.7,  // How much it reflects like metal
    roughness: 0.2   // How blurry the reflections are
});

const emblem = new THREE.Mesh(geometry, material);
// Rotate it 90 degrees so the flat face points at the camera
emblem.rotation.x = Math.PI / 2;
scene.add(emblem);

// 3. Add Lighting (Without lights, standard materials look pitch black)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Base light everywhere
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Main light source
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // Fill light from the bottom left
pointLight.position.set(-5, -5, 5);
scene.add(pointLight);

// 4. Animation Loop
let isSpinning = true;

function animate() {
    requestAnimationFrame(animate);

    // Spin the emblem if the toggle is on
    if (isSpinning) {
        emblem.rotation.y += 0.01;
        emblem.rotation.x += 0.002; // Slight wobble
    }

    renderer.render(scene, camera);
}

// Start the loop
animate();

// 5. Handle Window Resizing gracefully
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. Connect UI Controls
// Change Color
const colorPicker = document.getElementById('emblemColor');
if (colorPicker) {
    colorPicker.addEventListener('input', (event) => {
        material.color.set(event.target.value);
    });
}

// Toggle Spinning
const toggleSpinBtn = document.getElementById('toggleSpin');
if (toggleSpinBtn) {
    toggleSpinBtn.addEventListener('click', () => {
        isSpinning = !isSpinning;
        toggleSpinBtn.textContent = isSpinning ? "Stop Spinning" : "Start Spinning";
    });
}
