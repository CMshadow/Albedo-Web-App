import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Typography, Row } from 'antd'
import { Grid} from 'react-flexbox-grid';
const { Title, Paragraph, Text } = Typography;

const Term = () => {
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
            <Title level={2}>PRIVACY NOTICE</Title>
          </Row>
          <Row justify="center">
            <Paragraph>Last updated July 03, 2020</Paragraph>
          </Row>
          
          <Paragraph>
            Thank you for choosing to be part of our community at Albedo Inc, doing business as Albedo (“Albedo", "we", "us-: or -our). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at admin@albedopowered.com.
          </Paragraph>
          <Paragraph>
            When you visit our website https://albedowebdesign.com/privacy (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
          </Paragraph>
          <Paragraph>
            This privacy notice applies to all information collected through our Services (which, as described above, includes our Website), as well as any related services, sales, marketing or events.
          </Paragraph>
          <Paragraph>
            Please read this privacy notice carefully as it will help you understand what we do with the information that we collect
          </Paragraph>
          <br/>

          <Row justify="left">
            <Title level={4}>TABLE OF CONTENTS</Title>
          </Row>
          <Paragraph>
            1. WHAT INFORMATION DO WE COLLECT? 
          </Paragraph>
          <Paragraph>
            2. HOW DO WE USE YOUR INFORMATION?
          </Paragraph>
          <Paragraph>
            3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
          </Paragraph>
          <Paragraph>
            4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
          </Paragraph>
          <Paragraph>
            5. DO WE USE GOOGLE MAPS?
          </Paragraph>
          <Paragraph>
            6. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
          </Paragraph>
          <Paragraph>
            7. HOW LONG DO WE KEEP YOUR INFORMATION? 
          </Paragraph>
          <Paragraph>
            8. HOW DO WE KEEP YOUR INFORMATION SAFE?
          </Paragraph>
          <Paragraph>
            9. DO WE COLLECT INFORMATION FROM MINORS?  
          </Paragraph>
          <Paragraph>
            10. WHAT ARE YOUR PRIVACY RIGHTS?  
          </Paragraph>
          <Paragraph>
            11. CONTROLS FOR DO-NOT-TRACK FEATURES   
          </Paragraph>
          <Paragraph>
            12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
          </Paragraph>
          <Paragraph>
            13. DO WE MAKE UPDATES TO THIS NOTICE?  
          </Paragraph>
          <Paragraph>
            14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE? 
          </Paragraph>


          <Row justify="center">
            <Title level={4}>1.     WHAT INFORMATION DO WE COLLECT?</Title>
          </Row>
          <Paragraph style = {{fontWeight:'bold'}}>
            Personal information you disclose to us
          </Paragraph>
          <Paragraph>
            In Short: We collect information that you provide to us.
          </Paragraph>
          <Paragraph>
            We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
          </Paragraph>
          <Paragraph>
            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:
          </Paragraph>
          <Paragraph>
              <Text style = {{fontWeight:'bold'}}>
                Personal Information Provided by You.
              </Text>
              We collect names; email addresses; mailing addresses; usernames; passwords; billing addresses; debit/credit card numbers; project data; and other similar information.
          </Paragraph>
          <Paragraph>
              <Text style = {{fontWeight:'bold'}}>
                Payment Data.
              </Text>
              We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here:
              <a href="https://stripe.com/zh-hans-cn-us/privacy" target="_blank" rel="noopener noreferrer" >
                "https://stripe.com/privacy."</a> 
          </Paragraph>
          <Paragraph>
            All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.
          </Paragraph>
          <Paragraph style = {{fontWeight:'bold'}}>
            Information automatically collected
          </Paragraph>
          <Paragraph>  
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Website.
          </Paragraph>
          <Paragraph> 
            We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about who and when you use our Website and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
          </Paragraph>
          <Paragraph>
            Like many businesses, we also collect information through cookies and similar technologies.
          </Paragraph>
          <Paragraph>
            The information we collect includes:
          </Paragraph>
          <ul>
              <li>
              Log and Usage Data. Log and usage data is service-related, diagnostic usage and performance information our servers automatically collect when you access or use our Website and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type and settings and information about your activity in the Website (such as the date/time stamps associated with your usage, pages and files viewed, searches and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps') and hardware settings).
              </li>
              <br/>
              <li>
              Device Data. We collect device data such as information about your computer, phone, tablet or other device you use to access the Website. Depending on the device used, this device data may include information such as your IP address (or proxy server), device application identification numbers, location, browser type, hardware model Internet service provider and/or mobile carrier, operating system configuration information.
              </li>
              <br/>
              <li>
              Location Data. We collect information data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type of settings of the device you use to access the Website. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Locations settings on your device. Note however, if you choose to opt out, you may not be able to use certain aspects of the Services.
              </li>
              <br/>
              <li>
              Project data
              </li>
          </ul>

          
          <Row justify="center">
            <Title level={4}>2. HOW DO WE USE YOUR INFORMATION?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. We use personal information collected via our Website for a variety of business purposes described below.
          </Paragraph>
          <Paragraph>
            We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
          </Paragraph>
          <Paragraph>
            We use the information we collect or receive:
          </Paragraph>
          <ul>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                    To facilitate account creation and logon process.
                  </Text>
                  If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                    To post testimonials.
                  </Text>
                  We post testimonials on our Website that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and the consent of the testimonial. If you wish to update, or delete your testimonial, please contact us at admin@albedopowered.com and be sure to include your name, testimonial location, and contact information.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Request feedback.
                  </Text>
                  We may use your information to request feedback and to contact you about your use of our Website.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To enable user-to-user communications.
                  </Text>
                  We may use your information in order to enable user-to-user communications with each user's consent.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To manage user accounts.
                  </Text>
                  We may use your information for the purposes of managing our account and keeping it in working order.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To send administrative information to you. 
                  </Text>
                  We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To protect our Services. 
                  </Text>
                  We may use your information as part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract. 
                  </Text>
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To respond to legal requests and prevent harm. 
                  </Text>
                  If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Fulfill and manage your orders.
                  </Text>
                  We may use your information to fulfill and manage your orders, payments, returns, and exchanges made through the Website.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Administer prize draws and competitions.
                  </Text>
                  We may use your information to administer prize draws and competitions when you elect to participate in our competitions.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To deliver and facilitate delivery of services to the user.
                  </Text>
                  We may use your information to provide you with the requested service.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To respond to user inquiries/offer support to users.
                  </Text>
                  We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  To send you marketing and promotional communications.
                  </Text>
                  We and/or our third-party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. For example, when expressing an interest in obtaining information about us or our Website, subscribing to marketing or otherwise contacting us, we will collect personal information from you. You can opt-out of our marketing emails at any time (see the "WHAT ARE YOUR PRIVACY RIGHTS" below).
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Deliver targeted advertising to you. 
                  </Text>
                  We may use your information to develop and display personalized content and advertising (and work with third parties who do so) tailored to your interests and/or location and to measure its effectiveness.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Feature Improvement. 
                  </Text>
                  
              </li>
              <br/>
          </ul>


          <Row justify="center">
            <Title level={4}>3.     WILL YOUR INFORMATION BE SHARED WITH ANYONE?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We only share information with your consent, to comply with laws; to provide you with services; to protect your rights, or to fulfill business obligations.
          </Paragraph>
          <Paragraph>
          We may process or share your data that we hold based on the following legal basis:
          </Paragraph>
          <ul>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Consent:
                  </Text>
                  We may process your data if you have given us specific consent to use your personal information for a specific purpose.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Legitimate Interests: 
                  </Text>
                  We may process your data when it is reasonably necessary to achieve our legitimate business interests.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Performance of a Contract:
                  </Text>
                  Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Legal Obligations:
                  </Text>
                  We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).
              </li>
              <br/>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Vital Interests:
                  </Text>
                  We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.
              </li>
              <br/>
              <Paragraph>
              More specifically, we may need to process your data or share your personal information in the following situations:
              </Paragraph>
              <li>
                  <Text style={{fontWeight:'bold'}}>
                  Business Transfers.  
                  </Text>
                  We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </li>
              
          </ul>

          <Row justify="center">
            <Title level={4}>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We may use cookies and other tracking technologies to collect and store your information.
          </Paragraph>
          <Paragraph>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </Paragraph>

          <Row justify="center">
            <Title level={4}>5. DO WE USE GOOGLE MAPS?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            Yes; we use Google Maps for the purpose of providing better service.
          </Paragraph>
          <Paragraph>
          This Website uses Google Maps APIs which is subject to Google's Terms of Service. You may find the Google Maps APIs Terms of Service 
          <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noopener noreferrer" >
                 'here'</a>. 
                To find out more about Google's Privacy Policy, please refer to this 
                <a href="https://policies.google.com/privacy?hl=en-US" target="_blank" rel="noopener noreferrer" >
                'link'</a>.
          </Paragraph>

          <Row justify="center">
            <Title level={4}>6. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We are not responsible for the safety of any information that you share with third-party providers who advertise, but are not affiliated with, our Website.
          </Paragraph>
          <Paragraph>
            The Website may contain advertisements from third parties that are not affiliated with us and which may link to other websites, online services or mobile applications. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services or applications that may be linked to or from the Website. You should review the policies of such third parties and contact them directly to respond to your questions.
          </Paragraph>

          <Row justify="center">
            <Title level={4}>7. HOW LONG DO WE KEEP YOUR INFORMATION?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law. We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </Paragraph>
          
          <Row justify="center">
            <Title level={4}>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We aim to protect your personal information through a system of organizational and technical security measures.
          </Paragraph>
          <Paragraph>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.
          </Paragraph>
          

          <Row justify="center">
            <Title level={4}>9. DO WE COLLECT INFORMATION FROM MINORS?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            We do not knowingly collect data from or market to children under 18 years of age.
          </Paragraph>
          <Paragraph>
          We do not knowingly solicit data from or market to children under 18 years of age. By using the Website, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Website. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at admin@albedopowered.com.
          </Paragraph>
          

          <Row justify="center">
            <Title level={4}>10. WHAT ARE YOUR PRIVACY RIGHTS?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
            </Paragraph>
          <Paragraph>
          In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.
          </Paragraph>
          <Paragraph>
          If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal, nor will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
          </Paragraph>
          <Paragraph>
          If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: http://ec.europa.eu/justice/data-protection/bodies/authorities/index en.html.
          </Paragraph>
          <Paragraph>
          If you are resident in Switzerland, the contact details for the data protection authorities are available here: https:llwww.edoeb.admin.chledoeblen/home.html.
          </Paragraph>
          <Paragraph>
          If you have questions or comments about your privacy rights, you may email us at admin@albedopowered.com.
          </Paragraph>
          <Paragraph style={{fontWeight:'bold'}}>
          Account Information
          </Paragraph>
          <Paragraph>
          If you would at any time like to review or change the information in your account or terminate your account, you can:
          </Paragraph>
          <ul>
              <li>
              Log in to your account settings and update your user account.
              </li>
          </ul>
          <Paragraph>
          Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with applicable legal requirements.
          </Paragraph>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
            Cookies and similar technologies:
            </Text>
            Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Website. To opt-out of interest-based advertising by advertisers on our Website visit:
            <a href="https://albedowebdesign.com/cookies" target="_blank" rel="noopener noreferrer" >
            https://albedowebdesign.com/cookies</a>. 
          </Paragraph>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
            Opting out of email marketing:
            </Text>
            You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe link in the emails that we send or by contacting us using the details provided below. You will then be removed from the marketing email list — however, we may still communicate with you, for example to send you service-related emails that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes. To otherwise opt-out, you may: 
          </Paragraph>
          <ul>
              <li>
              Access your account settings and update your preferences.
              </li>
          </ul>


          <Row justify="center">
            <Title level={4}>11. CONTROLS FOR DO-NOT-TRACK FEATURES</Title>
          </Row>
          <Paragraph>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
          </Paragraph>

          <Row justify="center">
            <Title level={4}>12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.
          </Paragraph>
          <Paragraph>
          California Civil Code Section 1798.83, also known as the 'Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
          </Paragraph>
          <Paragraph>
          If you are under 18 years of age, reside in California, and have a registered account with the Website, you have the right to request removal of unwanted data that you publicly post on the Website. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Website, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g. backups, etc.).
          </Paragraph>


          <Row justify="center">
            <Title level={4}>13. DO WE MAKE UPDATES TO THIS NOTICE?</Title>
          </Row>
          <Paragraph>
            <Text Text style = {{fontWeight:'bold'}}>
                In Short:
            </Text>
            Yes, we will update this notice as necessary to stay compliant with relevant laws.
          </Paragraph>
          <Paragraph>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </Paragraph>


          <Row justify="center">
            <Title level={4}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Title>
          </Row>
          <Paragraph>
            If you have questions or comments about this notice, you may email us at admin@albedopowered.com or by post to:
          </Paragraph>
          <Paragraph>
            Albedo Inc 2001 E Miraloma Ave
          </Paragraph>
          <Paragraph>
            Placentia, CA 92870
          </Paragraph>
          <Paragraph>
            United States
          </Paragraph>

          <Row justify="center">
            <Title level={4}>HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Title>
          </Row>
          <Paragraph>
          Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please visit: 
          <a href="https://albedowebdesign.com" target="_blank" rel="noopener noreferrer" >
            https://albedowebdesign.com</a>. We will respond to your request within 30 days.
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

export default Term
