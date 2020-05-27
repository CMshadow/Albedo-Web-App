import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Description } from './elements/Description';
import { OptimalCard } from './elements/OptimalCard';
import { Equipments } from './elements/Equipments';
import { getProject, globalOptTiltAzimuth } from './service';
import { setProjectData } from '../../store/action/index';

const rowGutter = [12, 12]


const Dashboard = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const projectID = history.location.pathname.split('/').slice(-1)[0]
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(true)
  const [optLoading, setoptLoading] = useState(true)

  useEffect(() => {
    dispatch(getProject({projectID: projectID}))
    .then(res => {
      dispatch(setProjectData(res))
      setloading(false)
      if (!res.optTilt || !res.optAzimuth || !res.optPOA) {
        dispatch(globalOptTiltAzimuth({projectID: projectID}))
        .then(optSpec => {
          dispatch(setProjectData(optSpec))
          setoptLoading(false)
        })
      } else {
        setoptLoading(false)
      }
    })
  }, [dispatch, projectID])

  return (
    <div>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Description loading={loading} {...projectData} />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <OptimalCard loading={loading || optLoading} {...projectData} />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Equipments loading={loading} {...projectData}/>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
