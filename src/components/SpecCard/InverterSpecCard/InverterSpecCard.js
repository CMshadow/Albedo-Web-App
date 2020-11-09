import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteInverterSpec } from '../../../store/action/index'
import { inverterLimit } from '../../../pages/Project/service'
import * as styles from './InverterSpecCard.module.scss'

export const InverterSpecCard = ({
  id,
  buildingID,
  specIndex,
  invIndex,
  disabled,
  editingInv,
  onClickEdit,
  onClickEndEdit,
  ...props
}) => {
  const dispatch = useDispatch()
  const { projectID } = useParams()
  const [editing, setediting] = useState(props.panels_per_string === null)
  const [invLimits, setinvLimits] = useState({})
  const [loading, setloading] = useState(false)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const specData = buildings[buildingIndex].data[specIndex]

  const pvData = useSelector(state => state.pv.data).concat(useSelector(state => state.pv.officialData))
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const selPV = pvData.find(pv => pv.pvID === specData.pv_panel_parameters.pv_model.pvID)
  const invSpec = specData.inverter_wiring[invIndex]
  const selInv = invSpec.inverter_model.inverterID
    ? inverterData.find(inv => inv.inverterID === invSpec.inverter_model.inverterID)
    : null

  const disableEdit = editing || disabled || (editingInv !== null && editingInv !== invIndex)
  const disableDelete = disabled || (editingInv !== null && editingInv !== invIndex)

  useEffect(() => {
    // 如果选择了逆变器计算该逆变器配合使用组件的可选接线方案
    if (selInv) {
      setloading(true)
      dispatch(
        inverterLimit({
          projectID,
          invID: selInv.inverterID,
          invUserID: selInv.userID,
          pvID: selPV.pvID,
          pvUserID: selPV.userID,
        })
      )
        .then(res => {
          setloading(false)
          const invLimits = {}
          res.inverterPlans.forEach(limit =>
            limit.pps in invLimits ? invLimits[limit.pps].push(limit.spi) : (invLimits[limit.pps] = [limit.spi])
          )
          Object.keys(invLimits).forEach(key => invLimits[key].sort())
          setinvLimits(invLimits)
        })
        .catch(e => setloading(false))
    }
  }, [dispatch, projectID, selInv, selPV.pvID, selPV.userID])

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{ padding: '0px' }}
      loading={loading}
      hoverable
      actions={[
        <Button
          disabled={disableEdit}
          type="link"
          shape="circle"
          icon={<EditTwoTone twoToneColor={disableEdit ? '#bfbfbf' : '#1890ff'} />}
          onClick={() => {
            onClickEdit(invIndex)
            setediting(true)
          }}
        />,
        <Button
          disabled={disableDelete}
          type="link"
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            onClickEndEdit()
            setloading(true)
            setediting(false)
            setTimeout(() => {
              setloading(false)
              dispatch(deleteInverterSpec({ buildingID, specIndex, invIndex }))
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {editing ? (
          <EditForm
            initInvLimits={invLimits}
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
            setediting={setediting}
            disabled={disabled}
            onClickEndEdit={onClickEndEdit}
          />
        ) : (
          <SpecView initInvLimits={invLimits} buildingID={buildingID} specIndex={specIndex} invIndex={invIndex} />
        )}
      </div>
    </Card>
  )
}
