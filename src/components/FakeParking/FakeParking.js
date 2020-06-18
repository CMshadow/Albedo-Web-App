import React from 'react'
import { Typography } from 'antd'
import * as styles from './FakeParking.module.scss'
const Title = Typography.Title
const Text = Typography.Text

const FakeParking = () => {
  return (
    <div style={{backgroundColor: '#398145', minHeight: '100vh', padding: '24px 20px 20px'}}>
      <h1 className={styles.h1}>ACTIVE SMART DECAL</h1>
    </div>
  )
}

export default FakeParking
