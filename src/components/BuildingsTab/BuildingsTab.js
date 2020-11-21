import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tabs, Button, Space } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import * as styles from './BuildingsTab.module.scss'
import { BuildingModal } from './BuildingModal'
import { SingleBuildingTab } from './SingleBuildingTab'
import { deleteBuilding } from '../../store/action/index'

const { TabPane } = Tabs

export const BuildingsTab = ({ buildings, ...props }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const projectType = useSelector(state => state.project.projectType)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)
  const [activeKey, setactiveKey] = useState(buildings.length > 0 ? buildings[0].buildingID : null)

  const deleteBuildingTab = targetKey => {
    dispatch(deleteBuilding(targetKey))
  }

  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      const keyIndex = buildings.indexOf(buildings.find(b => b.buildingID === targetKey))
      const newActiveKeyIndex = keyIndex === buildings.length - 1 ? keyIndex - 1 : keyIndex + 1
      setactiveKey(buildings.length === 1 ? null : buildings[newActiveKeyIndex].buildingID)
      deleteBuildingTab(targetKey)
    }
  }

  const addBuildingButton = (
    <Button className={styles.addBuilding} onClick={() => setshowModal(true)} type='dashed'>
      {projectType === 'domestic' ? t('project.add.building') : t('project.add.unit')}
    </Button>
  )

  return (
    <>
      <Tabs
        type='editable-card'
        size='large'
        activeKey={activeKey}
        tabBarGutter={12}
        hideAdd={true}
        tabBarExtraContent={addBuildingButton}
        onEdit={onEdit}
        onChange={key => setactiveKey(key)}
      >
        {buildings.map(building => (
          <TabPane
            tab={
              <Space size='middle'>
                {building.buildingName}
                <SettingOutlined
                  className={styles.icon}
                  onClick={() => {
                    seteditRecord(building)
                    setshowModal(true)
                  }}
                />
              </Space>
            }
            key={building.buildingID}
          >
            <SingleBuildingTab building={building} />
          </TabPane>
        ))}
      </Tabs>
      <BuildingModal
        showModal={showModal}
        setshowModal={setshowModal}
        editRecord={editRecord}
        seteditRecord={seteditRecord}
        setactiveKey={setactiveKey}
      />
    </>
  )
}
