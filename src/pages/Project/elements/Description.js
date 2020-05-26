import React, { useState, useEffect } from 'react'
import { Skeleton, Descriptions, Card } from 'antd';
import { useTranslation } from 'react-i18next';

const Item = Descriptions.Item

export const Description = ({loading, ...values}) => {
  const { t } = useTranslation()

  return (
    <Card loading={loading}>
      <Descriptions title={values.projectTitle} column={2}>
        <Item label={t('project.descriptions.projectCreator')}>
          {values.projectCreator}
        </Item>
        <Item label={t('project.descriptions.projectType')}>
          {t(`project.type.${values.projectType}`)}
        </Item>
        <Item label={t('project.descriptions.createdAt')}>
          {new Date(values.createdAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.updatedAt')}>
          {new Date(values.updatedAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.projectAddress')} span={2}>
          {values.projectAddress}
        </Item>
      </Descriptions>
    </Card>
  )
}
