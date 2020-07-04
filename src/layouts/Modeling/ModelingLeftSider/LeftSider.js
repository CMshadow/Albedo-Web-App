import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Layout, Button, Card, Divider } from 'antd';
import { useSelector } from 'react-redux'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { UndoRedoSave } from '../../../components/ModelingLeftSider/UndoRedoSave/UndoRedoSave'
import { BuildingList } from '../../../components/ModelingLeftSider/BuildingList/BuildingList'
import { CreateBuilding } from '../../../components/ModelingLeftSider/CreateBuilding/CreateBuilding'
import { Drawing } from '../../../components/ModelingLeftSider/Drawing/Drawing'
import { DrawingTest } from '../../../components/ModelingLeftSider/DrawingTest/DrawingTest'
import * as modelingUITypes from '../../../store/action/modeling/modelingUITypes'
import * as styles from './LeftSider.module.scss';

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
  content = <DrawingTest />

  return (
    <Layout className={styles.outerLayout}>
      <Sider
        className={styles.leftSider}
        width={325}
        collapsedWidth={0}
        collapsible
        trigger={null}
        collapsed={siderCollapse}
      >
        <Layout className = {styles.upperPart}>
          {
            siderCollapse ?
            null :
            <Card
              className={styles.wrapperCard} title={title} bordered={false}
              bodyStyle={{padding: '0px'}} headStyle={{textAlign: 'center'}}
            >
              <Divider style={{marginTop: 0}}/>
              {content}
            </Card>
          }
        </Layout>
        <Layout className = {styles.lowerPart}>
          {siderCollapse ? null : <UndoRedoSave />}
        </Layout>
      </Sider>
      <Button
        style={{
          backgroundColor: siderCollapse ? '#1f1f1f' : '#f9f9f9',
          borderColor: siderCollapse ? '#1f1f1f' : '#f9f9f9',
        }}
        className={styles.collapseButton}
        icon={siderCollapse ? <RightOutlined style={{color: 'white'}}/> : <LeftOutlined/>}
        shape='circle'
        size='small'
        onClick={() => toggle()}
      />
    </Layout>
  );
}

export default LeftSider;
