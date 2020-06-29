import React, { Component } from 'react';
import { connect } from 'react-redux';

class KeyPressHandler extends Component {

  state = {
    moveForward : false,
    moveBackward : false,
    moveUp : false,
    moveDown : false,
    moveLeft : false,
    moveRight : false
  }

  moveCamera = () => {
    const ellipsoid = this.props.viewer.scene.globe.ellipsoid;
    const camera = this.props.viewer.camera;
    const cameraHeight =
      ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 10000.0;
    if (this.state.moveUp) camera.moveUp(moveRate);
    if (this.state.moveDown) camera.moveDown(moveRate);
    if (this.state.moveLeft) camera.moveLeft(moveRate);
    if (this.state.moveRight) camera.moveRight(moveRate);
    if (this.state.moveForward) camera.moveForward(moveRate);
    if (this.state.moveBackward) camera.moveBackward(moveRate);
  }

  recordKeyDownEvent = (event) => {
    switch (event.keyCode) {
      // esc
      case 27:
        return;

      case 'W'.charCodeAt(0):
        return this.setState({moveUp: true});
      case 'S'.charCodeAt(0):
        return this.setState({moveDown: true});
      case 'A'.charCodeAt(0):
        return this.setState({moveLeft: true});
      case 'D'.charCodeAt(0):
        return this.setState({moveRight: true});
      case 'Q'.charCodeAt(0):
        return this.setState({moveForward: true});
      case 'E'.charCodeAt(0):
        return this.setState({moveBackward: true});
      default:
        return;
    }
  }

  recordKeyUpFunction = (event) => {
    switch (event.keyCode) {
      case 'W'.charCodeAt(0):
        return this.setState({moveUp: false});
      case 'S'.charCodeAt(0):
        return this.setState({moveDown: false});
      case 'A'.charCodeAt(0):
        return this.setState({moveLeft: false});
      case 'D'.charCodeAt(0):
        return this.setState({moveRight: false});
      case 'Q'.charCodeAt(0):
        return this.setState({moveForward: false});
      case 'E'.charCodeAt(0):
        return this.setState({moveBackward: false});
      default:
        return;
    }
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.recordKeyDownEvent);
    document.addEventListener("keyup", this.recordKeyUpFunction);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.recordKeyDownEvent);
    document.removeEventListener("keyup", this.recordKeyUpFunction);
  };

  render () {
    this.props.viewer.clock.onTick.addEventListener(clock => this.moveCamera());
    return (
      <div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    viewer:
      state.cesium.viewer,
  };
};


export default connect(mapStateToProps)(KeyPressHandler);
