import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import * as styles from './Equipments.module.scss';
import { BuildingTab } from '../../../components/BuildingTab/BuildingTab'
import { BuildingNameModal } from '../../../components/BuildingNameModal/BuildingNameModal'


export const Equipments = ({loading, ...values}) => {
  const { t } = useTranslation();
  const [showModal, setshowModal] = useState(false)

  return (
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
      <BuildingNameModal showModal={showModal} setshowModal={setshowModal}/>
    </Card>
  )
}
