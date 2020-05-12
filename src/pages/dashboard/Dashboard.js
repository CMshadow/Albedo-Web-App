import React from 'react'
import { connect } from 'react-redux';

const Dashboard = (props) => {
  console.log(props.cognitoUser)
  return (
    <div>hello</div>
  )
}

const mapStateToProps = state => {
  return {
    cognitoUser: state.auth.cognitoUser
  }
}

export default connect(mapStateToProps)(Dashboard)
