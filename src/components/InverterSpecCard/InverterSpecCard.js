import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Divider, Button, Collapse } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import * as styles from './InverterSpecCard.module.scss';
const { Panel } = Collapse;

const mainSpan = {sm: 14, md: 18, lg: 21, xl: 22}
const toolbarSpan = {sm: 10, md: 6, lg: 3, xl: 2}

export const InverterSpecCard = ({buildingID, specIndex, inverterIndex, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [editing, setediting] = useState(true)

  useEffect(() => {
    if (props.panels_per_string !== null) setediting(false)
  }, [props.panels_per_string])

  return (
    <Card className={styles.card} bodyStyle={{padding: '0px'}}>
      <div className={styles.content}>
        {
          editing ?
          <EditForm buildingID={buildingID} specIndex={specIndex} setediting={setediting}/> :
          <SpecView buildingID={buildingID} specIndex={specIndex} />
        }
      </div>
    </Card>
  )
}
