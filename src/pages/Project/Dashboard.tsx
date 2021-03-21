import React from 'react'
import GlobalAlert from '../../components/GlobalAlert/GlobalAlert'
import { Row, Col } from 'antd'
import { useSelector } from 'react-redux'
import { Description } from './elements/Description'
import { OptimalCard } from './elements/OptimalCard'
import { Equipments } from './elements/Equipments'
import { RootState } from '../../@types'

const rowGutter: [number, number] = [12, 12]

const Dashboard: React.FC = () => {
  const projectData = useSelector((state: RootState) => state.project)

  return (
    <div>
      <GlobalAlert />
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Description loading={!projectData || !projectData.projectTitle} />
        </Col>
      </Row>
      <OptimalCard
        loading={!projectData || !projectData.optTilt || !(projectData.optTilt >= 0)}
        {...projectData}
      />
      <Row gutter={rowGutter}>
        <Col span={24}>
          <Equipments
            loading={!projectData || !projectData.projectTitle || !projectData.tiltAzimuthPOA}
            {...projectData}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
