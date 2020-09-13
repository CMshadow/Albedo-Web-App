import React, { useState } from 'react';
import { Card, Button, Spin, Typography } from 'antd';
import { useSelector } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as styles from './Equipments.module.scss';
import { BuildingTab } from '../../../components/BuildingTab/BuildingTab'
import { BuildingModal } from '../../../components/BuildingModal/BuildingModal'
const Title = Typography.Title

export const Equipments = ({loading, ...values}) => {
  const { t } = useTranslation();
  const projectType = useSelector(state => state.project.projectType)
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

  const addBuildingText = () => 
    projectType === 'domestic' ? t('project.add.building') : t('project.add.unit')

  return (
    <Spin
      spinning={loading}
      tip={<Title level={4}>{t('project.loading.analyze')}</Title>}
      indicator={<LoadingOutlined className={styles.loadingIcon}/>}
    >
      <Card loading={loading} title='配置光伏系统' headStyle={{textAlign: 'center'}}>
        {
          !values.buildings || values.buildings.length === 0 ?
          <Button
            className={styles.addSpec}
            block
            type="dashed"
            onClick={() => setshowModal(true)}
          >
            {addBuildingText()}
          </Button> :
          <BuildingTab {...values}/>
        }
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
