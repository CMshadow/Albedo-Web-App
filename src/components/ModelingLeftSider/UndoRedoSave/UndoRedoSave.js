import React from 'react';
import { Button } from 'antd';
import { Row, Divider } from 'antd'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons'
import { ActionCreators } from 'redux-undo';
import { useDispatch, useSelector } from 'react-redux';
import * as styles from './UndoRedoSave.module.scss'

export const UndoRedoSave = () => {
  const dispatch = useDispatch()
  const undoable = useSelector(state => state.undoable)

  return (
      <Row className={styles.row} align='middle' justify='center'>
        <Button
          className={styles.undoredo}
          type='link'
          icon={<UndoOutlined />}
          onClick={() => dispatch(ActionCreators.undo())}
          disabled={undoable.past && undoable.past.length > 0}
        >
          Undo
        </Button>
        <Divider className={styles.divider} type='vertical'/>
        <Button
          className={styles.save}
          type='link'
        >
          Save
        </Button>
        <Divider className={styles.divider} type='vertical'/>
        <Button
          className={styles.undoredo}
          type='link'
          icon={<RedoOutlined />}
          onClick={() => dispatch(ActionCreators.redo())}
          disabled={undoable.future && undoable.future.length > 0}
        >
          Redo
        </Button>
      </Row>
  );
};
