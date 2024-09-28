import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Layout, Select, Spin, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const AddOrganization = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    OrganizationID: '',
    Name: '',
    PhoneNumber: '',
    Email: '',
    OrganizationTypeID: 1, // Set default OrganizationTypeID to 1
    TINNo: '', // Ensure this is treated as an INT
    AddressID: '',
    ContactPersonID: ''
  });

  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const orgTypesResponse = await fetch('https://bminsurancebrokers.com/imlserver/organizationtypes');
        if (!orgTypesResponse.ok) throw new Error('Failed to fetch organization types');
        const orgTypes = await orgTypesResponse.json();
        setOrganizationTypes(orgTypes);

        const addressesResponse = await fetch('https://bminsurancebrokers.com/imlserver/addresses');
        if (!addressesResponse.ok) throw new Error('Failed to fetch addresses');
        const addressData = await addressesResponse.json();
        setAddresses(addressData);

        const personsResponse = await fetch('https://bminsurancebrokers.com/imlserver/persons');
        if (!personsResponse.ok) throw new Error('Failed to fetch persons');
        const personData = await personsResponse.json();
        setPersons(personData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await fetch('https://bminsurancebrokers.com/imlserver/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          OrganizationTypeID: 1, // Set OrganizationTypeID to 1 before sending
          TINNo: parseInt(values.TINNo), // Ensure TINNo is sent as an integer
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form Data:', result);
      
      // Show success notification
      notification.success({
        message: 'Success',
        description: 'Organization added successfully!',
      });
      
      navigate('/'); // Navigate back to the entry page or a success page
    } catch (error) {
      console.error('Error adding organization:', error);
      
      // Show error notification
      notification.error({
        message: 'Error',
        description: 'Failed to add organization. Please try again.',
      });
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex' }}>
      <Content style={{ width: '40%', padding: '40px' }}>
        <Title level={2} style={{ color: '#001529' }}>Add New Organization</Title>
        <Title level={4} style={{ color: '#001529', fontWeight: "lighter" }}>
          Register a new organization by filling in the details. Select the type of organization, address, and contact person from the available options.
        </Title>
      </Content>

      <Content style={{ width: '60%', padding: '40px' }}>
        <Form
          name="add-organization"
          initialValues={formData}
          onFinish={handleSubmit}
          layout="vertical"
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <Form.Item
            name="Name"
            label="Organization Name"
            rules={[{ required: true, message: 'Please enter the organization name' }]}
          >
            <Input placeholder="Organization Name" />
          </Form.Item>

          <Form.Item
            name="PhoneNumber"
            label="Phone Number"
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="Email"
            label="Email"
            rules={[{ required: true, message: 'Please enter a valid email' }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="TINNo"
            label="TIN Number"
            rules={[{ required: true, message: 'Please enter the TIN Number' }]}
          >
            <Input
              type="number"
              placeholder="TIN Number"
              onChange={(e) => handleChange('TINNo', e.target.value)} // Use string until submission
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

          <Form.Item
            name="ContactPersonID"
            label="Contact Person"
            rules={[{ required: true, message: 'Please select a contact person' }]}
          >
            <Select placeholder="Select Contact Person">
              {persons.map((person) => (
                <Option key={person.PersonID} value={person.PersonID}>
                  {person.FirstName} - {person.LastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Organization
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default AddOrganization;
