import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Row, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerTriangle as rulerSolid } from '@fortawesome/pro-solid-svg-icons'
import { faRulerTriangle as rulerLight } from '@fortawesome/pro-light-svg-icons'
import { setShowAngle } from '../../../../store/action/index'


const ShowAngle = () => {
  const dispatch = useDispatch()
  const showAngleStatus = useSelector(state => state.cesium.showAngle)

  const toggle = () => {
    if (showAngleStatus) {
      dispatch(setShowAngle(false))
    } else {
      dispatch(setShowAngle(true))
    }
  };

  return (
    <Row style={{top:'20px'}}>
      <Tooltip
        placement='left'
        title={
          showAngleStatus ?
          'Hide Shape Angle' :
          'Show Shape Angle'
        }
      >
        <Button
          type={
            showAngleStatus ?
            'primary' :
            'danger'
          }
          shape='circle'
          icon={
            showAngleStatus ?
            <FontAwesomeIcon icon={rulerSolid} /> :
            <FontAwesomeIcon icon={rulerLight} />
          }
          size='large'
          onClick={toggle}
        />
      </Tooltip>
    </Row>
  );
};

export default ShowAngle
