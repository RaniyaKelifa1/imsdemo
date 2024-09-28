// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const { Column } = Table;
const { Search } = Input;

const API_BASE_URL = 'https://bminsurancebrokers.com/imlserver';

const DemoViewPage = () => {
  const [data, setData] = useState({
    organizations: [],
    persons: [],
    addresses: [],
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentType] = useState('');
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState({
    organizations: '',
    persons: '',
    addresses: '',
  });

  useEffect(() => {
    fetchData('organizations', 'organizations');
    fetchData('persons', 'persons');
    fetchData('addresses', 'addresses');
  }, []);

  const fetchData = async (endpoint, stateKey) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
      setData(prevData => ({ ...prevData, [stateKey]: response.data }));
    } catch (error) {
      if (error.response?.status === 404) {
        message.success(`${endpoint} Updating...`);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        message.error(`Failed to fetch ${endpoint}: ${error.message}`);
      }
    }
  };

  // const handleEdit = (type, record) => {
  //   setCurrentType(type);
  //   setEditingRecord(record);
  //   form.setFieldsValue(record);
  //   setIsModalVisible(true);
  // };

  const handleDelete = async (type, recordID) => {
    try {
      await axios.delete(`${API_BASE_URL}/${type}/${recordID}`);
      message.success('Record deleted successfully');
      fetchData(type, type);
    } catch (error) {
      if (error.response?.status === 404) {
        message.success('Updating...');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        message.error('Failed to delete record: ' + error.message);
      }
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let recordID;

      if (currentType === 'addresses') {
        recordID = editingRecord?.AddressID;
      } else if (currentType === 'persons') {
        recordID = editingRecord?.PersonID;
      } else if (currentType === 'organizations') {
        recordID = editingRecord?.OrganizationID;
      }

      if (!recordID) {
        throw new Error('Record ID is missing');
      }

      await axios.put(`${API_BASE_URL}/${currentType}/${recordID}`, values);
      message.success('Record updated successfully');
      setIsModalVisible(false);
      setEditingRecord(null);
      fetchData(currentType, currentType);
    } catch (error) {
      if (error.response?.status === 404) {
        message.success('Updating...');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        message.error('Failed to update record: ' + error.message);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleSearch = (value, type) => {
    setSearchText(prev => ({ ...prev, [type]: value }));
  };

  const filteredData = (type) => {
    return data[type].filter(record =>
      Object.values(record).some(val => val.toString().toLowerCase().includes(searchText[type].toLowerCase()))
    );
  };

  return (
    <>
      <div style={{ padding: '24px', backgroundColor: '#fff' }}>
        <h2>Organizations</h2>
        <Search
          placeholder="Search organizations"
          onSearch={value => handleSearch(value, 'organizations')}
          style={{ marginBottom: 16 }}
        />
        <Table dataSource={filteredData('organizations')} rowKey="OrganizationID">
          <Column title="Name" dataIndex="Name" key="Name" />
          <Column title="Phone Number" dataIndex="PhoneNumber" key="PhoneNumber" />
          <Column title="Email" dataIndex="Email" key="Email" />
          <Column title="Organization Type" dataIndex="OrganizationTypeID" key="OrganizationTypeID" />
          <Column title="TIN" dataIndex="TINNo" key="TINNo" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <>
                {/* <Button onClick={() => handleEdit('organizations', record)} type="primary" style={{ marginRight: 8 }}>
                  Edit
                </Button> */}
                <Button onClick={() => handleDelete('organizations', record.OrganizationID)} type="danger">
                  Delete
                </Button>
              </>
            )}
          />
        </Table>

        <h2 style={{ marginTop: '24px' }}>Persons</h2>
        <Search
          placeholder="Search persons"
          onSearch={value => handleSearch(value, 'persons')}
          style={{ marginBottom: 16 }}
        />
        <Table dataSource={filteredData('persons')} rowKey="PersonID">
          <Column title="First Name" dataIndex="FirstName" key="FirstName" />
          <Column title="Last Name" dataIndex="LastName" key="LastName" />
          <Column title="Phone Number" dataIndex="PhoneNumber" key="PhoneNumber" />
          <Column title="Email" dataIndex="Email" key="Email" />
          <Column title="National ID" dataIndex="NationalIDNo" key="NationalIDNo" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <>
                {/* <Button onClick={() => handleEdit('persons', record)} type="primary" style={{ marginRight: 8 }}>
                  Edit
                </Button> */}
                <Button onClick={() => handleDelete('persons', record.PersonID)} type="danger">
                  Delete
                </Button>
              </>
            )}
          />
        </Table>

        <h2 style={{ marginTop: '24px' }}>Addresses</h2>
        <Search
          placeholder="Search addresses"
          onSearch={value => handleSearch(value, 'addresses')}
          style={{ marginBottom: 16 }}
        />
        <Table dataSource={filteredData('addresses')} rowKey="AddressID">
          <Column title="City" dataIndex="City" key="City" />
          <Column title="Subcity" dataIndex="Subcity" key="Subcity" />
          <Column title="House No" dataIndex="HouseNo" key="HouseNo" />
          <Column title="Wereda" dataIndex="Wereda" key="Wereda" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <>
                {/* <Button onClick={() => handleEdit('addresses', record)} type="primary" style={{ marginRight: 8 }}>
                  Edit
                </Button> */}
                <Button onClick={() => handleDelete('addresses', record.AddressID)} type="danger">
                  Delete
                </Button>
              </>
            )}
          />
        </Table>
      </div>

      <Modal
        title="Edit Record"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          {currentType === 'addresses' && (
            <>
              <Form.Item name="AddressID" label="AddressID">
                <Input disabled />
              </Form.Item>
              <Form.Item name="City" label="City">
                <Input />
              </Form.Item>
              <Form.Item name="Subcity" label="Subcity">
                <Input />
              </Form.Item>
              <Form.Item name="HouseNo" label="House No">
                <Input />
              </Form.Item>
              <Form.Item name="Wereda" label="Wereda">
                <Input />
              </Form.Item>
            </>
          )}
          {currentType === 'persons' && (
            <>
              <Form.Item name="PersonID" label="PersonID">
                <Input disabled />
              </Form.Item>
              <Form.Item name="FirstName" label="First Name">
                <Input />
              </Form.Item>
              <Form.Item name="LastName" label="Last Name">
                <Input />
              </Form.Item>
              <Form.Item name="PhoneNumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="Email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="NationalIDNo" label="National ID">
                <Input />
              </Form.Item>
            </>
          )}
          {currentType === 'organizations' && (
            <>
              <Form.Item name="OrganizationID" label="OrganizationID">
                <Input disabled />
              </Form.Item>
              <Form.Item name="Name" label="Name">
                <Input />
              </Form.Item>
              <Form.Item name="PhoneNumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="Email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="OrganizationTypeID" label="Organization Type ID">
                <Input />
              </Form.Item>
              <Form.Item name="TINNo" label="TIN">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default DemoViewPage;
