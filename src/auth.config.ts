const config = {
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: process.env.REACT_APP_AUTH_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,

    cookieStorage: {
      domain:
        process.env.NODE_ENV === 'development'
          ? 'localhost'
          : 'cos-website.ap-shanghai.myqcloud.com',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      path: '/',
      expires: 365,
    },
  },
}

export default config
