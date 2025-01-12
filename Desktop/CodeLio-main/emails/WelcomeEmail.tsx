import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
}

export default function WelcomeEmail({ username }: WelcomeEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Welcome to Codelio</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to Codelio, {username}! We're excited to have you onboard.</Preview>
      <Section style={{ padding: '20px', fontFamily: 'Roboto, Verdana, sans-serif' }}>
        <Row>
          <Heading as="h2">Welcome to Codelio, {username}!</Heading>
        </Row>
        <Row>
          <Text>
            We’re thrilled to have you join us on this exciting journey. At Codelio, we’re committed 
            to helping developers like you build, grow, and succeed in your projects and career.
          </Text>
        </Row>
        <Row>
          <Text>
            Feel free to explore the platform, connect with like-minded individuals, and make the 
            most of the tools and resources we’ve curated just for you.
          </Text>
        </Row>
        <Row style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            href="https://www.codelio.com/login"
            style={{
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              padding: '10px 20px',
              fontSize: '16px',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Get Started
          </Button>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Text>
            If you have any questions or need assistance, feel free to reach out to our support 
            team. We’re here to help!
          </Text>
        </Row>
        <Row>
          <Text>Welcome aboard,</Text>
          <Text>The Codelio Team</Text>
        </Row>
      </Section>
    </Html>
  );
}
