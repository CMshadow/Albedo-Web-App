import React, { useState, useEffect } from 'react'
import { Input, Button, Space, Slider, InputNumber, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import styles from './TabelColSearch.module.scss'
import { getMin, getMax } from '../../../utils/getObjectsMinMax'
import { FilterDropdownProps } from 'antd/lib/table/interface'

export const SearchString = <T extends Record<string, unknown>>(
  colKey: keyof T,
  renderType?: 'tag' | 'text'
) => {
  const { t } = useTranslation()
  const [searchedText, setsearchedText] = useState('')

  const handleSearch = (selectedKeys: React.Key[], confirm: () => void) => {
    confirm()
    setsearchedText(selectedKeys[0] ? selectedKeys[0].toString() : '')
  }

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters()
    setsearchedText('')
  }

  const renderTag = (children: React.ReactNode, theme?: string) => (
    <Tag color={theme}>{children}</Tag>
  )

  const renderText = (text: string) => (
    <Highlighter
      highlightClassName={styles.highlight}
      searchWords={[searchedText]}
      autoEscape={true}
      textToHighlight={text.toString()}
    />
  )

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div className={styles.searchBox}>
        <Input
          className={styles.input}
          placeholder={`${t('filter.search')} ${t(`table.${colKey}`)}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [''])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
        />
        <Space>
          <Button
            className={styles.button}
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size='small'
          >
            {t('filter.search')}
          </Button>
          <Button className={styles.button} onClick={() => handleReset(clearFilters)} size='small'>
            {t('filter.reset')}
          </Button>
        </Space>
      </div>
    ),
    render: (text: string, record: T) => {
      if ('projectID' in record && colKey === 'projectTitle') {
        return <Link to={`/project/${record.projectID}/dashboard`}>{renderText(text)}</Link>
      } else if ('theme' in record && renderType === 'tag') {
        return renderTag(text, record.theme as string)
      } else {
        return renderText(text)
      }
    },
  }
}

type SearchRangeProps<T> = {
  colKey: string
  data: T[]
}

export const SearchRange = <T extends Record<string, unknown>>(props: SearchRangeProps<T>) => {
  const { colKey, data } = props
  const { t } = useTranslation()
  const colMin = Math.floor(getMin(data, colKey))
  const colMax = Math.ceil(getMax(data, colKey))
  const [selectedVal, setselectedVal] = useState<[number, number]>([colMin, colMax])

  useEffect(() => {
    const colMin = Math.floor(getMin(data, colKey))
    const colMax = Math.ceil(getMax(data, colKey))
    setselectedVal([colMin, colMax])
  }, [colKey, data])

  return {
    filterDropdown: ({ confirm, clearFilters, setSelectedKeys }: FilterDropdownProps) => {
      return (
        <div className={styles.searchBox}>
          <Slider
            range
            min={colMin}
            max={colMax}
            onChange={values => {
              setSelectedKeys(values)
              setselectedVal(values)
            }}
            value={selectedVal}
          />
          <Row>
            <Space>
              <InputNumber
                className={styles.button}
                min={colMin}
                max={selectedVal[1]}
                size='small'
                value={selectedVal[0]}
                onChange={value => {
                  setSelectedKeys([Number(value), selectedVal[1]])
                  setselectedVal([Number(value), selectedVal[1]])
                }}
              />
              <InputNumber
                className={styles.button}
                min={selectedVal[0]}
                max={colMax}
                size='small'
                value={selectedVal[1]}
                onChange={value => {
                  setSelectedKeys([selectedVal[0], Number(value)])
                  setselectedVal([selectedVal[0], Number(value)])
                }}
              />
            </Space>
          </Row>
          <Row>
            <Space>
              <Button
                className={styles.button}
                type='primary'
                onClick={confirm}
                icon={<FilterOutlined />}
                size='small'
              >
                {t('filter.filter')}
              </Button>
              <Button className={styles.button} onClick={clearFilters} size='small'>
                {t('filter.reset')}
              </Button>
            </Space>
          </Row>
        </div>
      )
    },
    onFilter: (value: string | number | boolean, record: T) =>
      Number(record[colKey]) >= selectedVal[0] && Number(record[colKey]) <= selectedVal[1],
  }
}
