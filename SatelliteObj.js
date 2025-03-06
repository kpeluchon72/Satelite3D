import { latLongFromTLE } from "./coordinates";
import { sphereToCarte } from "./coordinates";
import { predictPath } from "./predictionPath";
import { PREDICTION_TIME_FRAME } from "./constants";



export class SatelliteObj {
    constructor(data, scene, radius, color) {
        // data entry as [name, tle1, tle2]
        this.data = data;
        this.name = data["name"];
        this.TLE1 = data["line1"];
        this.TLE2 = data["line2"];
        this.radius = radius;
        this.color = color;
        this.scene = scene;

        this.status = 1;

        this.latLonAlt = latLongFromTLE(this.TLE1, this.TLE2);
        if (this.latLonAlt == null) {
            this.status = null;
            // kill instance in main
            return
        }

        [this.lat, this.lon, this.alt] = this.latLonAlt;
        
        this.satelliteCoords = sphereToCarte(this.lat, this.lon, this.alt);
        [this.x, this.y, this.z] = this.satelliteCoords;

        // const spriteMaterial = new THREE.SpriteMaterial({
        //     map: loadSatelliteTexture(),
        // });
        
        // this.satellite = new THREE.Sprite(spriteMaterial);
        // this.satellite.position.set(this.x, this.y, this.z);
        // this.satellite.scale.set(this.radius * 2, this.radius * 2, 1);

        // // this.satelliteGeometry = new THREE.SphereGeometry(this.radius, 16, 16);
        // // this.satelliteMaterial = new THREE.MeshBasicMaterial({ color: this.color });
        // // this.satellite = new THREE.Mesh(this.satelliteGeometry, this.satelliteMaterial);
        // // this.satellite.position.set(this.x, this.y, this.z);
        
        // this.scene.add(this.satellite);
        // console.log("satellite added");
    }

    predictFuturePath() {
        let futureSatelliteCoords = predictPath(this.TLE1, this.TLE2);
        this.latLonAlt = futureSatelliteCoords;
        [this.lat, this.lon, this.alt] = this.latLonAlt;

        this.satelliteCoords = sphereToCarte(this.lat, this.lon, this.alt);
        [this.x, this.y, this.z] = this.satelliteCoords
        
        return
    }

}