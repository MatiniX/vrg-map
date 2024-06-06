import * as ol from 'ol';
import { degrees, radians } from './utils';
import { Coordinate } from 'ol/coordinate';

declare module 'ol/sphere' {
  interface Sphere {
    offset(c1: Coordinate, distance: number, bearing: number): Coordinate;
  }
}
/**
 * Returns the coordinate at the given distance and bearing from `c1`.
 *
 * @param {ol.Coordinate} c1 The origin point (`[lon, lat]` in degrees).
 * @param {number} distance The great-circle distance between the origin
 *     point and the target point.
Sphere.prototype.offset = function (c1: Coordinate, distance: number, bearing: null) {
 * @return {ol.Coordinate} The target point.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
ol.Sphere.prototype.offset = function (c1: Coordinate, distance: number, bearing: number) {
  const lat1 = radians(c1[1]);
  const lon1 = radians(c1[0]);
  const dByR = distance / this.radius;
  const lat = Math.asin(
    Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing)
  );
  const lon =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat)
    );
  return [degrees(lon), degrees(lat)];
};
