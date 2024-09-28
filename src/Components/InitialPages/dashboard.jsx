/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  InsuranceOutlined,
  CarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
        <div className="logo" style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          {/* <img src={logo} alt="Company Logo" style={{ width: '80%', height: 'auto' }} /> */}
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/dashboard/demoview">Home</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Clients">
            <Menu.Item key="2" icon={<EyeOutlined />}>
              <Link to="/dashboard/clientview">View Data</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<PlusOutlined />}>
              <Link to="/dashboard/addperson">Add Person</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<PlusOutlined />}>
              <Link to="/dashboard/addorganization">Add Organization</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<PlusOutlined />}>
              <Link to="/dashboard/addaddress">Add Address</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub2" icon={<CarOutlined />} title="Objects">
          {/* <Menu.Item key="61" icon={<PlusOutlined />}>
    <Link to="/dashboard/ObjectForm">Add Object Types</Link>
  </Menu.Item> */}
  <Menu.Item key="6" icon={<PlusOutlined />}>
    <Link to="/dashboard/addvehicle">Add Vehicle</Link>
  </Menu.Item>
  <Menu.Item key="7" icon={<PlusOutlined />}>
    <Link to="/dashboard/workmen">Add Workmen's Compensation</Link>
  </Menu.Item>
  {/* <Menu.Item key="7" icon={<PlusOutlined />}>
    <Link to="/dashboard/addprop">Add Property</Link>
  </Menu.Item> */}
  {/* <Menu.Item key="8" icon={<PlusOutlined />}>
    <Link to="/dashboard/addLife">Add Life</Link>
  </Menu.Item>
  <Menu.Item key="81" icon={<PlusOutlined />}>
    <Link to="/dashboard/addmis">Add Miscellaneous</Link>
  </Menu.Item>
  <Menu.Item key="9" icon={<PlusOutlined />}>
    <Link to="/dashboard/addMachine">Add Machinery</Link>
  </Menu.Item> */}
  {/* <Menu.Item key="91" icon={<PlusOutlined />}>
    <Link to="/dashboard/addBond">Add Bond</Link>
  </Menu.Item> */}
</Menu.SubMenu>

          <Menu.Item key="10" icon={<InsuranceOutlined />}>
          <Link to="/dashboard/viewInsurance">Policies</Link>
          </Menu.Item>
          <Menu.Item key="11" icon={<FileTextOutlined />}>
            Claims
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="header" style={{ background: '#fff', padding: 0 }}>
          <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
            </div>
            <div className="header-tabs" style={{ display: 'flex', alignItems: 'center' ,padding: '24px 24px' }}>
              <a href="#profile" style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
                <UserSwitchOutlined style={{ fontSize: '18px', marginRight: '4px' }} /> Profile
              </a>
              <a href="#settings" style={{ marginRight: '16px', display: 'flex', alignItems: 'center' }}>
                <SettingOutlined style={{ fontSize: '18px', marginRight: '4px' }} /> Settings
              </a>
              <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <LogoutOutlined style={{ fontSize: '18px', marginRight: '4px' }} /> Logout
              </a>
           
          </div>
        </Header>
        <Content style={{ padding: '24px', margin: '0', minHeight: 'calc(100vh - 64px)' }}>
          <div className="site-layout-content">
            <Outlet /> {/* Render nested routes here */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
