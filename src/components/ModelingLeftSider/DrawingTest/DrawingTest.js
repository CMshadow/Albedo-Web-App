import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd';
import * as actions from '../../../store/action/index'
import * as objTypes from '../../../store/action/drawing/objTypes'

export const DrawingTest = () => {
  const dispatch = useDispatch()
  const drawStatus = useSelector(state => state.undoable.present.drwStat.status)

  return (
    <>
      <Button loading={drawStatus === objTypes.POINT} onClick={() => dispatch(actions.setDrwStatPoint())}>Draw Point</Button>
      <Button loading={drawStatus === objTypes.LINE} onClick={() => dispatch(actions.setDrwStatLine())}>Draw line</Button>
      <Button loading={drawStatus === objTypes.POLYLINE} onClick={() => dispatch(actions.setDrwStatPolyline())}>Draw Polyline</Button>
      <Button loading={drawStatus === objTypes.POLYGON} onClick={() => dispatch(actions.setDrwStatPolygon())}>Draw Polygon</Button>
      <Button loading={drawStatus === objTypes.CIRCLE} onClick={() => dispatch(actions.setDrwStatCircle())}>Draw Circle</Button>
      <Button loading={drawStatus === objTypes.SECTOR} onClick={() => dispatch(actions.setDrwStatSector())}>Draw Sector</Button>
    </>
  )
}
