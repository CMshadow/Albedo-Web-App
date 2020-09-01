import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Typography, Row } from 'antd'
import { Grid,} from 'react-flexbox-grid';
const { Title, Paragraph, Text } = Typography;

const Cookie = () => {
  const { t } = useTranslation()

  return (
    <Grid fluid>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={t('user.logo.welcome')}/>
        <title>{t('sider.company')}</title>
      </Helmet>
      <Row justify="center">
        <Typography style={{maxWidth: '800px'}}>
          <Row justify="center">
            <Title level={2}>Cookie Policy for Albedo PV System Design</Title>
          </Row>
          <Row justify="center">            
            <Paragraph>Last updated June 20, 2020</Paragraph>
            <Paragraph>This is the Cookie Policy for Albedo PV System Design, accessible from https://albedowebdesign.com</Paragraph>
          </Row>
          <Row justify="center">
            <Title level={4}> WHAT ARE COOKIES</Title>
          </Row>
          <Paragraph>
            As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the site's functionality.
          </Paragraph>
          <Paragraph>
            For more general information on cookies, please read: 
            <a href="https://www.cookieconsent.com/what-are-cookies/" target="_blank" rel="noopener noreferrer" >
                "What Are Cookies".
            </a>
          </Paragraph>
          
          <Row justify="center">
            <Title level={4}>HOW WE USE COOKIES</Title>
          </Row>
          <Paragraph>
          We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
          </Paragraph>
          
          <Row justify="center">
            <Title level={4}>DISABLING COOKIES</Title>
          </Row>
          <Paragraph>
          You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
          </Paragraph>
          
          
          <Row justify="center">
            <Title level={4}>THE COOKIES WE SET</Title>
          </Row>
          <ul>
            <li>
              <Text>Account related cookies</Text>
            </li>
            <br/>
            <Paragraph>
                If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.
            </Paragraph>
            <li>
              <Text>Login related cookies</Text>
            </li>
            <br/>
            <Paragraph>
                We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
            </Paragraph>
            <li>
              <Text>Site preferences cookies</Text>
            </li>
            <br/>
            <Paragraph>
                In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences.
            </Paragraph>  
          </ul>
          
          <Row justify="center">
            <Title level={4}>THIRD PARTY COOKIES</Title>
          </Row>
          <Paragraph>
            In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
          </Paragraph>
          <ul>
            <li>
                <Text>This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</Text>
            </li>
          </ul>
          <Paragraph>
          For more information on Google Analytics cookies, see the official Google Analytics page.
          </Paragraph>

          <Row justify="center">
            <Title level={4}> MORE INFORMATION</Title>
          </Row>
          <Paragraph>
          Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site. This Cookies Policy was created with the help of the
          <a href="https://www.cookiepolicygenerator.com/cookie-policy-generator/" target="_blank" rel="noopener noreferrer" >
                "Cookies Policy Template Generator"</a> 
          and the
          <a href="https://www.privacypolicytemplate.net/" target="_blank" rel="noopener noreferrer" >
                "Privacy Policy Template Generator".</a> 
          </Paragraph>
          <Paragraph>
            However if you are still looking for more information, you can contact us through one of our preferred contact methods:
          </Paragraph>

          <Row justify="center">
            <Title level={4}>CONTACT US</Title>
          </Row>
          <Paragraph>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            <br/>
            Albedo Inc
            <br/>
            2001 E Miraloma Ave
            <br/>
            Placentia, CA 92870
            <br/>
            United States
            <br/>
            Phone: 9495589632
            <br/>
            admin@albedopowered.com
          </Paragraph>
        </Typography>
      </Row>
    </Grid>
  )
}

export default Cookie
