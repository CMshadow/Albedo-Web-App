import React from 'react'
import { useSelector } from 'react-redux'
import { Descriptions, Card } from 'antd';
import { useTranslation } from 'react-i18next';

const Item = Descriptions.Item

export const Description = ({loading}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)

  return (
    <Card loading={loading}>
      <Descriptions title={projectData.projectTitle} column={2}>
        <Item label={t('project.descriptions.projectCreator')}>
          {projectData.projectCreator}
        </Item>
        <Item label={t('project.descriptions.projectType')}>
          {t(`project.type.${projectData.projectType}`)}
        </Item>
        <Item label={t('project.descriptions.createdAt')}>
          {new Date(projectData.createdAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.updatedAt')}>
          {new Date(projectData.updatedAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.projectAddress')} span={2}>
          {projectData.projectAddress}
        </Item>
      </Descriptions>
    </Card>
  )
}
