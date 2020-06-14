import React, { useEffect, useState } from 'react'
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next'
import { CashFlowChart } from './CashFlowChart'
import { ACPowerChart } from './ACPowerChart'
import { LossChart } from './LossChart'
import { SystemEfficiencyChart } from './SystemEfficiencyChart'
import { InvestmentChart } from './InvestmentChart'
import { GainChart } from './GainChart'
import * as styles from './Charts.module.scss'
const Title = Typography.Title

export const Charts = ({ buildingID }) => {
  const { t } = useTranslation()

  return (
    <>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('cashflowChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <CashFlowChart buildingID={buildingID}/>
      </Card>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('acPowerChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <ACPowerChart buildingID={buildingID}/>
      </Card>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('lossChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <LossChart buildingID={buildingID}/>
      </Card>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('systemEfficiencyChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <SystemEfficiencyChart buildingID={buildingID}/>
      </Card>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('investmentChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <InvestmentChart buildingID={buildingID}/>
      </Card>
      <Card
        title={
          <Title className={styles.text} level={4}>
            {t('gainChart.title')}
          </Title>
        }
        bordered={false}
        hoverable
      >
        <GainChart buildingID={buildingID}/>
      </Card>
    </>
  )
}
