import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deletePowercabinet } from '../../../store/action/index'
import * as styles from './PowerCabinetSpecCard.module.scss';

export const PowerCabinetSpecCard = ({id, powercabinetIndex, editingPowercabinet, seteditingPowercabinet, ...props}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(true)
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (props.powercabinet_name !== null) setediting(false)
  }, [props.powercabinet_name])

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{padding: 0}}
      loading={loading}
      actions={[
        <Button
          disabled={editing || editingPowercabinet !== null}
          type='link'
          shape="circle"
          icon={
            <EditTwoTone 
              twoToneColor={editing || editingPowercabinet !== null ? '#bfbfbf' : '#1890ff'}
            />
          }
          onClick={() => {
            setediting(true)
            seteditingPowercabinet(powercabinetIndex)
          }}
        />,
        <Button
          type='link'
          shape="circle"
          danger
          icon={
            <DeleteTwoTone 
              twoToneColor={
                editingPowercabinet !== null && editingPowercabinet !== powercabinetIndex ? 
                '#bfbfbf' : '#f5222d'
              }
            />
          }
          disabled={editingPowercabinet !== null && editingPowercabinet !== powercabinetIndex}
          onClick={() => {
            setloading(true)
            setTimeout(() => {
              setloading(false)
              seteditingPowercabinet(null)
              dispatch(deletePowercabinet(editingPowercabinet))
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {
          editing ?
          <EditForm
            powercabinetIndex={powercabinetIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditingPowercabinet(null)
            }}
          /> :
          <SpecView
          powercabinetIndex={powercabinetIndex}
          />
        }
      </div>
    </Card>
  )
}
