import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Row, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartNetwork as networkSolid } from '@fortawesome/pro-solid-svg-icons'
import { faChartNetwork as networkLight } from '@fortawesome/pro-light-svg-icons'
import { setShowVertex } from '../../../../store/action/index'


const ShowVertex = () => {
  const dispatch = useDispatch()
  const showVertexStatus = useSelector(state => state.cesium.showVertex)

  const toggle = () => {
    if (showVertexStatus) {
      dispatch(setShowVertex(false))
    } else {
      dispatch(setShowVertex(true))
    }
  };

  return (
    <Row style={{top:'20px'}}>
      <Tooltip
        placement='left'
        title={
          showVertexStatus ?
          'Hide All Points' :
          'Show All Points'
        }
      >
        <Button
          type={
            showVertexStatus ?
            'primary' :
            'danger'
          }
          shape='circle'
          icon={
            showVertexStatus ?
            <FontAwesomeIcon icon={networkSolid} /> :
            <FontAwesomeIcon icon={networkLight} />
          }
          size='large'
          onClick={toggle}
        />
      </Tooltip>
    </Row>
  );
};

export default ShowVertex
