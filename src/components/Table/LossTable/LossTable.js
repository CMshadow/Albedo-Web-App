import React from 'react'
import { Table, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { LossTiltAzimuthDescription } from '../../Descriptions/LossTiltAzimuthDescription'
const Title = Typography.Title
const Text = Typography.Text

export const LossTable = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = [
    {
      key: 1,
      loss: t('lossTable.p_loss_mismatch_withinstring'),
      unit: '%',
      value: (reportData[buildingID].p_loss_mismatch_withinstring * 100).toFixed(2),
    },
    {
      key: 2,
      loss: t('lossTable.p_loss_mismatch_betweenstrings'),
      unit: '%',
      value: (reportData[buildingID].p_loss_mismatch_betweenstrings * 100).toFixed(2),
    },
    {
      key: 3,
      loss: t('lossTable.p_loss_soiling'),
      unit: '%',
      value: (reportData[buildingID].p_loss_soiling * 100).toFixed(2),
    },
    {
      key: 4,
      loss: t('lossTable.p_loss_eff_irradiance'),
      unit: '%',
      value: (reportData[buildingID].p_loss_eff_irradiance * 100).toFixed(2),
    },
    {
      key: 5,
      loss: t('lossTable.p_loss_temperature'),
      unit: '%',
      value: (reportData[buildingID].p_loss_temperature * 100).toFixed(2),
    },
    {
      key: 6,
      loss: t('lossTable.p_loss_far_side_shading'),
      unit: '%',
      value: (reportData[buildingID].p_loss_far_side_shading * 100).toFixed(2),
    },
    {
      key: 7,
      loss: t('lossTable.p_loss_degradation'),
      unit: '%',
      value: (reportData[buildingID].p_loss_degradation * 100).toFixed(2),
    },
    {
      key: 8,
      loss: t('lossTable.p_loss_degradation_rest'),
      unit: '%',
      value: (reportData[buildingID].p_loss_degradation_rest * 100).toFixed(2),
    },
    {
      key: 9,
      loss: t('lossTable.p_loss_connection'),
      unit: '%',
      value: (reportData[buildingID].p_loss_connection * 100).toFixed(2),
    },
    {
      key: 10,
      loss: t('lossTable.p_loss_conversion'),
      unit: '%',
      value: (reportData[buildingID].p_loss_conversion * 100).toFixed(2),
    },
    {
      key: 11,
      loss: t('lossTable.p_loss_transformer'),
      unit: '%',
      value: (reportData[buildingID].p_loss_transformer * 100).toFixed(2),
    },
    {
      key: 12,
      loss: t('lossTable.p_loss_dc_wiring'),
      unit: '%',
      value: (reportData[buildingID].p_loss_dc_wiring * 100).toFixed(2),
    },
    {
      key: 13,
      loss: t('lossTable.p_loss_ac_wiring'),
      unit: '%',
      value: (reportData[buildingID].p_loss_ac_wiring * 100).toFixed(2),
    },
    {
      key: 14,
      loss: t('lossTable.p_loss_combibox_wiring'),
      unit: '%',
      value: (reportData[buildingID].p_loss_combibox_wiring * 100).toFixed(2),
    },
    {
      key: 15,
      loss: t('lossTable.p_loss_transformer_wiring'),
      unit: '%',
      value: (reportData[buildingID].p_loss_transformer_wiring * 100).toFixed(2),
    },
    {
      key: 16,
      loss: t('lossTable.p_loss_availability'),
      unit: '%',
      value: (reportData[buildingID].p_loss_availability * 100).toFixed(2),
    },
    {
      key: 17,
      loss: <Text strong>{t('lossTable.p_loss_system')}</Text>,
      unit: <Text strong>{'%'}</Text>,
      value: <Text strong>{(reportData[buildingID].p_loss_system * 100).toFixed(2)}</Text>,
    },
    {
      key: 18,
      loss: <Text strong>{t('lossTable.system_efficiency')}</Text>,
      unit: <Text strong>{'%'}</Text>,
      value: <Text strong>{(reportData[buildingID].system_efficiency * 100).toFixed(2)}</Text>,
    },
  ]

  const columns = [
    {
      key: 0,
      dataIndex: 'key',
      align: 'center',
    },
    {
      key: 1,
      dataIndex: 'loss',
      align: 'center',
    },
    {
      key: 2,
      dataIndex: 'unit',
      align: 'center',
    },
    {
      key: 3,
      dataIndex: 'value',
      align: 'center',
    },
  ]

  const genHeader = () => <LossTiltAzimuthDescription buildingID={buildingID} />

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('lossTable.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Table
        bordered
        showHeader={false}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size='middle'
        title={genHeader}
      />
    </Card>
  )
}
