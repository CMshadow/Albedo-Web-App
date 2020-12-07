import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tabs, Button, Row, Col, Anchor } from 'antd'
import styles from './BuildingsTab.module.scss'
import { addSubAry, addCombibox } from '../../store/action'
import { PVSpecCard } from '../SpecCard/PVSpecCard/PVSpecCard'
import { CombinerBoxSpecCard } from '../SpecCard/CombinerBoxSpecCard/CombinerBoxSpecCard'
import { Building, RootState } from '../../@types'

const { TabPane } = Tabs
const { Link } = Anchor
const rowGutter: [number, number] = [12, 12]

type SingleBuildingTabProps = { building: Building }

export const SingleBuildingTab: React.FC<SingleBuildingTabProps> = ({ building }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const projectType = useSelector((state: RootState) => state.project?.projectType)
  const [editingCombibox, seteditingCombibox] = useState<number | undefined>()
  const [loading, setloading] = useState(false)
  const [collapseActive, setcollapseActive] = useState<boolean[]>(
    new Array(building.data.length).fill(0).map(() => false)
  )

  const addSpec = (buildingID: string) => {
    dispatch(addSubAry(buildingID))
  }

  const addCB = (buildingID: string) => {
    dispatch(addCombibox(buildingID))
  }

  return (
    <Tabs defaultActiveKey='1' centered>
      <TabPane tab={t('project.spec.sub-array')} key='1'>
        <Row gutter={rowGutter}>
          <Col span={21}>
            {building.data.map((spec, specIndex) => (
              <PVSpecCard
                id={`sub${specIndex}`}
                buildingID={building.buildingID}
                specIndex={specIndex}
                key={specIndex}
                collapseActive={collapseActive}
                setcollapseActive={setcollapseActive}
                {...spec.pv_panel_parameters}
              />
            ))}
            <Button
              className={styles.addSpec}
              loading={loading}
              block
              type='dashed'
              onClick={() => {
                setloading(true)
                setTimeout(() => {
                  addSpec(building.buildingID)
                  setloading(false)
                  const newcollapseActive = [...collapseActive]
                  newcollapseActive.push(false)
                  setcollapseActive(newcollapseActive)
                  document.getElementById(`sub${building.data.length - 1}`)?.scrollIntoView(false)
                }, 500)
              }}
            >
              {t('project.add.spec')}
            </Button>
          </Col>
          <Col span={3}>
            <Anchor offsetTop={70}>
              {building.data.map((spec, specIndex) => (
                <Link
                  key={`anchor${specIndex}`}
                  href={`#sub${specIndex}`}
                  title={`S${specIndex + 1}`}
                >
                  {collapseActive[specIndex]
                    ? spec.inverter_wiring.map(invSpec => (
                        <Link
                          key={`anchor${specIndex}${invSpec.inverter_serial_number}`}
                          href={`#inv${specIndex}${invSpec.inverter_serial_number}`}
                          title={`S${specIndex + 1}-${invSpec.inverter_serial_number}`}
                        />
                      ))
                    : null}
                </Link>
              ))}
            </Anchor>
          </Col>
        </Row>
      </TabPane>
      {projectType === 'domestic' ? null : (
        <TabPane tab={t('project.spec.combiner_box')} key='2'>
          <Row gutter={rowGutter}>
            <Col span={22}>
              {building.combibox.map((combibox, combiboxIndex) => (
                <CombinerBoxSpecCard
                  id={`combibox${combiboxIndex}`}
                  buildingID={building.buildingID}
                  combiboxIndex={combiboxIndex}
                  key={combiboxIndex}
                  editingCombibox={editingCombibox}
                  seteditingCombibox={seteditingCombibox}
                  {...combibox}
                />
              ))}
              <Button
                className={styles.addSpecCombibox}
                loading={loading}
                disabled={editingCombibox !== undefined}
                block
                type='dashed'
                onClick={() => {
                  setloading(true)
                  setTimeout(() => {
                    seteditingCombibox(building.combibox.length)
                    addCB(building.buildingID)
                    setloading(false)

                    document
                      .getElementById(`combibox${building.combibox.length - 1}`)
                      ?.scrollIntoView()
                  }, 500)
                }}
              >
                {t('project.add.combibox')}
              </Button>
            </Col>
            <Col span={2}>
              <Anchor offsetTop={70}>
                {building.combibox.map((combibox, combiboxIndex) => (
                  <Link
                    key={`anchor${combiboxIndex}`}
                    href={`#combibox${combiboxIndex}`}
                    title={`C${combiboxIndex + 1}`}
                  />
                ))}
              </Anchor>
            </Col>
          </Row>
        </TabPane>
      )}
    </Tabs>
  )
}
