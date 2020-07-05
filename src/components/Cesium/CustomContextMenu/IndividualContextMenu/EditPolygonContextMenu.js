import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Card, Row, Col, Input, Button, Typography } from 'antd'
import * as actions from '../../../../store/action/index'
import * as styles from './ContextMenu.module.scss'
const Text = Typography.Text

const EditPolygonContextMenu = ({hoverId}) => {
  const dispatch = useDispatch()
  const drwProps = useSelector(state => state.undoable.present.drwStat.props)
  const polygon = useSelector(state => state.undoable.present.polygon[hoverId]).entity
  const polygonH = polygon ? polygon.height : null

  return (
    <ContextMenu
      id="cesium_context_menu"
      hideOnLeave={false}
      preventHideOnContextMenu
      preventHideOnResize
      preventHideOnScroll
    >
      <Card bodyStyle={{padding: 10, width: '200px'}}>
        <MenuItem preventClose>
          <Row gutter={[8, 8]} align='middle'>
            <Col span={8}><Text strong>Height</Text></Col>
            <Col span={16}>
              <Input
                type='number'
                addonAfter='m'
                size='middle'
                defaultValue={polygonH}
                onChange={e =>
                  dispatch(actions.polygonSetHeight(hoverId, Number(e.target.value)))
                }
              />
            </Col>
          </Row>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(actions.polygonDelete(hoverId))
            dispatch(actions.releaseHoverObj())
          }}
        >
          <Row gutter={[8, 8]} align='middle'>
            <Button
              className={styles.button}
              type='primary'
              size='small'
              danger
            >
              Delete Polygon
            </Button>
          </Row>
        </MenuItem>
      </Card>
    </ContextMenu>
  );
}

export default EditPolygonContextMenu;
