import * as satellite from 'satellite.js';
import { PREDICTION_TIME_FRAME } from './constants';


export function predictPath(TLE1, TLE2) {
    const satrec = satellite.twoline2satrec(TLE1, TLE2);

    const futureDate = new Date(new Date().getTime() + PREDICTION_TIME_FRAME * 1000); // 1 second ahead

    const positionAndVelocity = satellite.propagate(satrec, futureDate);
    const positionEci = positionAndVelocity.position;

    const gmst = satellite.gstime(futureDate);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

    var longitude = satellite.degreesLong(positionGd.longitude);
    var latitude = satellite.degreesLat(positionGd.latitude);
    var altitude = positionGd.height;

    return [latitude, longitude, altitude];
}





