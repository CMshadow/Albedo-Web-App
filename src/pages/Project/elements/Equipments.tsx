import React, { useState } from 'react'
import { Card, Button, Spin } from 'antd'
import { useSelector } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import styles from './Equipments.module.scss'
import { BuildingsTab } from '../../../components/BuildingsTab/BuildingsTab'
import { BuildingModal } from '../../../components/BuildingsTab/BuildingModal'
import { Building, Project, RootState } from '../../../@types'

type EquipmentsProps = Partial<Project> & { loading: boolean }

export const Equipments: React.FC<EquipmentsProps> = ({ loading, ...values }) => {
  const { t } = useTranslation()
  const projectType = useSelector((state: RootState) => state.project?.projectType)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState<Building | undefined>()

  const addBuildingText = () =>
    projectType === 'domestic' ? t('project.add.building') : t('project.add.unit')

  return (
    <Spin
      size='large'
      spinning={loading}
      tip={t('project.loading.analyze')}
      indicator={<LoadingOutlined />}
    >
      <Card
        loading={loading}
        title={t('project.dashboard.title')}
        headStyle={{ textAlign: 'center' }}
      >
        {!values.buildings || values.buildings.length === 0 ? (
          <Button className={styles.addSpec} block type='dashed' onClick={() => setshowModal(true)}>
            {addBuildingText()}
          </Button>
        ) : (
          <BuildingsTab buildings={values.buildings} />
        )}
        <BuildingModal
          showModal={showModal}
          setshowModal={setshowModal}
          editRecord={editRecord}
          seteditRecord={seteditRecord}
        />
      </Card>
    </Spin>
  )
}
