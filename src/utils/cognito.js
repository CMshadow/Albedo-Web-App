import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
	UserPoolId: 'us-west-2_WLzviguZC', // Your user pool id here
	ClientId: '7vjd60cjtvqh51jo5pstqhr9u0', // Your client id here
};

export const userPool = new CognitoUserPool(poolData);

export const CreateSignupParams = (params) => {
  const attributeList = [];

  const email = {Name: 'email', Value: params.mail}
  const attributeEmail = new CognitoUserAttribute(email);
  attributeList.push(attributeEmail)

  const givenName = {Name: 'given_name', Value: params.firstname}
  const attributeGivenName = new CognitoUserAttribute(givenName);
  attributeList.push(attributeGivenName)

  const familyName = {Name: 'family_name', Value: params.lastname}
  const attributeFamilyName = new CognitoUserAttribute(familyName);
  attributeList.push(attributeFamilyName)

  const locale = {Name: 'locale', Value: params.locale}
  const attributeLocal = new CognitoUserAttribute(locale);
  attributeList.push(attributeLocal)

  return attributeList;
}

export const CreateAuthDetails = (params) => {
  const authenticationData = {
    Username: params.mail,
    Password: params.password,
    ValidationData: null
  };
  console.log(authenticationData)
  console.log(AuthenticationDetails)
  const authDetails = AuthenticationDetails(authenticationData);
  return authDetails;
}
