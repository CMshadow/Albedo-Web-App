import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteInverterSpec } from '../../../store/action/index'
import { inverterLimit } from '../../../services'
import styles from './InverterSpecCard.module.scss'
import { InvLimits, Params, RootState } from '../../../@types'

type InverterSpecCardProps = {
  id: string
  buildingID: string
  specIndex: number
  invIndex: number
  disabled: boolean
  editingInv: number | undefined
  onClickEdit: (index: number) => void
  onClickEndEdit: () => void
  panels_per_string: number | null
}

export const InverterSpecCard: React.FC<InverterSpecCardProps> = ({
  id,
  buildingID,
  specIndex,
  invIndex,
  disabled,
  editingInv,
  onClickEdit,
  onClickEndEdit,
  panels_per_string,
}) => {
  const dispatch = useDispatch()
  const { projectID } = useParams<Params>()
  const [editing, setediting] = useState(panels_per_string === null)
  const [invLimits, setinvLimits] = useState<InvLimits>({})
  const [loading, setloading] = useState(false)

  const pvData = useSelector((state: RootState) => state.pv.data).concat(
    useSelector((state: RootState) => state.pv.officialData)
  )
  const inverterData = useSelector((state: RootState) => state.inverter.data).concat(
    useSelector((state: RootState) => state.inverter.officialData)
  )

  const buildings = useSelector((state: RootState) => state.project?.buildings)
  const buildingIndex = (buildings || []).map(building => building.buildingID).indexOf(buildingID)
  const specData = (buildings || [])[buildingIndex].data[specIndex]

  const selPV = pvData.find(pv => pv.pvID === specData.pv_panel_parameters.pv_model.pvID)
  const invSpec = specData.inverter_wiring[invIndex]
  const selInv = invSpec.inverter_model.inverterID
    ? inverterData.find(inv => inv.inverterID === invSpec.inverter_model.inverterID)
    : null

  const disableEdit = editing || disabled || (editingInv !== undefined && editingInv !== invIndex)
  const disableDelete = disabled || (editingInv !== undefined && editingInv !== invIndex)

  useEffect(() => {
    // 如果选择了逆变器计算该逆变器配合使用组件的可选接线方案
    if (selInv && selPV) {
      setloading(true)
      inverterLimit({
        projectID,
        invID: selInv.inverterID,
        invUserID: selInv.userID,
        pvID: selPV.pvID,
        pvUserID: selPV.userID,
      })
        .then(res => {
          setloading(false)
          const invLimits: InvLimits = {}
          res.inverterPlans.forEach(limit =>
            limit.pps in invLimits
              ? invLimits[limit.pps].push(limit.spi)
              : (invLimits[limit.pps] = [limit.spi])
          )
          Object.keys(invLimits).forEach(key => invLimits[key].sort())
          setinvLimits(invLimits)
        })
        .catch(() => setloading(false))
    }
  }, [projectID, selInv, selPV])

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{ padding: '0px' }}
      loading={loading}
      hoverable
      actions={[
        <Button
          key='edit'
          disabled={disableEdit}
          type='link'
          shape='circle'
          icon={<EditTwoTone twoToneColor={disableEdit ? '#bfbfbf' : '#1890ff'} />}
          onClick={() => {
            onClickEdit(invIndex)
            setediting(true)
          }}
        />,
        <Button
          key='delete'
          disabled={disableDelete}
          type='link'
          shape='circle'
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
          <SpecView
            initInvLimits={invLimits}
            buildingID={buildingID}
            specIndex={specIndex}
            invIndex={invIndex}
          />
        )}
      </div>
    </Card>
  )
}
