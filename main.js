// 1. Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color('#121214');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. Global Group to hold everything together (Shape + Text)
const emblemGroup = new THREE.Group();
scene.add(emblemGroup);

let baseMesh, textMesh;
let loadedFont;

// Default Styling State
const config = {
    shape: 'coin',
    materialType: 'metal',
    color: '#ffd700',
    text: 'A'
};

// Base Material Setup
const material = new THREE.MeshStandardMaterial({
    color: config.color,
    metalness: 0.8,
    roughness: 0.2
});

// 3. Helper to build a 2D Star shape
function createStarGeometry() {
    const starShape = new THREE.Shape();
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? 2.5 : 1.1;
        const angle = (i / (spikes * 2)) * Math.PI * 2;
        if (i === 0) starShape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else starShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    return new THREE.ExtrudeGeometry(starShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 3 });
}

// 4. Main Refresh Function
function rebuildEmblem() {
    // Clear old base shape
    if (baseMesh) {
        emblemGroup.remove(baseMesh);
        baseMesh.geometry.dispose();
    }

    // A. Generate Geometry
    let geometry;
    if (config.shape === 'coin') {
        geometry = new THREE.CylinderGeometry(2.2, 2.2, 0.4, 64);
    } else if (config.shape === 'square') {
        geometry = new THREE.BoxGeometry(3.6, 3.6, 0.4);
    } else if (config.shape === 'diamond') {
        geometry = new THREE.OctahedronGeometry(2.4, 0);
    } else if (config.shape === 'star') {
        geometry = createStarGeometry();
    }

    baseMesh = new THREE.Mesh(geometry, material);
    
    // Flatten alignment for the cylinder
    if (config.shape === 'coin') baseMesh.rotation.x = Math.PI / 2;

    emblemGroup.add(baseMesh);
    rebuildText();
}

// 5. Build 3D Text Geometry
function rebuildText() {
    if (textMesh) {
        emblemGroup.remove(textMesh);
        textMesh.geometry.dispose();
    }

    if (!loadedFont || !config.text) return;

    const textGeo = new THREE.TextGeometry(config.text, {
        font: loadedFont,
        size: 1.0,
        height: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.02
    });

    // Centers the text boundary bounding box perfectly
    textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    const centerYOffset = -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

    // Create text mesh using a slightly darker/contrasting shade of the chosen color
    const textMat = new THREE.MeshStandardMaterial({
        color: material.color.clone().multiplyScalar(0.6), 
        metalness: material.metalness,
        roughness: material.roughness
    });

    textMesh = new THREE.Mesh(textGeo, textMat);
    
    // Shift text forward slightly so it sits neatly on the face of the emblem
    textMesh.position.set(centerOffset, centerYOffset, 0.25);
    emblemGroup.add(textMesh);
}

// 6. Update Material Rules
function updateMaterialProperties() {
    material.color.set(config.color);
    if (config.materialType === 'metal') {
        material.metalness = 0.9;
        material.roughness = 0.15;
    } else if (config.materialType === 'plastic') {
        material.metalness = 0.1;
        material.roughness = 0.5;
    } else if (config.materialType === 'glass') {
        material.metalness = 0.3;
        material.roughness = 0.05;
    }
    rebuildEmblem();
}

// 7. Load Font Asset asynchronously
const loader = new THREE.FontLoader();
// Using a standard open source font asset hosted via CDN
loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    loadedFont = font;
    rebuildEmblem();
});

// 8. Studio Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight1.position.set(5, 5, 4);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.4); // Subtle cool blue rim light
dirLight2.position.set(-5, -5, 2);
scene.add(dirLight2);

// 9. Animation Settings
let isSpinning = true;
function animate() {
    requestAnimationFrame(animate);
    if (isSpinning) {
        emblemGroup.rotation.y += 0.012;
        emblemGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.15; // Smooth idle float
    }
    renderer.render(scene, camera);
}
animate();

// 10. Event Listeners for UI
document.getElementById('shapeSelect').addEventListener('change', (e) => {
    config.shape = e.target.value;
    rebuildEmblem();
});

document.getElementById('materialSelect').addEventListener('change', (e) => {
    config.materialType = e.target.value;
    updateMaterialProperties();
});

document.getElementById('emblemColor').addEventListener('input', (e) => {
    config.color = e.target.value;
    updateMaterialProperties();
});

document.getElementById('emblemText').addEventListener('input', (e) => {
    config.text = e.target.value;
    rebuildText();
});

const toggleBtn = document.getElementById('toggleSpin');
toggleBtn.addEventListener('click', () => {
    isSpinning = !isSpinning;
    toggleBtn.textContent = isSpinning ? "Stop Spinning" : "Start Spinning";
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
