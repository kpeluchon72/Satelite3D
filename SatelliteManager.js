import * as THREE from 'three';
import { PREDICTION_TIME_FRAME } from './constants';


function getFlattenedCoords(satellites) {
    let coords = [];

    for (let i = 0; i < satellites.length; i++) {
        if (satellites[i].status != null) {
            coords.push(...satellites[i].satelliteCoords);
        }
    }

    return coords;

}

let satelliteTexture = null;
function loadSatelliteTexture() {
    if (!satelliteTexture) {
        satelliteTexture = new THREE.TextureLoader().load('./img/circle.png');
    }
    return satelliteTexture;
}



export class SatelliteManager {
    constructor(scene, satellites) {
        this.scene = scene;
        this.satellites = satellites;
        this.satelliteTexture = loadSatelliteTexture();

        this.geometry = new THREE.BufferGeometry();

        this.positions = new Float32Array(this.satellites.length * 3);
        this.positions.set(getFlattenedCoords(this.satellites));

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        
        this.material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,  // Size of each point
            map: this.satelliteTexture,  // Texture applied to each point
            transparent: true,  // Make sure the texture is transparent if needed
            alphaTest: 0.5,  // This will discard pixels with alpha value less than 0.5 (helps remove unwanted transparency)
            // blending: THREE.AdditiveBlending  // Optional: makes the points look like glowing particles
        });

        this.points = new THREE.Points(this.geometry, this.material);

        this.scene.add(this.points);

    }

    startUpdating() {
        const updatePositions = () => {
            for (let i = 0; i < this.satellites.length; i++) {
                this.satellites[i].predictFuturePath();
                this.positions.set(this.satellites[i].satelliteCoords, i * 3);
            }
            
            this.geometry.attributes.position.needsUpdate = true;

            this.updateTimeout = setTimeout(updatePositions, PREDICTION_TIME_FRAME * 1000);


        };

        updatePositions();
    }


    stopUpdating() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = null;
        }
    }
    

}
