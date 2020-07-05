import * as Cesium from 'cesium';
import { v4 as uuid } from 'uuid';
import * as turf from '@turf/turf';
import { notification } from 'antd'
import Point from '../point/point';
import Coordinate from '../point/coordinate';
import { angleBetweenBrngs } from '../math/math'

class Polyline {

  constructor (
    points = null, id = null, color = null, theme=null, highlight=null, width = null,
    show = true
  ) {
    this.points = points ? points : [];
    this.entityId = id || uuid();
    this.color = color || Cesium.Color.STEELBLUE;
    this.theme = theme || Cesium.Color.STEELBLUE
    this.highlight = highlight || Cesium.Color.ORANGE
    this.show = show;
    this.width = width || 4;
  }

  static fromPolyline (
    polyline, points=null, id = null, color = null, theme=null, highlight=null,
    width = null, show = true
  ) {
    const newPoints = points || polyline.points;
    const newId = id || polyline.entityId
    const newColor = color || polyline.color;
    const newTheme = theme || polyline.theme
    const newHighlight = highlight || polyline.highlight
    const newShow = show || polyline.show;
    const newWidth = width || polyline.width;
    return new Polyline (newPoints, newId, newColor, newTheme, newHighlight, newWidth, newShow);
    }


  get length () {
    return this.points.length;
  }

  polylineLength = () => {
    let length = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      length += Point.linearDistance(this.points[i], this.points[i + 1]);
    }
    return Number(length.toFixed(2));
  }


  setColor = (newColor) => {
    this.color = newColor;
  };


  addPoint = (position, point) => {
    this.points.splice(position, 0, point);
  }


  addPointPrecision = (position, point) => {
    const newCoordinate = this.preciseAddPointPosition(position, point);
    const newPoint = Point.fromPoint(point);
    newPoint.setCoordinate(
      newCoordinate.lon, newCoordinate.lat, newCoordinate.height
    );
    this.points.splice(position, 0, newPoint);
  }


  addPointTail = (point) => {
    this.addPoint(this.length, point);
  }

  determineAddPointPosition = (cor) => {
    const polylineLengthArray = this.getSegmentDistance();
    const corDistArray = this.points.map((elem, index) => ({
      index: index,
      dist: Coordinate.surfaceDistance(elem, cor)
    }))
    const candidateIndex = corDistArray.filter((obj, index) =>
      obj.dist < polylineLengthArray[index]
    ).map(obj => obj.index)

    const polylineBrngArray = this.getSegmentBearing()
      .filter((brng, index) => candidateIndex.includes(index));
    const corBrngArray = this.points.map((elem, index) => ({
      src: elem,
      index: index,
      brng: Coordinate.bearing(elem, cor)
    })).filter((obj, index) => candidateIndex.includes(obj.index))

    const brngDiff = polylineBrngArray.map((elem,index) => ({
      src: corBrngArray[index].src,
      brngDiff: angleBetweenBrngs(elem, corBrngArray[index].brng)
    }))
    const bestRecord = brngDiff.reduce((bestRecord, elem, index, array) =>
      elem.brngDiff < bestRecord.brngDiff ? elem : bestRecord
    , brngDiff[0])
    return this.points.indexOf(bestRecord.src) + 1
  }

  preciseAddPointPosition = (index, mouseCoordinate) => {
    const distToMouse = Coordinate.surfaceDistance(
      this.points[index - 1],
      mouseCoordinate
    );
    const brngToMouse = Coordinate.bearing(
      this.points[index - 1],
      mouseCoordinate
    );
    const polylineSegmentBrng = Coordinate.bearing(
      this.points[index - 1],
      this.points[index]
    );
    const cosine = Math.cos(
      Cesium.Math.toRadians(brngToMouse - polylineSegmentBrng)
    );
    const trueDist = cosine * distToMouse;
    return Coordinate.destination(
      this.points[index - 1],
      polylineSegmentBrng,
      trueDist
    );
  }

  /**
   * update the point at a specific position to a new point
   * @param {number}  position the index position of the point to be updated
   * @param {Point}   point    the Point object to be added
   */
  updatePoint = (position, point) => {
    if (point instanceof Point) {
      this.points.splice(position, 1, point);
    } else {
      throw new Error('Adding object is not a Point object');
    }
  }



  deletePoint = (position) => {
    if (this.length <= 2) {
      return notification({
        message: 'Cannot delete any more point'
      })
    }
    if (position < this.length) {
      const deletedPoint = this.points.splice(position, 1);
      return deletedPoint[0];
    } else {
      throw new Error('The index is beyond Polyline length');
    }
  }

  /**
   * get a coordinates array of all points in the polyline
   * @param  {Boolean}    [flat=true] whether return a flat array of 2D array
   * @return {number[]}               a flat array of all points' coordinates,
   *                                  i.e. [lon1, lat1, h1, lon2, lat2, h2, ...]
   * or
   * @return {[number[]]}             a 2D array of all points' coordinates, i.e.
   *                                  [[lon1, lat1, h1], [lon2, lat2, h2], ...]
   */
  getPointsCoordinatesArray = (flat = true) => {
    let CoordinatesArray = [];
    if (flat) {
      this.points.map(point => {
        return CoordinatesArray = CoordinatesArray.concat(
          point.getCoordinate(true)
        );
      });
      return CoordinatesArray;
    } else {
      this.points.map(point => {
        return CoordinatesArray.push(point.getCoordinate(true));
      });
      return CoordinatesArray;
    }
  }

  /**
   * get the bearings of each segment in the polyline
   * @return {Number[]}   the array of bearings of each segment in the polyline
   */
  getSegmentBearing = () => {
    let brngArray = [];
    for (let i = 0; i < this.length-1; i++) {
      brngArray.push(Point.bearing(this.points[i], this.points[i+1]));
    }
    return brngArray;
  }

  /**
   * get the distance of each segment in the polyline
   * @return {Number[]}   the distance of each segment in the polyline
   */
  getSegmentDistance = () => {
    let distArray = [];
    for (let i = 0; i < this.length-1; i++) {
      distArray.push(Point.surfaceDistance(this.points[i], this.points[i+1]));
    }
    return distArray;
  }

  /**
   * make every segment of the Polyline to be individual Polyline objects
   * @return {Polyline[]} the Polyline objects of every segment of the Polyline
   */
  getSegmentPolyline = () => {
    let polylineArray = [];
    for (let i = 0; i < this.length-1; i++) {
      polylineArray.push(new Polyline([this.points[i], this.points[i+1]]));
    }
    return polylineArray;
  }


  makeGeoJSON = () => {
    const coordinates = this.getPointsCoordinatesArray(false);
    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          coordinates
        ]
      }
    }
    return geoJSON;
  };

  isSelfIntersection = () => {
    const geoJson = this.makeGeoJSON();
    const selfIntersectionDetect = turf.kinks(geoJson);
    if (selfIntersectionDetect.features.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  intersectPolyline = (polyline2) => {
    const geoJson = this.makeGeoJSON();
    const geoJson2 = polyline2.makeGeoJSON();
    const intersect = turf.lineIntersect(geoJson, geoJson2);
    if (intersect.features.length === 0) {
      return false;
    } else {
      const intersectCor = intersect.features[0].geometry.coordinates;
      let matchExist = false;
      polyline2.points.forEach(p => {
        if (p.lon === intersectCor[0] && p.lat === intersectCor[1]) {
          matchExist = true;
        }
      })
      return !matchExist;
    }
  }
}

export default Polyline;
