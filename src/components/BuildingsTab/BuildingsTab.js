import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Button, Space, Row, Col, Anchor } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import * as styles from './BuildingsTab.module.scss';
import { BuildingModal } from './BuildingModal'
import { SingleBuildingTab } from './SingleBuildingTab'
import { deleteBuilding, addPVSpec, addCombibox } from '../../store/action/index'
import { PVSpecCard } from '../SpecCard/PVSpecCard/PVSpecCard'
import { CombinerBoxSpecCard } from '../SpecCard/CombinerBoxSpecCard/CombinerBoxSpecCard'

const { TabPane } = Tabs
const { Link } = Anchor
const rowGutter = [12, 12]

export const BuildingsTab = ({buildings, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const projectType = useSelector(state => state.project.projectType)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)
  const [editingCombibox, seteditingCombibox] = useState(null)
  const [loading, setloading] = useState(false)

  const deleteBuildingTab = (targetKey) => {
    dispatch(deleteBuilding(targetKey))
  }

  const onEdit = (targetKey, action) => {
    if (action === 'remove') deleteBuildingTab(targetKey)
  }

  const addSpec = (buildingID) => {
    dispatch(addPVSpec(buildingID))
  }

  const addCB = (buildingID) => {
    dispatch(addCombibox(buildingID))
  }

  const addBuildingButton = (
    <Button
      className={styles.addBuilding}
      onClick={() => setshowModal(true)}
      type="dashed"
    >
      {
        projectType === 'domestic' ? 
        t('project.add.building') :
        t('project.add.unit')
      }
    </Button>
  )

  return (
    <>
      <Tabs
        type="editable-card"
        size='large'
        tabBarGutter={12}
        hideAdd={true}
        tabBarExtraContent={addBuildingButton}
        onEdit={onEdit}
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
                    setshowModal(true)}
                  }
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
      />
    </>
  )
}
