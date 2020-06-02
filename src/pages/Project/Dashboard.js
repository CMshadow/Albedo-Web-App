import React, { useEffect } from 'react'
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getPV } from '../PVTable/service'
import { setPVData, setPVActiveData, setInverterData, setInverterActiveData } from '../../store/action/index';
import { getInverter } from '../InverterTable/service'
import { Description } from './elements/Description';
import { OptimalCard } from './elements/OptimalCard';
import { Equipments } from './elements/Equipments';

const rowGutter = [12, 12]


const Dashboard = () => {
  const dispatch = useDispatch()
  const projectData = useSelector(state => state.project)

  useEffect(() => {
    dispatch(getPV())
    .then(res => {
      dispatch(setPVData(res))
      dispatch(setPVActiveData(res))
      dispatch(getInverter())
      .then(res => {
        dispatch(setInverterData(res))
        dispatch(setInverterActiveData(res))
      })
    })
  }, [dispatch])

  return (
    <div>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Description loading={!projectData.projectTitle}/>
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <OptimalCard loading={!projectData.optTilt} {...projectData} />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Equipments loading={!projectData.projectTitle} {...projectData}/>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
