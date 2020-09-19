import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteInverterSpec } from '../../../store/action/index'
import { inverterLimit } from '../../../pages/Project/service'
import * as styles from './InverterSpecCard.module.scss';

export const InverterSpecCard = ({buildingID, specIndex, invIndex, disabled, ...props}) => {
  const dispatch = useDispatch()
  const { projectID } = useParams()
  const [editing, setediting] = useState(true)
  const [invLimits, setinvLimits] = useState({})
  const [loading, setloading] = useState(false)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const specData = buildings[buildingIndex].data[specIndex]

  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const selPV = pvData.find(pv => pv.pvID === specData.pv_panel_parameters.pv_model.pvID)
  const invSpec = specData.inverter_wiring[invIndex]
  const selInv = invSpec.inverter_model.inverterID ? 
    inverterData.find(inv => inv.inverterID === invSpec.inverter_model.inverterID) :
    null

  useEffect(() => {
    if (props.panels_per_string !== null) setediting(false)
  }, [props.panels_per_string])

  useEffect(() => {
    // 如果选择了逆变器计算该逆变器配合使用组件的可选接线方案
    if (selInv) {
      setloading(true)
      dispatch(inverterLimit({
        projectID, 
        invID: selInv.inverterID, 
        invUserID: selInv.userID,
        pvID: selPV.pvID,
        pvUserID: selPV.userID
      })).then(res => {
        setloading(false)
        const invLimits = {}
        res.forEach(limit => 
          limit.spi in invLimits ? 
          invLimits[limit.spi].push(limit.pps) :
          invLimits[limit.spi] = [limit.pps]
        )
        Object.keys(invLimits).forEach(key => invLimits[key].sort())
        setinvLimits(invLimits)
      }).catch(e => setloading(false))
    }
  }, [dispatch, projectID, selInv, selPV.pvID, selPV.userID])

  return (
    <Card
      className={styles.card}
      bodyStyle={{padding: '0px'}}
      loading={loading}
      hoverable
      actions={[
        <Button
          disabled={editing || disabled}
          type='link'
          shape="circle"
          icon={<EditTwoTone twoToneColor={editing || disabled ? '#bfbfbf' : '#1890ff'}/>}
          onClick={() => setediting(true)}
        />,
        <Button
          disabled={disabled}
          type='link'
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setloading(true)
            setTimeout(() => {
              dispatch(deleteInverterSpec({buildingID, specIndex, invIndex}))
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
            initInvLimits={invLimits}
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
            setediting={setediting}
            disabled={disabled}
          /> :
          <SpecView
            initInvLimits={invLimits}
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
          />
        }
      </div>
    </Card>
  )
}
