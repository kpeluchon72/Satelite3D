import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { fetchActiveSatellites } from './data.js';
import { SatelliteObj } from './SatelliteObj.js';
import { EARTHRADIUS } from './constants.js';
import { SatelliteManager } from './SatelliteManager.js';
import { latLongFromTLE, sphereToCarte } from './coordinates.js';


// Scene, Renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

// Earth
const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTHRADIUS, 100, 100), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./img/earth_texture.jpg')}))
earth.position.set(0, 0, 0);
scene.add(earth);

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 15

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

controls.update();

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        console.log(intersectedObject);

    }
    
}

window.addEventListener('mousemove', onMouseMove, false);

// Satellites
const satellites = [];

function cleanSatellites(satellites) {
    for (let i = 0; i < satellites.length; i++) {
        if (satellites[i].status == null) {
            satellites.splice(i, 1);
        }
    }
}


function createSatellites(Data) {
    // satellitesData.length
    for (let i = 0; i < satellitesData.length; i++) {
        const satellite = Data[i];
        const cursatellite = new SatelliteObj(satellite, scene, 0.03, 0x00ff00)
        satellites.push(cursatellite);
    }
    cleanSatellites(satellites);

}

//coord system
// for (let i = 0; i <10; i++) {
//     const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 5), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
//     ball.position.set(0, 0, 0 + i*0.5);
//     scene.add(ball);

// }
// for (let i = 0; i <10; i++) {
//     const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
//     ball.position.set(0, 0 + i*0.5, 0);
//     scene.add(ball);

// }
// for (let i = 0; i <10; i++) {
//     const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5, 5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
//     ball.position.set(0+ i*0.5, 0, 0);
//     scene.add(ball);

// }


// Get active satellites data
const satellitesData = await fetchActiveSatellites();

createSatellites(satellitesData);

const satelliteManager = new SatelliteManager(scene, satellites)
satelliteManager.startUpdating();

// Reset camera keybind
window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        controls.reset();
        camera.position.set(15, 0, 0);
    }
});

// Stop updating satellites
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'R') {
        satelliteManager.stopUpdating();
    }
});



// three.js graphics loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();