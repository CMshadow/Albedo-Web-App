import React from 'react'
import { useSelector } from 'react-redux'
import { Descriptions, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
const Title = Typography.Title

const Item = Descriptions.Item

export const Description = ({ loading }) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)

  const title = (
    <Title style={{ textAlign: 'center' }} level={3}>
      {projectData.projectTitle}
    </Title>
  )

  return (
    <Card loading={loading}>
      <Descriptions title={title} column={2}>
        <Item label={t('project.descriptions.projectCreator')}>{projectData.projectCreator}</Item>
        <Item label={t('project.descriptions.projectType')}>{t(`project.type.${projectData.projectType}`)}</Item>
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
