import Polyline from './polyline';
import Coordinate from '../point/coordinate';

class Circle extends Polyline {

  constructor (
    originCor, radius, id = null, color = null, width = null, show = true
  ) {
    const points = Circle.calculatePoints(originCor, radius)
    super([...points, points[0]], id, color, width, show);
    this.centerPoint = originCor
    this.radius = radius;
  }

  static calculatePoints = (originCor, radius) => {
    const points = [];
    for (let direction = 0; direction <= 355; direction+=5) {
      points.push(
        Coordinate.destination(originCor, direction, radius),
      );
    }
    return points;
  }

  updateCenterPoint = (newOriginCor) => {
    const newPoints = Circle.calculatePoints(
      newOriginCor, this.radius, this.color
    );
    this.centerPoint.setCoordinate(
      newOriginCor.lon, newOriginCor.lat, newOriginCor.height
    )
    this.points = [...newPoints, newPoints[0]];
  }

  updateRadius = (newRadius) => {
    const newPoints = Circle.calculatePoints(
      this.centerPoint, newRadius, this.color
    );
    this.points = [...newPoints, newPoints[0]];
    this.radius = newRadius;
  }
}

export default Circle;
