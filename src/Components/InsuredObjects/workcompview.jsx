import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Input as AntdInput } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const WorkmenCompensationViewPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddPolicyModalVisible, setIsAddPolicyModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCompensationId, setSelectedCompensationId] = useState(null);
  const [existingPolicies, setExistingPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [linkedPolicyNo, setLinkedPolicyNo] = useState(null); // State for linked policy number
  const objectType = 'WorkmenCompensation';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Workmen's Compensation Data
      const compensationResponse = await axios.get('https://bminsurancebrokers.com/imlserver/workmenscompensation');
      const compensations = compensationResponse.data;

      // Fetch all vehicles to map vehicle ID to PlateNo
      const vehiclesResponse = await axios.get('https://bminsurancebrokers.com/imlserver/vehicles');
      const vehicles = vehiclesResponse.data;

      // Map vehicleID to PlateNo and add it to the compensation data
      const enrichedData = compensations.map((compensation) => {
        const vehicle = vehicles.find(v => v.VehicleID === compensation.VehicleID);
     
        return {
          ...compensation,
          plateNo: vehicle ? vehicle.PlateNo : 'N/A' // Add PlateNo to compensation data
        };
      });
      console.log(enrichedData)
      setData(enrichedData);
      setFilteredData(enrichedData);
    } catch (error) {
      message.error('Failed to fetch data');
    }
  };

  const fetchExistingPolicies = async () => {
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/policies');
      const filteredPolicies = response.data.filter(
        (policy) => policy.PolicyType === '1a2b3c4d5e'
      );
      setExistingPolicies(filteredPolicies);
    } catch (error) {
      message.error(`Failed to fetch Workmen's Compensation policies`);
    }
  };
  

  const handleDelete = async (CompensationID) => {
    try {
      await axios.delete(`https://bminsurancebrokers.com/imlserver/workmenscompensation/${CompensationID}`);
      message.success('Compensation deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete compensation');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`https://bminsurancebrokers.com/imlserver/workmenscompensation/${editingItem.CompensationID}`, values);
      message.success('Compensation updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      message.error('Failed to update compensation');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.remark.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const handleAddPolicyClick = async (compensationId) => {
    setSelectedCompensationId(compensationId);

    // Fetch all insurable objects first
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurableobjects');
      const insurableObjects = response.data; // Assuming the API returns an array of insurable objects
  
      // Loop through the insurable objects to check if the compensation has a linked policy
      for (let i = 0; i < insurableObjects.length; i++) {
        console.log("d")
        console.log(insurableObjects[i].ObjectID)
        if (insurableObjects[i].ObjectID == compensationId) {
       
          // If the compensation is already linked to a policy, show the info message and stop
          message.info('This compensation is already linked to a policy.');
          return; // Exit the function and prevent the modal from opening or other actions
        }
      }
  
      // If no linked policy is found, proceed with other actions
      setSelectedPolicyId(null); // No existing policy, user will select/create
      setLinkedPolicyNo(null); // Reset linked policy number
      setIsAddPolicyModalVisible(true); // Open the modal to add a new policy
    } catch (error) {
      message.error('Failed to fetch insurable objects.');
    }
  };
  

  const handleAddToExistingPolicy = async () => {
    if (!selectedCompensationId || !selectedPolicyId) return;

    try {
      const insurableObjectData = {
        PolicyID: selectedPolicyId,           // Selected policy ID
        ObjectID: selectedCompensationId,     // Compensation ID as ObjectID
        ObjectType: 'WorkmenCompensation',
      };

      await axios.post('https://bminsurancebrokers.com/imlserver/insurableobjects', insurableObjectData);

      message.success('Compensation added to existing policy successfully');
      setIsAddPolicyModalVisible(false);
      setSelectedCompensationId(null);
      setSelectedPolicyId(null);
      setLinkedPolicyNo(null); // Reset linked policy number
      fetchData();
    } catch (error) {
      message.error('Failed to add compensation to policy');
    }
  };

  const columns = [
    { title: 'Salary', dataIndex: 'Salary', key: 'Salary' },
    { title: 'Assistant Salary', dataIndex: 'AssistantSalary', key: 'AssistantSalary' },
    { title: 'Remark', dataIndex: 'Remark', key: 'Remark' },
    { title: 'Vehicle Plate No', dataIndex: 'plateNo', key: 'plateNo' }, // Display the plate number
    // { title: 'Vehicle ID', dataIndex: 'vehicleID', key: 'vehicleID' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          {/* <Button onClick={() => handleEdit(record)}>Edit</Button> */}
          <Button onClick={() => handleDelete(record.CompensationID)} danger>
            Delete
          </Button>
          <Button onClick={() => handleAddPolicyClick(record.CompensationID)} style={{ marginLeft: '8px' }}>
            Add Policy
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <AntdInput.Search
        placeholder="Search by Remark"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        style={{ marginBottom: 16 }}
      />

      <Table columns={columns} dataSource={filteredData} rowKey="CompensationID" />

      {/* Edit Compensation Modal */}
      <Modal
        title="Edit Compensation"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        footer={null}
      >
        <Form initialValues={editingItem} onFinish={handleUpdate}>
          <Form.Item name="salary" label="Salary">
            <Input />
          </Form.Item>
          {/* Other fields here */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Policy Modal */}
      <Modal
        title="Add Policy"
        visible={isAddPolicyModalVisible}
        onCancel={() => {
          setIsAddPolicyModalVisible(false);
          setSelectedCompensationId(null);
          setSelectedPolicyId(null);
          setLinkedPolicyNo(null); // Reset linked policy number
        }}
        footer={null}
      >
        <Select
          placeholder="Select an existing policy"
          onChange={(value) => setSelectedPolicyId(value)}
          style={{ width: '100%', marginBottom: 16 }}
          disabled={existingPolicies.length === 0}
        >
          {existingPolicies.map((policy) => (
            <Option key={policy.PolicyID} value={policy.PolicyID}>
              {policy.PolicyNo} - {policy.NameOfInsured}
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={handleAddToExistingPolicy}
          disabled={!selectedPolicyId || !!linkedPolicyNo} // Disable if linked policy exists
        >
          Add to Selected Policy
        </Button>

        {/* Display the linked policy number */}
        {linkedPolicyNo && (
          <div style={{ marginTop: '16px' }}>
            <strong>Already Linked:</strong> Policy Number: {linkedPolicyNo}
          </div>
        )}

        <Button
          type="secondary"
          onClick={() => navigate(`/dashboard/addinsurance`, { state: { selectedCompensationId, objectType } })}
          style={{ marginLeft: 16 }}
          disabled={!!linkedPolicyNo} // Disable if a policy is linked
        >
          Create New Policy
        </Button>
      </Modal>
    </>
  );
};

export default WorkmenCompensationViewPage;
