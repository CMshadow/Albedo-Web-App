import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Typography, Row } from 'antd'
import { Grid } from 'react-flexbox-grid'
const { Title, Paragraph, Text } = Typography

const Term = () => {
  const { t } = useTranslation()

  return (
    <Grid fluid>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='description' content={t('user.logo.welcome')} />
        <title>{t('sider.company')}</title>
      </Helmet>
      <Row justify='center'>
        <Typography style={{ maxWidth: '800px' }}>
          <Row justify='center'>
            <Title level={2}>TERMS OF USE</Title>
          </Row>
          <Row justify='center'>
            <Paragraph>Last updated June 20, 2020</Paragraph>
          </Row>
          <Row justify='center'>
            <Title level={4}>AGREEMENT TO TERMS</Title>
          </Row>
          <Paragraph>
            These Terms of Use constitute a legally binding agreement made between you, whether
            personally or on behalf of an entity (“you”) and Albedo Inc, doing business as Albedo
            (“Albedo”, “we”, “us”, or “our”), concerning your access to and use of the
            https://albedowebdesign.com website as well as any other media form, media channel,
            mobile website or mobile application related, linked, or otherwise connected thereto
            (collectively, the “Site”). You agree that by accessing the Site, you have read,
            understood, and agree to be bound by all of these Terms of Use, including the Services
            Agreement posted on the Site, which are incorporated into these Terms of Use.{' '}
            <Text strong>
              IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED
              FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </Text>
          </Paragraph>
          <Paragraph>
            Supplemental terms and conditions or documents that may be posted on the Site from time
            to time are hereby expressly incorporated herein by reference. We reserve the right, in
            our sole discretion, to make changes or modifications to these Terms of Use at any time
            and for any reason. We will alert you about any changes by updating the “Last updated”
            date of these Terms of Use, and you waive any right to receive specific notice of each
            such change. It is your responsibility to periodically review these Terms of Use to stay
            informed of updates. You will be subject to, and will be deemed to have been made aware
            of and to have accepted, the changes in any revised Terms of Use by your continued use
            of the Site after the date such revised Terms of Use are posted.
          </Paragraph>
          <Paragraph>
            The information provided on the Site is not intended for distribution to or use by any
            person or entity in any jurisdiction or country where such distribution or use would be
            contrary to law or regulation or which would subject us to any registration requirement
            within such jurisdiction or country. Accordingly, those persons who choose to access the
            Site from other locations do so on their own initiative and are solely responsible for
            compliance with local laws, if and to the extent local laws are applicable.
          </Paragraph>
          <Paragraph>
            The Site is not tailored to comply with industry-specific regulations (Health Insurance
            Portability and Accountability Act (HIPAA), Federal Information Security Management Act
            (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use
            this Site. You may not use the Site in a way that would violate the Gramm-Leach-Bliley
            Act (GLBA).
          </Paragraph>
          <Paragraph>
            The Site is intended for users who are at least 13 years of age. All users who are
            minors in the jurisdiction in which they reside (generally under the age of 18) must
            have the permission of, and be directly supervised by, their parent or guardian to use
            the Site. If you are a minor, you must have your parent or guardian read and agree to
            these Terms of Use prior to you using the Site.
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>INTELLECTUAL PROPERTY RIGHTS</Title>
          </Row>
          <Paragraph>
            Unless otherwise indicated, the Site is our proprietary property and all source code,
            databases, functionality, software, website designs, audio, video, text, photographs,
            and graphics on the Site (collectively, the “Content”) and the trademarks, service
            marks, and logos contained therein (the “Marks”) are owned or controlled by us or
            licensed to us, and are protected by copyright and trademark laws and various other
            intellectual property rights and unfair competition laws of the United States,
            international copyright laws, and international conventions. The Content and the Marks
            are provided on the Site “AS IS” for your information and personal use only. Except as
            expressly provided in these Terms of Use, no part of the Site and no Content or Marks
            may be copied, reproduced, aggregated, republished, uploaded, posted, publicly
            displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise
            exploited for any commercial purpose whatsoever, without our express prior written
            permission.
          </Paragraph>
          <Paragraph>
            Provided that you are eligible to use the Site, you are granted a limited license to
            access and use the Site and to download or print a copy of any portion of the Content to
            which you have properly gained access solely for your personal, non-commercial use. We
            reserve all rights not expressly granted to you in and to the Site, the Content and the
            Marks.
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>USER REPRESENTATIONS</Title>
          </Row>
          <Paragraph>
            By using the Site, you represent and warrant that: (1) all registration information you
            submit will be true, accurate, current, and complete; (2) you will maintain the accuracy
            of such information and promptly update such registration information as necessary; (3)
            you have the legal capacity and you agree to comply with these Terms of Use; (4) you are
            not under the age of 13; (5) you are not a minor in the jurisdiction in which you
            reside, or if a minor, you have received parental permission to use the Site; (6) you
            will not access the Site through automated or non-human means, whether through a bot,
            script or otherwise; (7) you will not use the Site for any illegal or unauthorized
            purpose; and (8) your use of the Site will not violate any applicable law or regulation.
          </Paragraph>
          <Paragraph>
            If you provide any information that is untrue, inaccurate, not current, or incomplete,
            we have the right to suspend or terminate your account and refuse any and all current or
            future use of the Site (or any portion thereof).
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>USER REGISTRATION</Title>
          </Row>
          <Paragraph>
            You may be required to register with the Site. You agree to keep your password
            confidential and will be responsible for all use of your account and password. We
            reserve the right to remove, reclaim, or change a username you select if we determine,
            in our sole discretion, that such username is inappropriate, obscene, or otherwise
            objectionable.
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>FEES AND PAYMENT</Title>
          </Row>
          <Paragraph>We accept the following forms of payment:</Paragraph>
          <ul>
            <li>
              <Text>Visa</Text>
            </li>
            <li>
              <Text>Mastercard</Text>
            </li>
            <li>
              <Text>Discover</Text>
            </li>
            <li>
              <Text>PayPal</Text>
            </li>
            <li>
              <Text>American Express</Text>
            </li>
          </ul>
          <Paragraph>
            You may be required to purchase or pay a fee to access some of our services. You agree
            to provide current, complete, and accurate purchase and account information for all
            purchases made via the Site. You further agree to promptly update account and payment
            information, including email address, payment method, and payment card expiration date,
            so that we can complete your transactions and contact you as needed. We bill you through
            an online billing account for purchases made via the Site. Sales tax will be added to
            the price of purchases as deemed required by us. We may change prices at any time. All
            payments shall be in U.S. dollars.
          </Paragraph>
          <Paragraph>
            You agree to pay all charges or fees at the prices then in effect for your purchases,
            and you authorize us to charge your chosen payment provider for any such amounts upon
            making your purchase. If your purchase is subject to recurring charges, then you consent
            to our charging your payment method on a recurring basis without requiring your prior
            approval for each recurring charge, until you notify us of your cancellation.
          </Paragraph>
          <Paragraph>
            We reserve the right to correct any errors or mistakes in pricing, even if we have
            already requested or received payment. We also reserve the right to refuse any order
            placed through the Site.
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>CANCELLATION</Title>
          </Row>
          <Paragraph>
            You can cancel your subscription at any time by contacting us using the contact
            information provided below. Your cancellation will take effect at the end of the current
            paid term.
          </Paragraph>
          <Paragraph>
            If you are unsatisfied with our services, please email us at admin@albedopowered.com or
            call us at 9495589632.
          </Paragraph>
          <Row justify='center'>
            <Title level={4}>PROHIBITED ACTIVITIES</Title>
          </Row>
          <Paragraph>
            You may not access or use the Site for any purpose other than that for which we make the
            Site available. The Site may not be used in connection with any commercial endeavors
            except those that are specifically endorsed or approved by us.
          </Paragraph>
          <Paragraph>As a user of the Site, you agree not to:</Paragraph>
          <ol>
            <li>
              <Text>
                Systematically retrieve data or other content from the Site to create or compile,
                directly or indirectly, a collection, compilation, database, or directory without
                written permission from us.
              </Text>
            </li>
            <li>
              <Text>
                Make any unauthorized use of the Site, including collecting usernames and/or email
                addresses of users by electronic or other means for the purpose of sending
                unsolicited email, or creating user accounts by automated means or under false
                pretenses.
              </Text>
            </li>
            <li>
              <Text>Use the Site to advertise or offer to sell goods and services.</Text>
            </li>
            <li>
              <Text>
                Circumvent, disable, or otherwise interfere with security-related features of the
                Site, including features that prevent or restrict the use or copying of any Content
                or enforce limitations on the use of the Site and/or the Content contained therein.
              </Text>
            </li>
            <li>
              <Text>Engage in unauthorized framing of or linking to the Site.</Text>
            </li>
            <li>
              <Text>
                Trick, defraud, or mislead us and other users, especially in any attempt to learn
                sensitive account information such as user passwords.
              </Text>
            </li>
            <li>
              <Text>
                Engage in any automated use of the system, such as using scripts to send comments or
                messages, or using any data mining, robots, or similar data gathering and extraction
                tools.
              </Text>
            </li>
            <li>
              <Text>
                Interfere with, disrupt, or create an undue burden on the Site or the networks or
                services connected to the Site.
              </Text>
            </li>
            <li>
              <Text>
                Attempt to impersonate another user or person or use the username of another user.
              </Text>
            </li>
            <li>
              <Text>Sell or otherwise transfer your profile.</Text>
            </li>
            <li>
              <Text>
                Use any information obtained from the Site in order to harass, abuse, or harm
                another person.
              </Text>
            </li>
            <li>
              <Text>
                Use the Site as part of any effort to compete with us or otherwise use the Site
                and/or the Content for any revenue-generating endeavor or commercial enterprise.
              </Text>
            </li>
            <li>
              <Text>
                Decipher, decompile, disassemble, or reverse engineer any of the software comprising
                or in any way making up a part of the Site.
              </Text>
            </li>
            <li>
              <Text>
                Attempt to bypass any measures of the Site designed to prevent or restrict access to
                the Site, or any portion of the Site.
              </Text>
            </li>
            <li>
              <Text>
                Harass, annoy, intimidate, or threaten any of our employees or agents engaged in
                providing any portion of the Site to you.
              </Text>
            </li>
            <li>
              <Text>Delete the copyright or other proprietary rights notice from any Content.</Text>
            </li>
            <li>
              <Text>
                Copy or adapt the Site’s software, including but not limited to Flash, PHP, HTML,
                JavaScript, or other code.
              </Text>
            </li>
            <li>
              <Text>
                Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or
                other material, including excessive use of capital letters and spamming (continuous
                posting of repetitive text), that interferes with any party’s uninterrupted use and
                enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the
                use, features, functions, operation, or maintenance of the Site.
              </Text>
            </li>
            <li>
              <Text>
                Upload or transmit (or attempt to upload or to transmit) any material that acts as a
                passive or active information collection or transmission mechanism, including
                without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web
                bugs, cookies, or other similar devices (sometimes referred to as “spyware” or
                “passive collection mechanisms” or “pcms”).
              </Text>
            </li>
            <li>
              <Text>
                Except as may be the result of standard search engine or Internet browser usage,
                use, launch, develop, or distribute any automated system, including without
                limitation, any spider, robot, cheat utility, scraper, or offline reader that
                accesses the Site, or using or launching any unauthorized script or other software.
              </Text>
            </li>
            <li>
              <Text>
                Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.
              </Text>
            </li>
            <li>
              <Text>
                Use the Site in a manner inconsistent with any applicable laws or regulations.
              </Text>
            </li>
          </ol>

          <Row justify='center'>
            <Title level={4}>USER GENERATED CONTRIBUTIONS</Title>
          </Row>
          <Paragraph>
            The Site may invite you to chat, contribute to, or participate in blogs, message boards,
            online forums, and other functionality, and may provide you with the opportunity to
            create, submit, post, display, transmit, perform, publish, distribute, or broadcast
            content and materials to us or on the Site, including but not limited to text, writings,
            video, audio, photographs, graphics, comments, suggestions, or personal information or
            other material (collectively, “Contributions”). Contributions may be viewable by other
            users of the Site and through third-party websites. As such, any Contributions you
            transmit may be treated as non-confidential and non-proprietary. When you create or make
            available any Contributions, you thereby represent and warrant that:
          </Paragraph>
          <ol>
            <li>
              <Text>
                The creation, distribution, transmission, public display, or performance, and the
                accessing, downloading, or copying of your Contributions do not and will not
                infringe the proprietary rights, including but not limited to the copyright, patent,
                trademark, trade secret, or moral rights of any third party.
              </Text>
            </li>
            <li>
              <Text>
                You are the creator and owner of or have the necessary licenses, rights, consents,
                releases, and permissions to use and to authorize us, the Site, and other users of
                the Site to use your Contributions in any manner contemplated by the Site and these
                Terms of Use.
              </Text>
            </li>
            <li>
              <Text>
                You have the written consent, release, and/or permission of each and every
                identifiable individual person in your Contributions to use the name or likeness of
                each and every such identifiable individual person to enable inclusion and use of
                your Contributions in any manner contemplated by the Site and these Terms of Use.
              </Text>
            </li>
            <li>
              <Text>Your Contributions are not false, inaccurate, or misleading.</Text>
            </li>
            <li>
              <Text>
                Your Contributions are not unsolicited or unauthorized advertising, promotional
                materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of
                solicitation.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing,
                libelous, slanderous, or otherwise objectionable (as determined by us).
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not advocate the violent overthrow of any government or
                incite, encourage, or threaten physical harm against another.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not violate any applicable law, regulation, or rule.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not violate the privacy or publicity rights of any third
                party.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not contain any material that solicits personal information
                from anyone under the age of 18 or exploits people under the age of 18 in a sexual
                or violent manner.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not violate any applicable law concerning child pornography,
                or otherwise intended to protect the health or well-being of minors.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not include any offensive comments that are connected to race,
                national origin, gender, sexual preference, or physical handicap.
              </Text>
            </li>
            <li>
              <Text>
                Your Contributions do not otherwise violate, or link to material that violates, any
                provision of these Terms of Use, or any applicable law or regulation.
              </Text>
            </li>
          </ol>
          <Paragraph>
            Any use of the Site in violation of the foregoing violates these Terms of Use and may
            result in, among other things, termination or suspension of your rights to use the Site.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>CONTRIBUTION LICENSE</Title>
          </Row>
          <Paragraph>
            By posting your Contributions to any part of the Site, you automatically grant, and you
            represent and warrant that you have the right to grant, to us an unrestricted,
            unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free,
            fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell,
            resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly
            display, reformat, translate, transmit, excerpt (in whole or in part), and distribute
            such Contributions (including, without limitation, your image and voice) for any
            purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or
            incorporate into other works, such Contributions, and grant and authorize sublicenses of
            the foregoing. The use and distribution may occur in any media formats and through any
            media channels.
          </Paragraph>
          <Paragraph>
            This license will apply to any form, media, or technology now known or hereafter
            developed, and includes our use of your name, company name, and franchise name, as
            applicable, and any of the trademarks, service marks, trade names, logos, and personal
            and commercial images you provide. You waive all moral rights in your Contributions, and
            you warrant that moral rights have not otherwise been asserted in your Contributions.
          </Paragraph>
          <Paragraph>
            We do not assert any ownership over your Contributions. You retain full ownership of all
            of your Contributions and any intellectual property rights or other proprietary rights
            associated with your Contributions. We are not liable for any statements or
            representations in your Contributions provided by you in any area on the Site. You are
            solely responsible for your Contributions to the Site and you expressly agree to
            exonerate us from any and all responsibility and to refrain from any legal action
            against us regarding your Contributions.
          </Paragraph>
          <Paragraph>
            We have the right, in our sole and absolute discretion, (1) to edit, redact, or
            otherwise change any Contributions; (2) to re-categorize any Contributions to place them
            in more appropriate locations on the Site; and (3) to pre-screen or delete any
            Contributions at any time and for any reason, without notice. We have no obligation to
            monitor your Contributions.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>SUBMISSIONS</Title>
          </Row>
          <Paragraph>
            You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or
            other information regarding the Site (“Submissions”) provided by you to us are
            non-confidential and shall become our sole property. We shall own exclusive rights,
            including all intellectual property rights, and shall be entitled to the unrestricted
            use and dissemination of these Submissions for any lawful purpose, commercial or
            otherwise, without acknowledgment or compensation to you. You hereby waive all moral
            rights to any such Submissions, and you hereby warrant that any such Submissions are
            original with you or that you have the right to submit such Submissions. You agree there
            shall be no recourse against us for any alleged or actual infringement or
            misappropriation of any proprietary right in your Submissions.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>THIRD-PARTY WEBSITES AND CONTENT</Title>
          </Row>
          <Paragraph>
            The Site may contain (or you may be sent via the Site) links to other websites
            (“Third-Party Websites) as well as articles, photographs, text, graphics, pictures,
            designs, music, sound, video, information, applications, software, and other content or
            items belonging to or originating from third parties (“Third-Party Content”). Such
            Third-Party Websites and Third-Party Content are not investigated, monitored, or checked
            for accuracy, appropriateness, or completeness by us, and we are not responsible for any
            Third-Party Websites accessed through the Site or any Third-Party Content posted on,
            available through, or installed from the Site, including the content, accuracy,
            offensiveness, opinions, reliability, privacy practices, or other policies of or
            contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking
            to, or permitting the use or installation of any Third-Party Websites or any Third-Party
            Content does not imply approval or endorsement thereof by us. If you decide to leave the
            Site and access the Third-Party Websites or to use or install any Third-Party Content,
            you do so at your own risk, and you should be aware these Terms of Use no longer govern.
            You should review the applicable terms and policies, including privacy and data
            gathering practices, of any website to which you navigate from the Site or relating to
            any applications you use or install from the Site. Any purchases you make through
            Third-Party Websites will be through other websites and from other companies, and we
            take no responsibility whatsoever in relation to such purchases which are exclusively
            between you and the applicable third party. You agree and acknowledge that we do not
            endorse the products or services offered on Third-Party Websites and you shall hold us
            harmless from any harm caused by your purchase of such products or services.
            Additionally, you shall hold us harmless from any losses sustained by you or harm caused
            to you relating to or resulting in any way from any Third-Party Content or any contact
            with Third-Party Websites.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>ADVERTISERS</Title>
          </Row>
          <Paragraph>
            We allow advertisers to display their advertisements and other information in certain
            areas of the Site, such as sidebar advertisements or banner advertisements. If you are
            an advertiser, you shall take full responsibility for any advertisements you place on
            the Site and any services provided on the Site or products sold through those
            advertisements. Further, as an advertiser, you warrant and represent that you possess
            all rights and authority to place advertisements on the Site, including, but not limited
            to, intellectual property rights, publicity rights, and contractual rights. We simply
            provide the space to place such advertisements, and we have no other relationship with
            advertisers.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>U.S. GOVERNMENT RIGHTS</Title>
          </Row>
          <Paragraph>
            Our services are “commercial items” as defined in Federal Acquisition Regulation (“FAR”)
            2.101. If our services are acquired by or on behalf of any agency not within the
            Department of Defense (“DOD”), our services are subject to the terms of these Terms of
            Use in accordance with FAR 12.212 (for computer software) and FAR 12.211 (for technical
            data). If our services are acquired by or on behalf of any agency within the Department
            of Defense, our services are subject to the terms of these Terms of Use in accordance
            with Defense Federal Acquisition Regulation (“DFARS”) 227.7202‑3. In addition, DFARS
            252.227‑7015 applies to technical data acquired by the DOD. This U.S. Government Rights
            clause is in lieu of, and supersedes, any other FAR, DFARS, or other clause or provision
            that addresses government rights in computer software or technical data under these
            Terms of Use.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>SITE MANAGEMENT</Title>
          </Row>
          <Paragraph>
            We reserve the right, but not the obligation, to: (1) monitor the Site for violations of
            these Terms of Use; (2) take appropriate legal action against anyone who, in our sole
            discretion, violates the law or these Terms of Use, including without limitation,
            reporting such user to law enforcement authorities; (3) in our sole discretion and
            without limitation, refuse, restrict access to, limit the availability of, or disable
            (to the extent technologically feasible) any of your Contributions or any portion
            thereof; (4) in our sole discretion and without limitation, notice, or liability, to
            remove from the Site or otherwise disable all files and content that are excessive in
            size or are in any way burdensome to our systems; and (5) otherwise manage the Site in a
            manner designed to protect our rights and property and to facilitate the proper
            functioning of the Site.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>PRIVACY POLICY</Title>
          </Row>
          <Paragraph>
            We care about data privacy and security. Please review our Privacy Policy:
            https://albedowebdesign.com/terms. By using the Site, you agree to be bound by our
            Privacy Policy, which is incorporated into these Terms of Use. Please be advised the
            Site is hosted in the United States. If you access the Site from any other region of the
            world with laws or other requirements governing personal data collection, use, or
            disclosure that differ from applicable laws in the United States, then through your
            continued use of the Site, you are transferring your data to the United States, and you
            agree to have your data transferred to and processed in the United States. Further, we
            do not knowingly accept, request, or solicit information from children or knowingly
            market to children. Therefore, in accordance with the U.S. Children’s Online Privacy
            Protection Act, if we receive actual knowledge that anyone under the age of 13 has
            provided personal information to us without the requisite and verifiable parental
            consent, we will delete that information from the Site as quickly as is reasonably
            practical.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>COPYRIGHT INFRINGEMENTS</Title>
          </Row>
          <Paragraph>
            We respect the intellectual property rights of others. If you believe that any material
            available on or through the Site infringes upon any copyright you own or control, please
            immediately notify us using the contact information provided below (a “Notification”). A
            copy of your Notification will be sent to the person who posted or stored the material
            addressed in the Notification. Please be advised that pursuant to applicable law you may
            be held liable for damages if you make material misrepresentations in a Notification.
            Thus, if you are not sure that material located on or linked to by the Site infringes
            your copyright, you should consider first contacting an attorney.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>TERM AND TERMINATION</Title>
          </Row>
          <Paragraph>
            These Terms of Use shall remain in full force and effect while you use the Site.{' '}
            <Text strong>
              WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF USE, WE RESERVE THE RIGHT TO,
              IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE
              SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO
              REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR
              COVENANT CONTAINED IN THESE TERMS OF USE OR OF ANY APPLICABLE LAW OR REGULATION. WE
              MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SITE OR DELETE YOUR ACCOUNT AND ANY
              CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE
              DISCRETION.
            </Text>
          </Paragraph>
          <Paragraph>
            If we terminate or suspend your account for any reason, you are prohibited from
            registering and creating a new account under your name, a fake or borrowed name, or the
            name of any third party, even if you may be acting on behalf of the third party. In
            addition to terminating or suspending your account, we reserve the right to take
            appropriate legal action, including without limitation pursuing civil, criminal, and
            injunctive redress.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>MODIFICATIONS AND INTERRUPTIONS</Title>
          </Row>
          <Paragraph>
            We reserve the right to change, modify, or remove the contents of the Site at any time
            or for any reason at our sole discretion without notice. However, we have no obligation
            to update any information on our Site. We also reserve the right to modify or
            discontinue all or part of the Site without notice at any time. We will not be liable to
            you or any third party for any modification, price change, suspension, or discontinuance
            of the Site.
          </Paragraph>
          <Paragraph>
            We cannot guarantee the Site will be available at all times. We may experience hardware,
            software, or other problems or need to perform maintenance related to the Site,
            resulting in interruptions, delays, or errors. We reserve the right to change, revise,
            update, suspend, discontinue, or otherwise modify the Site at any time or for any reason
            without notice to you. You agree that we have no liability whatsoever for any loss,
            damage, or inconvenience caused by your inability to access or use the Site during any
            downtime or discontinuance of the Site. Nothing in these Terms of Use will be construed
            to obligate us to maintain and support the Site or to supply any corrections, updates,
            or releases in connection therewith.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>GOVERNING LAW</Title>
          </Row>
          <Paragraph>
            These Terms of Use and your use of the Site are governed by and construed in accordance
            with the laws of the State of Delaware applicable to agreements made and to be entirely
            performed within the State of Delaware, without regard to its conflict of law
            principles.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>DISPUTE RESOLUTION</Title>
          </Row>
          <Paragraph>
            You agree to irrevocably submit all disputes related to Terms or the legal relationship
            established by this Agreement to the jurisdiction of the Delaware courts. Albedo Inc
            shall also maintain the right to bring proceedings as to the substance of the matter in
            the courts of the country where you reside or, if these Terms are entered into in the
            course of your trade or profession, the state of your principal place of business.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>CORRECTIONS</Title>
          </Row>
          <Paragraph>
            There may be information on the Site that contains typographical errors, inaccuracies,
            or omissions, including descriptions, pricing, availability, and various other
            information. We reserve the right to correct any errors, inaccuracies, or omissions and
            to change or update the information on the Site at any time, without prior notice.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>DISCLAIMER</Title>
          </Row>
          <Paragraph>
            <Text strong>
              THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF
              THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED
              BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE
              AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO
              WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT
              OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR
              RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS,
              (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR
              ACCESS TO AND USE OF THE SITE, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE
              SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED
              THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5)
              ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH
              THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND
              MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY
              CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE. WE DO NOT
              WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE
              ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SITE, ANY HYPERLINKED WEBSITE, OR
              ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE
              WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION
              BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE
              PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD
              USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
            </Text>
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>LIMITATIONS OF LIABILITY</Title>
          </Row>
          <Paragraph>
            <Text strong>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY
              THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL,
              OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER
              DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED
              HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF
              THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY
              YOU TO US DURING THE ONE (1) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING OR
              $150.00 USD. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON
              IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS
              APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO
              YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
            </Text>
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>INDEMNIFICATION</Title>
          </Row>
          <Paragraph>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries,
            affiliates, and all of our respective officers, agents, partners, and employees, from
            and against any loss, damage, liability, claim, or demand, including reasonable
            attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your
            Contributions; (2) use of the Site; (3) breach of these Terms of Use; (4) any breach of
            your representations and warranties set forth in these Terms of Use; (5) your violation
            of the rights of a third party, including but not limited to intellectual property
            rights; or (6) any overt harmful act toward any other user of the Site with whom you
            connected via the Site. Notwithstanding the foregoing, we reserve the right, at your
            expense, to assume the exclusive defense and control of any matter for which you are
            required to indemnify us, and you agree to cooperate, at your expense, with our defense
            of such claims. We will use reasonable efforts to notify you of any such claim, action,
            or proceeding which is subject to this indemnification upon becoming aware of it.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>USER DATA</Title>
          </Row>
          <Paragraph>
            We will maintain certain data that you transmit to the Site for the purpose of managing
            the performance of the Site, as well as data relating to your use of the Site. Although
            we perform regular routine backups of data, you are solely responsible for all data that
            you transmit or that relates to any activity you have undertaken using the Site. You
            agree that we shall have no liability to you for any loss or corruption of any such
            data, and you hereby waive any right of action against us arising from any such loss or
            corruption of such data.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</Title>
          </Row>
          <Paragraph>
            Visiting the Site, sending us emails, and completing online forms constitute electronic
            communications. You consent to receive electronic communications, and you agree that all
            agreements, notices, disclosures, and other communications we provide to you
            electronically, via email and on the Site, satisfy any legal requirement that such
            communication be in writing.{' '}
            <Text strong>
              YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER
              RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS
              INITIATED OR COMPLETED BY US OR VIA THE SITE.
            </Text>{' '}
            You hereby waive any rights or requirements under any statutes, regulations, rules,
            ordinances, or other laws in any jurisdiction which require an original signature or
            delivery or retention of non-electronic records, or to payments or the granting of
            credits by any means other than electronic means.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>CALIFORNIA USERS AND RESIDENTS</Title>
          </Row>
          <Paragraph>
            If any complaint with us is not satisfactorily resolved, you can contact the Complaint
            Assistance Unit of the Division of Consumer Services of the California Department of
            Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento,
            California 95834 or by telephone at (800) 952-5210 or (916) 445-1254.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>MISCELLANEOUS</Title>
          </Row>
          <Paragraph>
            These Terms of Use and any policies or operating rules posted by us on the Site or in
            respect to the Site constitute the entire agreement and understanding between you and
            us. Our failure to exercise or enforce any right or provision of these Terms of Use
            shall not operate as a waiver of such right or provision. These Terms of Use operate to
            the fullest extent permissible by law. We may assign any or all of our rights and
            obligations to others at any time. We shall not be responsible or liable for any loss,
            damage, delay, or failure to act caused by any cause beyond our reasonable control. If
            any provision or part of a provision of these Terms of Use is determined to be unlawful,
            void, or unenforceable, that provision or part of the provision is deemed severable from
            these Terms of Use and does not affect the validity and enforceability of any remaining
            provisions. There is no joint venture, partnership, employment or agency relationship
            created between you and us as a result of these Terms of Use or use of the Site. You
            agree that these Terms of Use will not be construed against us by virtue of having
            drafted them. You hereby waive any and all defenses you may have based on the electronic
            form of these Terms of Use and the lack of signing by the parties hereto to execute
            these Terms of Use.
          </Paragraph>

          <Row justify='center'>
            <Title level={4}>CONTACT US</Title>
          </Row>
          <Paragraph>
            In order to resolve a complaint regarding the Site or to receive further information
            regarding use of the Site, please contact us at:
            <br />
            Albedo Inc
            <br />
            2001 E Miraloma Ave
            <br />
            Placentia, CA 92870
            <br />
            United States
            <br />
            Phone: 9495589632
            <br />
            admin@albedopowered.com
          </Paragraph>
        </Typography>
      </Row>
    </Grid>
  )
}

export default Term
