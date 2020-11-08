

const withAuth = (func: Function) => {
  const username = 'aaa'
  const jwtToken = 'bbb'
  return func(username, jwtToken)
}

export default withAuth