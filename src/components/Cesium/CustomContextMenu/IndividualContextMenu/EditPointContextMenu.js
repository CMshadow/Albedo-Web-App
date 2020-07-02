import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { ContextMenu, MenuItem } from "react-contextmenu";
import { Card, Row, Col, Input, Button, Typography } from 'antd'
import * as actions from '../../../../store/action/index'
import * as styles from './ContextMenu.module.scss'
const Text = Typography.Text

const EditPointContextMenu = ({hoverId}) => {
  const dispatch = useDispatch()
  const drwProps = useSelector(state => state.undoable.present.drwStat.props)
  const point = useSelector(state => state.undoable.present.point[hoverId]).entity
  const pointH = point ? point.height : null

  return (
    <ContextMenu
      id="cesium_context_menu"
      hideOnLeave={false}
      preventHideOnContextMenu
      preventHideOnResize
      preventHideOnScroll
    >
      <Card bodyStyle={{padding: 10, width: '200px'}}>
        {
          drwProps.pointHeight ?
          <MenuItem preventClose>
            <Row gutter={[8, 8]} align='middle'>
              <Col span={8}><Text strong>Height</Text></Col>
              <Col span={16}>
                <Input
                  type='number'
                  addonAfter='m'
                  size='middle'
                  defaultValue={pointH}
                  onChange={e =>
                    dispatch(actions.setPointHeight(hoverId, Number(e.target.value)))
                  }
                />
              </Col>
            </Row>
          </MenuItem> :
          null
        }
        <MenuItem
          onClick={() => {
            dispatch(actions.deletePoint(hoverId))
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
              Delete Point
            </Button>
          </Row>
        </MenuItem>
      </Card>
    </ContextMenu>
  );
}

export default EditPointContextMenu;
