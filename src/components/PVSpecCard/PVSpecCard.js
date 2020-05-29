import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Divider, Button } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import * as styles from './PVSpecCard.module.scss';

const mainSpan = {sm: 14, md: 18, lg: 21, xl: 22}
const toolbarSpan = {sm: 10, md: 6, lg: 3, xl: 2}

export const PVSpecCard = ({buildingID, specIndex, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [editing, setediting] = useState(true)

  useEffect(() => {
    if (props.tilt_angle !== null) setediting(false)
  }, [props.tilt_angle])

  return (
    <Card className={styles.card} bodyStyle={{padding: '0px'}}>
      <Row gutter={12} justify='center'>
        <Col {...mainSpan}>
          <div className={styles.content}>
            {
              editing ?
              <EditForm buildingID={buildingID} specIndex={specIndex} setediting={setediting}/> :
              <SpecView buildingID={buildingID} specIndex={specIndex} />
            }
          </div>
        </Col>
        <Col {...toolbarSpan} flex="auto">
          <Row align='middle' className={styles.toolbar}>
            <Button
              disabled={editing}
              ghost
              type='link'
              shape="circle"
              icon={<EditTwoTone />}
              onClick={() => setediting(true)}
            />
            <Divider className={styles.divider}/>
            <Button
              disabled={editing}
              ghost
              type='link'
              shape="circle"
              danger icon={<DeleteOutlined />}
            />
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
