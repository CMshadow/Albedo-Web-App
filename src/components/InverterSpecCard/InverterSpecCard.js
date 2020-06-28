import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteInverterSpec } from '../../store/action/index'
import * as styles from './InverterSpecCard.module.scss';

export const InverterSpecCard = ({buildingID, specIndex, invIndex, ...props}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(true)

  useEffect(() => {
    if (props.panels_per_string !== null) setediting(false)
  }, [props.panels_per_string])

  return (
    <Card
      className={styles.card}
      bodyStyle={{padding: '0px'}}
      hoverable
      actions={[
        <Button
          disabled={editing}
          type='link'
          shape="circle"
          icon={<EditTwoTone />}
          onClick={() => setediting(true)}
        />,
        <Button
          type='link'
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            dispatch(deleteInverterSpec({buildingID, specIndex, invIndex}))
          }
        />,
      ]}
    >
      <div className={styles.content}>
        {
          editing ?
          <EditForm
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
            setediting={setediting}
          /> :
          <SpecView
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
          />
        }
      </div>
    </Card>
  )
}
