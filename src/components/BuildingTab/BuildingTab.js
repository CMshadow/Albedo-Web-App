import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Button, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import * as styles from './BuildingTab.module.scss';
import { BuildingModal } from '../../components/BuildingModal/BuildingModal'
import { deleteBuilding, addPVSpec, addCombibox } from '../../store/action/index'
import { PVSpecCard } from '../../components/SpecCard/PVSpecCard/PVSpecCard'
import { CombinerBoxSpecCard } from '../../components/SpecCard/CombinerBoxSpecCard/CombinerBoxSpecCard'

const { TabPane } = Tabs

export const BuildingTab = ({buildings, ...props}) => {
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
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab={t('project.spec.sub-array')} key="1">
                {building.data.map((spec, specIndex) => (
                  <PVSpecCard
                    buildingID={building.buildingID}
                    specIndex={specIndex}
                    key={specIndex}
                    {...spec.pv_panel_parameters}
                  />
                ))}
                <Button
                  className={styles.addSpec}
                  loading={loading}
                  block
                  type="dashed"
                  onClick={() => {
                    setloading(true)
                      setTimeout(() => {
                        addSpec(building.buildingID)
                        setloading(false)
                      }, 500)
                  }}
                >
                  {t('project.add.spec.prefix')}
                  {building.buildingName}
                  {t('project.add.spec')}
                </Button>
              </TabPane>
              {
                projectType === 'domestic' ? null :
                <TabPane tab={t('project.spec.combiner_box')} key="2">
                  {
                    building.combibox.map((combibox, combiboxIndex) => 
                      <CombinerBoxSpecCard 
                        buildingID={building.buildingID}
                        combiboxIndex={combiboxIndex}
                        key={combiboxIndex}
                        editingCombibox={editingCombibox}
                        seteditingCombibox={seteditingCombibox}
                        {...combibox}
                      />
                    )
                  }
                  <Button
                    className={styles.addSpecCombibox}
                    loading={loading}
                    disabled={editingCombibox !== null}
                    block
                    type="dashed"
                    onClick={() => {
                      setloading(true)
                      setTimeout(() => {
                        seteditingCombibox(building.combibox.length)
                        addCB(building.buildingID)
                        setloading(false)
                      }, 500)
                    }}
                  >
                    {t('project.add.combibox')}
                  </Button>
                </TabPane>
              }
            </Tabs>
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
