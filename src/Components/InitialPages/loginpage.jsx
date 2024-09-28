/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' }}>
      <Content style={{ maxWidth: '400px', width: '100%',  borderRadius: '8px', textAlign: 'center', alignContent:'center',}}>
        <div className="welcome-logo" style={{ marginBottom: '20px' }}>
          {/* Add your company logo here */}
          {/* <img src="iml-react-app/src/assets/logo.png" alt="Company Logo" style={{ width: '80%', height: 'auto' }} /> */}
        </div>
        <Title level={2} style={{ color: '#001529' }}>Welcome to Bizuhan & Mebratu Insurance Brokers GM</Title>
        <Paragraph style={{ color: '#001529', marginBottom: '30px' }}>
          We're glad to have you here. Click the button below to get started with your dashboard.
        </Paragraph>
        <Button type="primary" onClick={handleStart} style={{ width: '100%' }}>
          Start
        </Button>
      </Content>
    </Layout>
  );
};

export default WelcomePage;
