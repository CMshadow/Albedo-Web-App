import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Form, InputNumber, Collapse } from 'antd'
import * as styles from './MonthlyAlbedoModel.module.scss'
const FormItem = Form.Item
const { Panel } = Collapse

const rowGutter = { xs: [8, 12], sm: [16, 12] }

export const MonthlyAlbedoModel = () => {
  const { t } = useTranslation()

  return (
    <Collapse bordered={false}>
      <Panel className={styles.collapsePanel} header={t('report.paramsForm.monthly_albedo.help')} forceRender>
        {new Array(6)
          .fill(0)
          .map((_, index) => index)
          .map(season => (
            <Row gutter={rowGutter} key={`season-${season}`}>
              {new Array(2)
                .fill(0)
                .map((_, index) => season * 2 + index + 1)
                .map(month => (
                  <Col span={12} key={`month-${month}`}>
                    <FormItem
                      name={`monthly_albedo-${month}`}
                      label={t(`sunPosition.month.${month}`)}
                      rules={[{ required: true }]}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      <InputNumber min={0} max={1} step={0.05} />
                    </FormItem>
                  </Col>
                ))}
            </Row>
          ))}
      </Panel>
    </Collapse>
  )
}
