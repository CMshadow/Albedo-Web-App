import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CreateProjectModal } from './Modal';
import * as styles from './ProjectTable.module.scss';

const ProjectTable = (props) => {
  const { t } = useTranslation();
  const [loading, setloading] = useState(false)
  const [showModal, setshowModal] = useState(false)

  return (
    <div>
      <Button
        className={styles.leftBut}
        type="primary"
        onClick={() => setshowModal(true)}
      >
        {t('project.create-project')}
      </Button>
      <Button
        className={styles.rightBut}
        shape="circle"
        icon={<SyncOutlined spin={loading}/>}
      />
      <CreateProjectModal showModal={showModal} setshowModal={setshowModal} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    cognitoUser: state.auth.cognitoUser
  }
}

export default connect(mapStateToProps)(ProjectTable)
