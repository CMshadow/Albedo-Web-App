import React, { useState, useEffect } from 'react'
import { Skeleton, Descriptions, Card } from 'antd';
import { useTranslation } from 'react-i18next';

const Item = Descriptions.Item

export const OptimalCard = ({loading, ...values}) => {
  const { t } = useTranslation()

  return (
    <Card loading={loading} title={t('project.optimal.title')}>
      <Descriptions column={2}>
        <Item label={t('project.optimal.optTilt')}>
          {values.optTilt}°
        </Item>
        <Item label={t('project.optimal.optAzi')}>
          {values.optAzi}°
        </Item>
      </Descriptions>
    </Card>
  )
}
