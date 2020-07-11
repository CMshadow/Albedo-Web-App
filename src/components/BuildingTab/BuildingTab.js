import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Button, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import * as styles from './BuildingTab.module.scss';
import { BuildingModal } from '../../components/BuildingModal/BuildingModal'
import { deleteBuilding, addPVSpec } from '../../store/action/index'
import { PVSpecCard } from '../../components/PVSpecCard/PVSpecCard'

const { TabPane } = Tabs;

export const BuildingTab = ({buildings, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

  const deleteBuildingTab = (buildingID) => {
    dispatch(deleteBuilding(buildingID))
  }

  const onEdit = (buildingID, action) => {
    if (action === 'remove' && buildingID !== 'aggr') deleteBuildingTab(buildingID)
  }

  const addSpec = (buildingID) => {
    dispatch(addPVSpec(buildingID))
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
            <TabPane
              tab={
                <Space size='middle'>
                  {building.buildingName}
                  {
                    building.buildingID !== 'aggr' ?
                    <SettingOutlined
                      className={styles.icon}
                      onClick={() => {
                        seteditRecord(building)
                        setshowModal(true)}
                      }
                    /> :
                    null
                  }
                </Space>
              }
              key={building.buildingID}
            >
              {
                building.data.map((spec, specIndex) => (
                  <PVSpecCard
                    editing={
                      spec.pv_panel_parameters.tilt_angle === null ?
                      true : false
                    }
                    buildingID={building.buildingID}
                    specIndex={specIndex}
                    key={specIndex}
                    {...spec.pv_panel_parameters}
                  />
                ))
              }
              <Button
                className={styles.addSpec}
                block
                type="dashed"
                onClick={() => addSpec(building.buildingID)}
                disabled={building.buildingID === 'aggr'}
              >
                {t('project.add.spec.prefix')}
                {building.buildingName}
                {t('project.add.spec')}
              </Button>
            </TabPane>
          ))
        }
      </Tabs>
      <BuildingModal
        showModal={showModal}
        setshowModal={setshowModal}
        editRecord={editRecord}
        seteditRecord={seteditRecord}
      />
    </div>
  )
}
