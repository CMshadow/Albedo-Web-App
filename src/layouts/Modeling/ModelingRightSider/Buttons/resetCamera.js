import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Row, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-regular-svg-icons'
import { resetCamera } from '../../../../store/action/index'


const ResetCamera = () => {
  const dispatch = useDispatch()

  return (
    <Row style={{top:'20px'}}>
      <Tooltip
        placement='left'
        title={'Reset camera'}
      >
        <Button
          shape='circle'
          style={{backgroundColor: '#ffd666', borderColor: '#ffd666'}}
          icon={
            <FontAwesomeIcon icon={faCamera} />
          }
          size='large'
          onClick={() => dispatch(resetCamera())}
        />
      </Tooltip>
    </Row>
  );
};

export default ResetCamera
