import React, { useState } from 'react';
import { Card, Button, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import * as styles from './Equipments.module.scss';
import { BuildingTab } from '../../../components/BuildingTab/BuildingTab'
import { BuildingModal } from '../../../components/BuildingModal/BuildingModal'
const Title = Typography.Title

export const Equipments = ({loading, ...values}) => {
  const { t } = useTranslation();
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

  return (
    <Spin
      spinning={loading}
      tip={<Title level={4}>{t('project.loading.analyze')}</Title>}
      indicator={<LoadingOutlined className={styles.loadingIcon}/>}
    >
      <Card loading={loading}>
        {
          !values.buildings || values.buildings.length === 0 ?
          <Button
            className={styles.addSpec}
            block
            type="dashed"
            onClick={() => setshowModal(true)}
          >
            {t('project.add.building')}
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
