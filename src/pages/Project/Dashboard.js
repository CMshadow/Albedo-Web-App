import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd';
import { Description } from './elements/Description';
import { OptimalCard } from './elements/OptimalCard';

const mockdata = {
  projectTitle: '金风科技',
  projectType: 'commercial',
  projectAddress: '北京市亦庄金风科技',
  projectCreator: '老王',
  createdAt: '2020-05-24',
  updatedAt: '2020-05-24',
}


const Dashboard = (props) => {
  const [loading, setloading] = useState(false)

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Description loading={loading} {...mockdata} />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col span={24}>
        <OptimalCard loading={loading} {...mockdata} />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
