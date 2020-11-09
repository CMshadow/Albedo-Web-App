import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Divider, Button, Collapse } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { InverterSpecCard } from '../InverterSpecCard/InverterSpecCard'
import { addInverterSpec, deleteSubAry } from '../../../store/action/index'
import * as styles from './PVSpecCard.module.scss';

const { Panel } = Collapse;

const mainSpan = {sm: 14, md: 18, lg: 21, xl: 22}
const toolbarSpan = {sm: 10, md: 6, lg: 3, xl: 2}

export const PVSpecCard = ({id, buildingID, specIndex, collapseActive, setcollapseActive, ...props}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [editing, setediting] = useState(props.tilt_angle === null)
  const [editingInv, seteditingInv] = useState(null)
  const [loading, setloading] = useState(false)
  const [deleteLoading, setdeleteLoading] = useState(false)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const invsSpec = buildings[buildingIndex].data[specIndex].inverter_wiring

  const addSpec = () => {
    dispatch(addInverterSpec({buildingID, specIndex}))
  }

  const collapseOnchange = (openKeys) => {
    const newcollapseActive = [...collapseActive]
    if (openKeys.length > 0) {
      newcollapseActive[specIndex] = true
    } else {
      newcollapseActive[specIndex] = false
    }
    setcollapseActive(newcollapseActive)
  }

  return (
    <Card id={id} className={styles.card} bodyStyle={{padding: '0px'}} loading={deleteLoading}>
      <Row justify='center'>
        <Col {...mainSpan}>
          <div className={styles.content}>
            {
              editing ?
              <EditForm buildingID={buildingID} specIndex={specIndex} setediting={setediting}/> :
              <SpecView buildingID={buildingID} specIndex={specIndex} />
            }
          </div>
        </Col>
        <Col {...toolbarSpan} flex="auto">
          <Row align='middle' className={styles.toolbar}>
            <Button
              disabled={editing || editingInv !== null}
              type='link'
              shape="circle"
              icon={
                <EditTwoTone 
                  twoToneColor={editing || editingInv !== null ? '#bfbfbf' : '#1890ff'}
                />
              }
              onClick={() => setediting(true)}
            />
            <Divider className={styles.divider}/>
            <Button
              type='link'
              shape="circle"
              disabled={editingInv !== null}
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setdeleteLoading(true)
                setediting(false)
                setTimeout(() => {
                  setdeleteLoading(false)
                  const newcollapseActive = [...collapseActive]
                  newcollapseActive.splice(specIndex, 1)
                  setcollapseActive(newcollapseActive)
                  dispatch(deleteSubAry({buildingID, specIndex}))
                }, 500)
              }}
            />
          </Row>
        </Col>
      </Row>
      {/* <Divider className={styles.sectionBreak}/> */}
      <Row gutter={12} justify='center'>
        <Col span={24}>
          {
            editing ? null :
            <Collapse bordered={false} className={styles.collapse} onChange={collapseOnchange}>
              <Panel
                className={styles.collapsePanel}
                header={<h4 style={{margin: 0}}>{t('project.spec.inverters')}</h4>}
                key="1"
              >
                {
                  invsSpec.map((invSpec, invIndex) =>
                    <InverterSpecCard
                      id={`inv${specIndex}${invSpec.inverter_serial_number}`}
                      key={invIndex}
                      buildingID={buildingID}
                      specIndex={specIndex}
                      invIndex={invIndex}
                      disabled={editing}
                      editingInv={editingInv}
                      onClickEdit={invIndex => seteditingInv(invIndex)}
                      onClickEndEdit={() => seteditingInv(null)}
                      {...invSpec}
                    />
                  )
                }
                <Button
                  className={styles.addSpec}
                  disabled={editing || editingInv !== null}
                  loading={loading}
                  block
                  type="dashed"
                  onClick={() => {
                    seteditingInv(invsSpec.length)
                    setloading(true)
                    setTimeout(() => {
                      addSpec()
                      setloading(false)
                      document.getElementById(`inv${specIndex}${invsSpec.length}`).scrollIntoView()
                    }, 500);
                  }}
                >
                  {t('project.add.inverterSpec')}
                </Button>
              </Panel>
            </Collapse>
          }
        </Col>
      </Row>
    </Card>
  )
}
