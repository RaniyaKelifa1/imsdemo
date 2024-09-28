// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Layout, Select, InputNumber, message as antMessage } from 'antd'; // Add InputNumber for numeric input
import { UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const AddContactPerson = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [contactTypes, setContactTypes] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('https://bminsurancebrokers.com/imlserver/addresses');
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        antMessage.error('Failed to fetch addresses.');
      }
    };

    const fetchContactTypes = async () => {
      try {
        const response = await fetch('https://bminsurancebrokers.com/imlserver/person-types');
        const data = await response.json();
        setContactTypes(data);
      } catch (error) {
        console.error('Error fetching contact types:', error);
        antMessage.error('Failed to fetch contact types.');
      }
    };

    fetchAddresses();
    fetchContactTypes();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const contactPersonData = {
        ...values,
        PersonTypeID: 1, // Set the constant PersonTypeID
        NationalIDNo: parseInt(values.NationalID, 10), // Ensure NationalID is an integer
      };

      const response = await fetch('https://bminsurancebrokers.com/imlserver/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactPersonData),
      });

      if (response.ok) {
        antMessage.success('Contact person added successfully!');
        setFormData({});

        
      } else {
        const error = await response.json();
        antMessage.error(`Failed to add contact person: ${error.message}`);
      }
    } catch (error) {
      antMessage.error('An error occurred while adding the contact person.');
      console.error('Error adding contact person:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      <Content style={{ width: '40%', padding: '40px' }}>
        <Title level={2} style={{ color: '#001529' }}>Add New Contact Person</Title>
        <Title level={4} style={{ color: '#001529', fontWeight: 'lighter' }}>
          Please fill out the form to add a new contact person. Ensure all fields are correctly filled.
        </Title>
      </Content>

      <Content style={{ width: '60%', padding: '40px' }}>
        <Form
          name="add-contact-person"
          initialValues={formData}
          onFinish={onFinish}
          layout="vertical"
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <Form.Item
            name="FirstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter the first name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="LastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter the last name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="PhoneNumber"
            label="Phone Number"
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, message: 'Please enter a valid email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="NationalID"
            label="National ID No"
            rules={[{ required: true, message: 'Please enter the National ID number' }]}
          >
            <InputNumber
              prefix={<IdcardOutlined />}
              placeholder="National ID No"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="AddressID"
            label="Address"
            rules={[{ required: true, message: 'Please select an address' }]}
          >
            <Select placeholder="Select Address">
              {addresses.map((address) => (
                <Option key={address.AddressID} value={address.AddressID}>
                  {address.City} - {address.Subcity} - {address.HouseNo} - {address.Wereda}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Add Contact Person
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default AddContactPerson;
