import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Row, Button } from 'antd';
import { UnlockOutlined, LockOutlined } from '@ant-design/icons'
import { disableRotate, enableRotate } from '../../../store/action/index'


const LockMap = () => {
  const dispatch = useDispatch()
  const enableRotateStatus = useSelector(state => state.cesium.enableRotate)

  const toggleRotate = () => {
    if (enableRotateStatus) {
      dispatch(disableRotate())
    } else {
      dispatch(enableRotate())
    }
  };

  return (
    <Row style={{top:'20px'}}>
      <Tooltip
        placement='bottomRight'
        title={
          enableRotateStatus ?
          'Lock Map' :
          'Unlock Map'
        }
      >
        <Button
          type={
            enableRotateStatus ?
            'primary' :
            'danger'
          }
          shape='circle'
          icon={
            enableRotateStatus ?
            <UnlockOutlined/> :
            <LockOutlined/>
          }
          size='large'
          onClick={toggleRotate}
        />
      </Tooltip>
    </Row>
  );
};

export default LockMap
