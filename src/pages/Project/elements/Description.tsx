import React from 'react'
import { useSelector } from 'react-redux'
import { Descriptions, Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../@types'
const { Title } = Typography

const { Item } = Descriptions

type DescriptionProps = { loading: boolean }

export const Description: React.FC<DescriptionProps> = ({ loading }) => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)

  const title = (
    <Title style={{ textAlign: 'center' }} level={3}>
      {projectData && projectData.projectTitle}
    </Title>
  )

  return (
    <Card loading={loading}>
      <Descriptions title={title} column={2}>
        <Item label={t('project.descriptions.projectCreator')}>
          {projectData && projectData.projectCreator}
        </Item>
        <Item label={t('project.descriptions.projectType')}>
          {t(`project.type.${projectData && projectData.projectType}`)}
        </Item>
        <Item label={t('project.descriptions.createdAt')}>
          {projectData && new Date(projectData.createdAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.updatedAt')}>
          {projectData && new Date(projectData.updatedAt * 1000).toLocaleString()}
        </Item>
        <Item label={t('project.descriptions.projectAddress')} span={2}>
          {projectData && projectData.projectAddress}
        </Item>
      </Descriptions>
    </Card>
  )
}
