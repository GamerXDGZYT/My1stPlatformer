// 1. Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0a0a0c');

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6.5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Dramatic, realistic color curves
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// 2. Global State & Groups
const emblemGroup = new THREE.Group();
scene.add(emblemGroup);

let baseMesh, textMesh;
let loadedFont;

const config = {
    shape: 'coin',
    materialType: 'metal',
    color: '#ffd700',
    text: 'A'
};

// Base advanced material mapping
const material = new THREE.MeshPhysicalMaterial({
    color: config.color,
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1
});

// 3. Helper for 2D Star Geometry
function createStarGeometry() {
    const starShape = new THREE.Shape();
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? 2.3 : 1.1;
        const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        if (i === 0) starShape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        else starShape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    return new THREE.ExtrudeGeometry(starShape, { 
        depth: 0.4, 
        bevelEnabled: true, 
        bevelThickness: 0.15, 
        bevelSize: 0.05, 
        bevelSegments: 5 
    });
}

// 4. Main Refresh Function
function rebuildEmblem() {
    if (baseMesh) {
        emblemGroup.remove(baseMesh);
        baseMesh.geometry.dispose();
    }

    let geometry;
    let zOffset = 0.22; // Default text positioning depth

    if (config.shape === 'coin') {
        geometry = new THREE.CylinderGeometry(2.2, 2.2, 0.4, 64);
    } else if (config.shape === 'square') {
        geometry = new THREE.BoxGeometry(3.6, 3.6, 0.4);
    } else if (config.shape === 'diamond') {
        geometry = new THREE.OctahedronGeometry(2.4, 0);
        zOffset = 1.25; // Push text ahead of the diamond point
    } else if (config.shape === 'star') {
        geometry = createStarGeometry();
    }

    baseMesh = new THREE.Mesh(geometry, material);
    
    if (config.shape === 'coin') {
        baseMesh.rotation.x = Math.PI / 2;
    } else {
        baseMesh.rotation.x = 0;
    }

    emblemGroup.add(baseMesh);
    rebuildText(zOffset);
}

// 5. Build 3D Text Geometry with dynamic alignment logic
function rebuildText(zOffset = 0.22) {
    if (textMesh) {
        emblemGroup.remove(textMesh);
        textMesh.geometry.dispose();
    }

    if (!loadedFont || !config.text) return;

    const textGeo = new THREE.TextGeometry(config.text, {
        font: loadedFont,
        size: 0.9,
        height: 0.25,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.02,
        bevelSegments: 3
    });

    textGeo.computeBoundingBox();
    const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    const centerYOffset = -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);

    // Dynamic color text styling logic based on emblem backing
    const textMat = new THREE.MeshPhysicalMaterial({
        color: config.materialType === 'glass' ? config.color : material.color.clone().multiplyScalar(0.4),
        metalness: config.materialType === 'glass' ? 0.9 : material.metalness,
        roughness: 0.2,
        clearcoat: 0.5
    });

    textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(centerOffset, centerYOffset, zOffset);
    emblemGroup.add(textMesh);
}

// 6. Update Material Rules with MeshPhysical Material Parameters
function updateMaterialProperties() {
    material.color.set(config.color);
    
    if (config.materialType === 'metal') {
        material.metalness = 0.95;
        material.roughness = 0.12;
        material.transmission = 0.0;
        material.thickness = 0.0;
        material.clearcoat = 0.4;
    } else if (config.materialType === 'plastic') {
        material.metalness = 0.0;
        material.roughness = 0.35;
        material.transmission = 0.0;
        material.thickness = 0.0;
        material.clearcoat = 0.1;
    } else if (config.materialType === 'glass') {
        material.metalness = 0.1;
        material.roughness = 0.1;
        material.transmission = 0.9; // Physical transparency layout
        material.thickness = 1.2;    // Refraction depth distortion
        material.clearcoat = 1.0;
    }
    rebuildEmblem();
}

// 7. Load Font Asset asynchronously
const loader = new THREE.FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    loadedFont = font;
    rebuildEmblem();
});

// 8. Studio Lights Configuration
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainKeyLight.position.set(5, 5, 5);
scene.add(mainKeyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-5, 2, 2);
scene.add(fillLight);

const colorfulRimLight = new THREE.PointLight(0x3b82f6, 1.5, 15);
colorfulRimLight.position.set(-4, -4, 3);
scene.add(colorfulRimLight);

// 9. Interactive Animation Variables
let isSpinning = true;
let targetMouseX = 0, targetMouseY = 0;
let currentMouseX = 0, currentMouseY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Smooth lerping mouse follow effects
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    if (isSpinning) {
        emblemGroup.rotation.y += 0.01;
        emblemGroup.rotation.x = (Math.sin(Date.now() * 0.001) * 0.12) + (currentMouseY * 0.4);
    } else {
        // Subtle mouse tracking interaction when paused
        emblemGroup.rotation.y = currentMouseX * 0.8;
        emblemGroup.rotation.x = currentMouseY * 0.6;
    }

    renderer.render(scene, camera);
}
animate();

// 10. Event Handlers
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
    rebuildEmblem();
});

const toggleBtn = document.getElementById('toggleSpin');
toggleBtn.addEventListener('click', () => {
    isSpinning = !isSpinning;
    toggleBtn.textContent = isSpinning ? "Stop Spinning" : "Manual Control";
    toggleBtn.classList.toggle('paused', !isSpinning);
});

// Interactive dynamic mouse listeners
window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
