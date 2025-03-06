import * as satellite from 'satellite.js';
import { EARTHRADIUS } from './constants';


export function sphereToCarte(lat, lon, alt) {
    // scales down altitude to fit scene, 1000km = 1 unit in scene
    var r = EARTHRADIUS + alt/1000;

    // const x = r * Math.cos(lat * (Math.PI / 180)) * Math.cos(lon * (Math.PI / 180));
    // const y = r * Math.cos(lat * (Math.PI / 180)) * Math.sin(lon * (Math.PI / 180));
    // const z = r * Math.sin(lat * (Math.PI / 180));
    const x = r * Math.cos(lat * (Math.PI / 180)) * Math.cos(-lon * (Math.PI / 180));
    const y = r * Math.sin(lat * (Math.PI / 180));
    const z = r * Math.sin(-lon * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180));

    return [x, y, z];
}


export function latLongFromTLE(TLE1, TLE2) {
    var satrec = satellite.twoline2satrec(TLE1, TLE2);
    
    var date = new Date();

    // Propagate satellite using current time
    var positionAndVelocity = satellite.propagate(satrec, date);

    // Extract position (ECI coordinates)
    var positionEci = positionAndVelocity.position;

    if (!positionEci) {
        return null; // Return null if something went wrong
    }

    // Convert ECI to Geodetic (latitude, longitude, altitude)
    var gmst = satellite.gstime(date);
    
    if (typeof gmst === 'undefined') {
        return null; // Return null if something went wrong
    }

    var positionGd = satellite.eciToGeodetic(positionEci, gmst);

    if (!positionGd) {
        return null; // Return null if something went wrong
    }

    var longitude = satellite.degreesLong(positionGd.longitude);
    var latitude = satellite.degreesLat(positionGd.latitude);
    var altitude = positionGd.height;

    return [latitude, longitude, altitude];
}