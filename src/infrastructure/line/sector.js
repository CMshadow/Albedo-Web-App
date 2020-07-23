import * as Cesium from 'cesium';

import Polyline from './polyline';
import Coordinate from '../point/coordinate';

class Sector extends Polyline {

  constructor (originCor, brng, radius, angle, id = null,
    color = null, width = null, show = true
  ) {
    const points = Sector.calculatePoints(originCor, brng, radius, angle)
    super(points, id, color, width, show);
    this.originCor = originCor;
    this.brng = brng;
    this.radius = radius;
    this.angle = angle;
  }

  static calculatePoints = (originCor, brng, radius, angle) => {
    const points = [];
    for (
      let direction = brng - angle/2; direction <= brng + angle/2; direction+=5
    ) {
      points.push(
        Coordinate.destination(originCor, direction, radius),
      );
    }
    return [originCor, ...points, originCor];
  }

  static fromSector = (sector) => {
    return new Sector(
      sector.originCor, sector.brng, sector.radius, sector.angle, sector.entityId,
      sector.color, sector.width, sector.show
    )
  }

  updateOriginCor = (newOriginCor) => {
    const newPoints = Sector.calculatePoints(
      newOriginCor, this.brng, this.radius, this.angle, this.color
    );
    this.points = newPoints;
    this.originCor = newOriginCor;
  }

  updateRadius = (newRadius) => {
    const newPoints = Sector.calculatePoints(
      this.originCor, this.brng, newRadius, this.angle, this.color
    );
    this.points = newPoints;
    this.radius = newRadius;
  }

  updateAngle = (mouseBearing) => {
    const brngChange =
      (this.brng - mouseBearing > 0 ?
      this.brng - mouseBearing :
      360 + (this.brng - mouseBearing)) - this.angle / 2
    const newAngle = (this.angle + brngChange) % 360;
    const newPoints = Sector.calculatePoints(
      this.originCor, (mouseBearing + newAngle / 2) % 360, this.radius,
      newAngle, this.color
    );
    this.points = newPoints;
    this.brng = (mouseBearing + newAngle / 2) % 360;
    this.angle = newAngle;
  }

  updateBearing = (mouseBearing) => {
    const newBearing = (
      mouseBearing - this.angle/2 > 0 ?
      mouseBearing - this.angle/2 :
      360 + (mouseBearing - this.angle/2)
    )%360;
    const newPoints = Sector.calculatePoints(
      this.originCor, newBearing, this.radius, this.angle, this.color
    );
    this.points = newPoints;
    this.brng = newBearing;
  }
}

export default Sector;
