import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Layout, Button, Card, Divider } from 'antd';
import { useSelector } from 'react-redux'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import * as styles from './LeftSider.module.scss';
import { UndoRedoSave } from '../../../components/ModelingLeftSider/UndoRedoSave/UndoRedoSave'
import { BuildingList } from '../../../components/ModelingLeftSider/BuildingList/BuildingList'
import { CreateBuilding } from '../../../components/ModelingLeftSider/CreateBuilding/CreateBuilding'
import { Drawing } from '../../../components/ModelingLeftSider/Drawing/Drawing'
import { DrawingTest } from '../../../components/ModelingLeftSider/DrawingTest/DrawingTest'
import * as modelingUITypes from '../../../store/action/modeling/modelingUITypes'

const { Sider } = Layout;

const LeftSider = (props) => {
  const { t } = useTranslation()
  const [siderCollapse, setsiderCollapse] = useState(false)
  const ui = useSelector(state => state.undoable.present.ui.modelingUI)
  const toggle = () => setsiderCollapse(!siderCollapse)


  let title
  let content
  switch (ui) {
    case modelingUITypes.CREATE_BUILDING:
      title = t('modeling.CREATE_BUILDING')
      content = <CreateBuilding />
      break
    case modelingUITypes.DRAWING:
      title = t('modeling.DRAWING')
      content = <Drawing />
      break
    case modelingUITypes.IDLE:
    default:
      title = t('modeling.IDLE')
      content = <BuildingList />
  }

  return (
    <Layout className={styles.outerLayout}>
      <Sider
        className={styles.leftSider}
        width={325}
        collapsedWidth={50}
        collapsible
        trigger={null}
        collapsed={siderCollapse}
      >
        <Layout className = {styles.upperPart}>
          <Card
            className={styles.wrapperCard} title={title} bordered={false}
            bodyStyle={{padding: '0px'}} headStyle={{textAlign: 'center'}}
          >
            <Divider style={{marginTop: 0}}/>
            {siderCollapse ? null : content}
          </Card>
        </Layout>
        <Layout className = {styles.lowerPart}>
          {siderCollapse ? null : <UndoRedoSave />}
        </Layout>
      </Sider>
      <Button
        className={styles.collapseButton}
        icon={siderCollapse ? <RightOutlined/> : <LeftOutlined/>}
        shape='circle'
        size='small'
        onClick={() => toggle()}
      />
    </Layout>
  );
}

export default LeftSider;
