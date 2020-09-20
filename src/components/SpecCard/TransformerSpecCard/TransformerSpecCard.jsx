import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteTransformer } from '../../../store/action/index'
import * as styles from './TransformerSpecCard.module.scss';

export const TransformerSpecCard = ({transformerIndex, disabled, seteditTransformer, ...props}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(true)
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (props.transformer_name !== null) setediting(false)
  }, [props.transformer_name])

  return (
    <Card
      className={styles.card}
      bodyStyle={{padding: '0px'}}
      loading={loading}
      actions={[
        <Button
          disabled={editing || disabled}
          type='link'
          shape="circle"
          icon={<EditTwoTone twoToneColor={editing || disabled ? '#bfbfbf' : '#1890ff'}/>}
          onClick={() => {
            setediting(true)
            seteditTransformer(true)
          }}
        />,
        <Button
          type='link'
          shape="circle"
          danger
          icon={<DeleteTwoTone twoToneColor='#f5222d'/>}
          onClick={() => {
            setloading(true)
            setTimeout(() => {
              dispatch(deleteTransformer({transformerIndex}))
              setloading(false)
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {
          editing ?
          <EditForm
            transformerIndex={transformerIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditTransformer(false)
            }}
          /> :
          <SpecView
            transformerIndex={transformerIndex}
          />
        }
      </div>
    </Card>
  )
}
