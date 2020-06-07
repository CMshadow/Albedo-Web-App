import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import * as styles from './Equipments.module.scss';
import { BuildingTab } from '../../../components/BuildingTab/BuildingTab'
import { BuildingModal } from '../../../components/BuildingModal/BuildingModal'


export const Equipments = ({loading, ...values}) => {
  const { t } = useTranslation();
  const [showModal, setshowModal] = useState(false)
  const [editRecord, seteditRecord] = useState(null)

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
      <BuildingModal
        showModal={showModal}
        setshowModal={setshowModal}
        editRecord={editRecord}
        seteditRecord={seteditRecord}
      />
    </Card>
  )
}
