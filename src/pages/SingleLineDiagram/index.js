import React from 'react'
import { useSelector } from 'react-redux'
import SLDCN from './SingleLineDiagram_cn'
import SLDUS from './SingleLineDiagram_us'

const SLD = () => {
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  
  let SLD
  if (cognitoUser.attributes.locale === 'zh-CN') SLD = <SLDCN/>
  else SLD = <SLDUS/>

  return (
    <div>
      {SLD}
    </div>
  )
}

export default SLD