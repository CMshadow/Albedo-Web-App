import React from 'react'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { Description } from './elements/Description';
import { OptimalCard } from './elements/OptimalCard';
import { Equipments } from './elements/Equipments';

const rowGutter = [12, 12]


const Dashboard = () => {
  const projectData = useSelector(state => state.project)

  return (
    <div>
      <GlobalAlert/>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Description loading={!projectData.projectTitle}/>
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <OptimalCard loading={!(projectData.optTilt >= 0)} {...projectData} />
        </Col>
      </Row>
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Equipments loading={!projectData.projectTitle || !projectData.tiltAzimuthPOA} {...projectData}/>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
