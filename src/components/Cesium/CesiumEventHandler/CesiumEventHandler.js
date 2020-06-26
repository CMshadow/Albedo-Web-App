import React from 'react';
import { ScreenSpaceEventHandler } from 'resium';

import LeftClickHandler from './IndividualEventHandler/LeftClick';
// import LeftClickShiftHandler from './IndividualEventHandler/LeftClickShift';
// import LeftDownHandler from './IndividualEventHandler/LeftDown';
import LeftUpHandler from './IndividualEventHandler/LeftUp';
import LeftUpShiftHandler from './IndividualEventHandler/LeftUpShift'
import RightClickHandler from './IndividualEventHandler/RightClick';
import MouseMoveHandler from './IndividualEventHandler/MouseMove';
import MouseMoveShiftHandler from './IndividualEventHandler/MouseMoveShift';
// import KeyPressHandler from './IndividualEventHandler/KeyPress';

export const CesiumEventHandlers = () => {
  return (
    <ScreenSpaceEventHandler useDefault>
       <LeftClickHandler />
       {/* <LeftClickShiftHandler /> */}
       {/* <LeftDownHandler /> */}
       <LeftUpHandler />
       <LeftUpShiftHandler />
       <RightClickHandler />
       <MouseMoveHandler />
       <MouseMoveShiftHandler />
       {/* <KeyPressHandler /> */}
    </ScreenSpaceEventHandler>
  );
};