import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const KeyPressHandler = () => {
  const [moveForward, setmoveForward] = useState(false)
  const [moveBackward, setmoveBackward] = useState(false)
  const [moveUp, setmoveUp] = useState(false)
  const [moveDown, setmoveDown] = useState(false)
  const [moveLeft, setmoveLeft] = useState(false)
  const [moveRight, setmoveRight] = useState(false)
  const viewer = useSelector(state => state.cesium.viewer)

  const moveCamera = () => {
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const camera = viewer.camera;
    const cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height
    const moveRate = cameraHeight / 10000.0;
    if (moveUp) camera.moveUp(moveRate);
    if (moveDown) camera.moveDown(moveRate);
    if (moveLeft) camera.moveLeft(moveRate);
    if (moveRight) camera.moveRight(moveRate);
    if (moveForward) camera.moveForward(moveRate);
    if (moveBackward) camera.moveBackward(moveRate);
  }

  const recordKeyDownEvent = (event) => {
    switch (event.keyCode) {
      // esc
      case 27:
        return;

      case 'W'.charCodeAt(0):
        return setmoveUp(true)
      case 'S'.charCodeAt(0):
        return setmoveDown(true)
      case 'A'.charCodeAt(0):
        return setmoveLeft(true)
      case 'D'.charCodeAt(0):
        return setmoveRight(true)
      case 'Q'.charCodeAt(0):
        return setmoveForward(true)
      case 'E'.charCodeAt(0):
        return setmoveBackward(true)
      default:
        return;
    }
  }

  const recordKeyUpFunction = (event) => {
    switch (event.keyCode) {
      case 'W'.charCodeAt(0):
        return setmoveUp(false)
      case 'S'.charCodeAt(0):
        return setmoveDown(false)
      case 'A'.charCodeAt(0):
        return setmoveLeft(false)
      case 'D'.charCodeAt(0):
        return setmoveRight(false)
      case 'Q'.charCodeAt(0):
        return setmoveForward(false)
      case 'E'.charCodeAt(0):
        return setmoveBackward(false)
      default:
        return;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", recordKeyDownEvent);
    document.addEventListener("keyup", recordKeyUpFunction);

    return () => {
      document.removeEventListener("keydown", recordKeyDownEvent);
      document.removeEventListener("keyup", recordKeyUpFunction);
    }
  }, [])

  viewer.clock.onTick.addEventListener(clock => moveCamera());

  return (
    <div/>
  );
};

export default KeyPressHandler
