import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Description } from './elements/Description';
import { OptimalCard } from './elements/OptimalCard';
import { Equipments } from './elements/Equipments';
import { getProject, globalOptTiltAzimuth } from './service';
import { getPV } from '../PVTable/service'
import { getInverter } from '../InverterTable/service'
import { setProjectData, setPVData, setPVActiveData, setInverterData, setInverterActiveData } from '../../store/action/index';

const rowGutter = [12, 12]


const Dashboard = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const projectID = history.location.pathname.split('/')[2]
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(true)
  const [optLoading, setoptLoading] = useState(true)

  useEffect(() => {
    dispatch(getPV())
    .then(res => {
      dispatch(setPVData(res))
      dispatch(setPVActiveData(res))
      dispatch(getInverter())
      .then(res => {
        dispatch(setInverterData(res))
        dispatch(setInverterActiveData(res))
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
      })
    })
  }, [dispatch, projectID])

  return (
    <div>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Description loading={loading}/>
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
