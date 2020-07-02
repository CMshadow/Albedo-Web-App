import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Menu, Layout, Row } from 'antd';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHomeAlt, faDrawPolygon, faFolderOpen, faCube, faSolarPanel, faNetworkWired } from '@fortawesome/pro-light-svg-icons'
import * as modelingUITypes from '../../../store/action/modeling/modelingUITypes'
import * as styles from './FixedSider.module.scss';

const { Sider } = Layout;

const keys = [
  ['building', faFolderOpen], ['CreateBuilding', faHomeAlt], ['2d', faDrawPolygon],
  ['3d', faCube], ['pv', faSolarPanel], ['inverter', faNetworkWired]
]

const LeftSider = (props) => {
  const { t } = useTranslation()
  const ui = useSelector(state => state.undoable.present.ui.modelingUI)

  return (
    <Sider width={75} className={styles.fixedSider}>
      <Menu theme='dark' selectedKeys={"building"} mode="vertical">
        {
          keys.map(([key, icon]) =>
            <Menu.Item
              style={{height: '75px'}}
              key={key}
              icon={<Row style={{height: '75px'}} align='middle' justify='center'><FontAwesomeIcon icon={icon} size='2x'/></Row>}
            />
          )
        }

      </Menu>
    </Sider>
  );
}

export default LeftSider;
