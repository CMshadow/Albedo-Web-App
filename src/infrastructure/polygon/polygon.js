import { v1 as uuid } from 'uuid';
import  * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';


class Polygon {

  constructor(
    hierarchy = null,
    height = null,
    id = null,
    extrudedHeight = null,
    material= null,
    outlineColor = null,
    shadow = null,
    show = null,
    brng = null,
    obliquity = null,
    highestNode = null,
    lowestNode = null,
    edgesCollection = null
  ) {
    this.entityId = id || uuid();
    this.height = height || 0;
    this.hierarchy = hierarchy ? [...hierarchy] : [];
    this.perPositionHeight = true;
    this.extrudedHeight = extrudedHeight || 0;
    this.material = material || Cesium.Color.WHITE;
    this.outlineColor = outlineColor || Cesium.Color.BLACK;
    this.outlineWidth = 4;
    this.shadow = shadow || Cesium.ShadowMode.DISABLED;
    this.show = show || true;
    this.brng = brng || null;
    this.obliquity = obliquity || 0;
    this.highestNode = highestNode || null;
    this.lowestNode = lowestNode || null;
    this.edgesCollection = edgesCollection? [...edgesCollection] : null;
  }

  static fromPolygon (
    polygon,
    id = null,
    height= null,
    hierarchy = null,
    extrudedHeight = null,
    material=null,
    outlineColor= null,
    shadow=null,
    show=null,
    brng = null,
    obliquity = null,
    highestNode = null,
    lowestNode = null,
    edgesCollection = null
  ){
    const newID = id || polygon.entityId;
    const newHeight = height || polygon.height;
    const newHierarchy = hierarchy ? [...hierarchy]: polygon.hierarchy;
    const newExtrudedHeight = extrudedHeight || polygon.extrudedHeight;
    const newMaterial = material || polygon.material;
    const newOutLineColor = outlineColor || polygon.outlineColor;
    const newShadow = shadow || true;
    const newShow = show || true;
    const newBrng = brng || polygon.brng;
    const newObliquily = obliquity || polygon.obliquity;
    const newHighestNode = highestNode || polygon.highestNode;
    const newLowestNode = lowestNode || polygon.lowestNode;
    const newEdgesCollection = edgesCollection? [...edgesCollection]: polygon.edgesCollection;
    return new Polygon(
      newHierarchy, newHeight, newID, newExtrudedHeight, newMaterial,
      newOutLineColor, newShadow, newShow, newBrng, newObliquily,
      newHighestNode, newLowestNode, newEdgesCollection
    );
  };


  // static makeHierarchyFromPolyline = (
  //   polyline, overwriteHeight = null, heightOffset = 0
  // ) => {
  //   let polylineHierarchy = null;
  //
  //   if (polyline instanceof FoundLine) {
  //     polylineHierarchy = polyline.points.slice(0, -1).flatMap(p =>
  //       p.getCoordinate(true)
  //     );
  //   } else {
  //     polylineHierarchy = polyline.getPointsCoordinatesArray();
  //   }
  //   for (let i = 0; i < polylineHierarchy.length; i+=3){
  //     if (overwriteHeight) {
  //       polylineHierarchy[i+2] = overwriteHeight + heightOffset;
  //     } else {
  //       polylineHierarchy[i+2] += heightOffset;
  //     }
  //   }
  //   return polylineHierarchy;
  // }
  //
  static makeHierarchyFromCoordinates = (coordinates) => {
    let polylineHierarchy = [];
    coordinates.forEach(cor => {
      polylineHierarchy = polylineHierarchy.concat(
        [cor.lon, cor.lat, cor.height]
      );
    });
    return polylineHierarchy;
  }

  static makeHierarchyFromGeoJSON = (GeoJSON, height, heightOffset = 0) => {
    let polylineHierarchy = [];
    GeoJSON.geometry.coordinates[0].forEach(cor => {
      polylineHierarchy = polylineHierarchy.concat(
        [cor[0], cor[1], height + heightOffset]
      );
    });
    return polylineHierarchy;
  }

  setHeight = (newHeight) => {
    this.height = newHeight;
  };

  setHierarchy = (newHierarchy) => {
    this.hierarchy = newHierarchy;
  };

  setColor = (newColor) => {
    this.material = newColor;
  };

  // toFoundLine = () => {
  //   return this.convertHierarchyToFoundLine();
  // }

  convertHierarchyToCoordinate = () => {
    const coordinates = [];
    for (let i = 0; i < this.hierarchy.length; i+=3) {
      coordinates.push(
        new Coordinate(this.hierarchy[i], this.hierarchy[i+1], this.hierarchy[i+2])
      );
    }
    return coordinates
  }

  // convertHierarchyToFoundLine = () => {
  //   const points = this.convertHierarchyToPoints();
  //   return new FoundLine([...points, points[0]]);
  // }

}
export default Polygon;
