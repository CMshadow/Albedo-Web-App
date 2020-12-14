import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tabs, Button, Space } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import styles from './BuildingsTab.module.scss'
import { BuildingModal } from './BuildingModal'
import { SingleBuildingTab } from './SingleBuildingTab'
import { deleteBuilding } from '../../store/action/index'
import { Building, RootState } from '../../@types'

const { TabPane } = Tabs

type BuildingsTabProps = { buildings: Building[] }

export const BuildingsTab: React.FC<BuildingsTabProps> = ({ buildings }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const projectType = useSelector((state: RootState) => state.project?.projectType)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState<Building | undefined>()
  const [activeKey, setactiveKey] = useState<string | undefined>(
    buildings.length > 0 ? buildings[0].buildingID : undefined
  )

  const deleteBuildingTab = (targetKey: string) => {
    dispatch(deleteBuilding(targetKey))
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
        onEdit={(targetKey, action) => {
          if (action === 'remove' && typeof targetKey === 'string') {
            const findBuilding = buildings.find(b => b.buildingID === targetKey)
            if (findBuilding) {
              const keyIndex = buildings.indexOf(findBuilding)
              const newActiveKeyIndex =
                keyIndex === buildings.length - 1 ? keyIndex - 1 : keyIndex + 1
              setactiveKey(
                buildings.length === 1 ? undefined : buildings[newActiveKeyIndex].buildingID
              )
              deleteBuildingTab(targetKey)
            }
          }
        }}
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
