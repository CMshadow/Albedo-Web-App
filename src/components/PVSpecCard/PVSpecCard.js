import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Divider, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import * as styles from './PVSpecCard.module.scss';


export const PVSpecCard = ({buildingID, specIndex, editing, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <Card className={styles.card} bodyStyle={{padding: '0px'}}>
      <Row gutter={12} justify='center'>
        <Col span={22}>
          <div className={styles.content}>
            {
              editing ?
              <EditForm buildingID={buildingID} specIndex={specIndex} /> :
              <SpecView buildingID={buildingID} specIndex={specIndex} />
            }
          </div>
        </Col>
        <Col span={2} flex="auto">
          <Row align='middle' className={styles.toolbar}>
            <Button shape="circle" icon={<EditOutlined />} />
            <Divider className={styles.divider}/>
            <Button shape="circle" icon={<DeleteOutlined />} />
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
