import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Card, Button } from 'antd';
import * as styles from './BuildingTab.module.scss';
import { BuildingNameModal } from '../../components/BuildingNameModal/BuildingNameModal'
import { deleteBuilding } from '../../store/action/index'

const { TabPane } = Tabs;

export const BuildingTab = ({buildings, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [showModal, setshowModal] = useState(false)

  const deleteBuildingTab = (targetKey) => {
    dispatch(deleteBuilding(targetKey))
  }

  const onEdit = (targetKey, action) => {
    if (action === 'remove') deleteBuildingTab(targetKey)
  }

  const addBuildingButton = (
    <Button
      className={styles.addBuilding}
      onClick={() => setshowModal(true)}
      type="dashed"
    >
      {t('project.add.building')}
    </Button>
  )

  return (
    <div>
      <Tabs
        type="editable-card"
        size='large'
        tabBarGutter={12}
        hideAdd={true}
        tabBarExtraContent={addBuildingButton}
        onEdit={onEdit}
      >
        {
          buildings.map(building => (
            <TabPane tab={building.buildingName} key={building.buildingID}>
              <Button className={styles.addSpec} block type="dashed">
                {t('project.add.spec')}
              </Button>
            </TabPane>
          ))
        }
      </Tabs>
      <BuildingNameModal showModal={showModal} setshowModal={setshowModal}/>
    </div>
  )
}
