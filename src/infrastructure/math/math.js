import { Math as CesiumMath } from 'cesium';

import Coordinate from '../point/coordinate';

export const coordinateToVector = (coordinate) => {
  const latRadians = CesiumMath.toRadians(coordinate.lat);
  const lonRadians = CesiumMath.toRadians(coordinate.lon);

  const x = Math.cos(latRadians) * Math.cos(lonRadians);
  const y = Math.cos(latRadians) * Math.sin(lonRadians);
  const z = Math.sin(latRadians);

  return [x, y, z];
};

export const vectorToCoordinate = (v, height) => {
  const latRadians = Math.atan2(v[2], Math.sqrt(v[0] * v[0] + v[1] * v[1]));
  const lonRadians = Math.atan2(v[1], v[0]);

  return new Coordinate(
    CesiumMath.toDegrees(lonRadians),
    CesiumMath.toDegrees(latRadians),
    height
  );
};

export const greatCircle = (coordinate, bearing) => {
  const latRadians = CesiumMath.toRadians(coordinate.lat);
  const lonRadians = CesiumMath.toRadians(coordinate.lon);
  const brngRadians = CesiumMath.toRadians(bearing);

  const x = Math.sin(lonRadians) * Math.cos(brngRadians) -
    Math.sin(latRadians) * Math.cos(lonRadians) * Math.sin(brngRadians);
  const y = -Math.cos(lonRadians) * Math.cos(brngRadians) -
    Math.sin(latRadians) * Math.sin(lonRadians) * Math.sin(brngRadians);
  const z = Math.cos(latRadians) * Math.sin(brngRadians);

  return [x, y, z];
};

export const cross = (v1, v2) => {
  const x = v1[1] * v2[2] - v1[2] * v2[1];
  const y = v1[2] * v2[0] - v1[0] * v2[2];
  const z = v1[0] * v2[1] - v1[1] * v2[0];

  return [x, y, z];
};

export const dot = (v1, v2) => {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};

export const plus = (v1, v2) => {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

export const mapBrng = (brng) => {
  const newBrng = brng % 360;
  if (newBrng < 0) {
    return 360 + newBrng;
  } else {
    return newBrng;
  }
}

export const angleBetweenBrngs = (brng1, brng2) => {
  const newBrng1 = mapBrng(brng1);
  const newBrng2 = mapBrng(brng2);
  return Math.min(
    360 - Math.abs(newBrng1 - newBrng2), Math.abs(newBrng1-newBrng2)
  );
}
