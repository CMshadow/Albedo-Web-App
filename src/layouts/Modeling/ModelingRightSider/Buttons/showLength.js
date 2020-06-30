import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Row, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRuler as rulerSolid } from '@fortawesome/pro-solid-svg-icons'
import { faRuler as rulerLight } from '@fortawesome/pro-light-svg-icons'
import { setShowLength } from '../../../../store/action/index'


const ShowLength = () => {
  const dispatch = useDispatch()
  const showLengthStatus = useSelector(state => state.cesium.showLength)

  const toggle = () => {
    if (showLengthStatus) {
      dispatch(setShowLength(false))
    } else {
      dispatch(setShowLength(true))
    }
  };

  return (
    <Row style={{top:'20px'}}>
      <Tooltip
        placement='left'
        title={
          showLengthStatus ?
          'Hide Shape Length' :
          'Show Shape Length'
        }
      >
        <Button
          type={
            showLengthStatus ?
            'primary' :
            'danger'
          }
          shape='circle'
          icon={
            showLengthStatus ?
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

export default ShowLength
