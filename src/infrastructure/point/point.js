import { Color } from 'cesium';
import { v1 as uuid } from 'uuid';

import Coordinate from './coordinate';

/**
 * A point, extended from Coordinate
 * @extends Coordinate
 */
class Point extends Coordinate {

  /**
   * Point constructor
   * @param {number}  lon           the lontitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  lat           the latitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  height        the height of the coordinate, fixed
   *                                to 3 decimalplaces
   * @param {number}  [hOffset=0]   the height offset beyond its original
   *                                height, default 0
   * @param {string}  [id=null]     unique id of the point, automatic
   *                                generate one if not provided
   * @param {string}  [name=null]   name of the point, automatic generate
   *                                one if not provided
   * @param {Color}   [color=null]  GRBA color, Cesium.Color.WHITE if not
   *                                provided
   * @param {int}     [size=null]   the size of the point, 15 if not
   *                                provided
   * @param {bool}    [show=true]   whether to show the point, default true
   * @param {bool}    [render=true] whether to render the point, default true
   */
  constructor(
    lon, lat, height, id = null, color = null, theme=null, highlight=null,
    size = null, show = true
  ) {
    super(lon, lat, height);
    this.entityId = id || uuid();
    this.color = color || Color.WHITE;
    this.theme = theme || Color.WHITE
    this.highlight = highlight || Color.ORANGE
    this.pixelSize = size || 15;
    this.show = show;
  };

  setColor = (newColor) => {
    this.color = newColor;
  };

  setEntityId = (newId) => {
    this.entityId = newId
  }

  setPixelSize = (newSize) => {
    this.pixelSize = newSize
  }

  setShow = (newShow) => {
    this.show = newShow
  }

  /**
   * A copy constructor from an existing Point object
   * @param  {Point} point            the existing Point object to be copied
   * @param  {number} [lon=null]      overwrite lontitude value
   * @param  {number} [lat=null]      overwrite latitude value
   * @param  {number} [height=null]   overwrite height value
   * @param  {number} [offset=null]   overwrite offset value
   * @param  {string} [id=null]       overwrite id value
   * @param  {string} [name=null]     overwrite name value
   * @param  {Color} [color=null]     overwrite color value
   * @param  {bool} [show=null]       overwrite show/hide value
   * @param  {int} [pixelSize=null]   overwrite point size value
   * @param  {bool} [render=null]     overwrite render/no render value
   * @return {Point}                  new Point object
   */
  static fromPoint (point) {
    const newLon = point.lon;
    const newLat = point.lat;
    const newHeight = point.height;
    const newId = point.entityId
    const newColor = point.color;
    const newTheme = point.theme
    const newHighlight = point.highlight
    const newShow = point.show;
    const newPixelSize = point.pixelSize;
    return new Point (
      newLon, newLat, newHeight, newId, newColor, newTheme, newHighlight,
      newPixelSize, newShow
    );
  };

  /**
   * create a Point object from a Coordinate object
   * @param  {Coordinate}    coordinate   the Coordinate object
   * @param  {number}        [hOffset=0]  the height offset beyond its original
   *                                      height, default 0
   * @param  {string}        [id=null]    unique id of the point, automatic
   *                                      generate one if not provided
   * @param  {string}        [name=null]  name of the point, automatic generate
   *                                      one if not provided
   * @param  {Color}         [color=null] GRBA color, Cesium.Color.WHITE if not
   *                                      provided
   * @param  {int}           [size=null]  the size of the point, 15 if not
   *                                      provided
   * @param  {bool}          [show=true]  whether to show the point, default
   *                                      true
   * @param {bool}    [render=true] whether to render the point, default true
   * @return {Point}                      a Point object
   */
  static fromCoordinate(coordinate, id=null) {
    return new Point(coordinate.lon, coordinate.lat, coordinate.height, id);
  };

  static fromCartesian(cartesian) {
    const coordinate = Coordinate.fromCartesian(cartesian)
    return new Point(coordinate.lon, coordinate.lat, coordinate.height)
  }

}

export default Point;
