import React, { useState, useEffect } from 'react'
import { Descriptions, Card, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { wh2other } from '../../../utils/unitConverter';

const Item = Descriptions.Item

export const OptimalCard = ({loading, ...values}) => {
  const { t } = useTranslation()

  return (
    <Card loading={loading} title={t('project.optimal.title')}>
      {/* <Skeleton loading={loading} paragraph={{rows: 2}} title={false} active> */}
      <Descriptions column={3}>
        <Item label={t('project.optimal.optTilt')}>
          {values.optTilt}°
        </Item>
        <Item label={t('project.optimal.optAzi')}>
          {values.optAzimuth}°
        </Item>
        <Item label={t('project.optimal.optPOA')}>
          {wh2other(values.optPOA).value.toFixed(1)}
          {wh2other(values.optPOA).unit}/㎡
        </Item>
      </Descriptions>
      {/* </Skeleton> */}
    </Card>
  )
}
