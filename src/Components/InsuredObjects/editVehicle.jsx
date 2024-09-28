import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Input as AntdInput } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const VehiclesViewPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddPolicyModalVisible, setIsAddPolicyModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [existingPolicies, setExistingPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [linkedPolicyNo, setLinkedPolicyNo] = useState(null); // State for linked policy number
  const objectTypes = 'Vehicles'
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/vehicles');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      message.error('Failed to fetch data');
    }
  };

  const fetchExistingPolicies = async () => {
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/policies');
      const filteredPolicies = response.data.filter(
        (policy) => policy.PolicyType === '1f2g3h4i5j'
      );
      setExistingPolicies(filteredPolicies);
    } catch (error) {
      message.error(`Failed to fetch Motor policies`);
    }
  };

  const handleDelete = async (VehicleID) => {
    try {
      await axios.delete(`https://bminsurancebrokers.com/imlserver/vehicles/${VehicleID}`);
      message.success('Vehicle deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete vehicle');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`https://bminsurancebrokers.com/imlserver/vehicles/${editingItem.VehicleID}`, values);
      message.success('Vehicle updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      message.error('Failed to update vehicle');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      item.MakeAndModel.toLowerCase().includes(value.toLowerCase()) || 
      item.PlateNo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const handleAddPolicyClick = async (vehicleId) => {
    setSelectedVehicleId(vehicleId);
  
    // Fetch all insurable objects first
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurableobjects');
      const insurableObjects = response.data; // Assuming the API returns an array of insurable objects
  
      // Loop through the insurable objects to check if the vehicle has a linked policy
      for (let i = 0; i < insurableObjects.length; i++) {
        if (insurableObjects[i].ObjectID === vehicleId) {
          // If the vehicle is already linked to a policy, show the info message and stop
          message.info('This vehicle is already linked to a policy.');
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
    if (!selectedVehicleId || !selectedPolicyId) return;

    try {
      const insurableObjectData = {
        PolicyID: selectedPolicyId,           // Selected policy ID
        ObjectID: selectedVehicleId,          // Vehicle ID as ObjectID
        ObjectType:'Vehicles',
      };
console.log(insurableObjectData)
      await axios.post('https://bminsurancebrokers.com/imlserver/insurableobjects', insurableObjectData);

      message.success('Vehicle added to existing policy successfully');
      // setIsAddPolicyModalVisible(false);
      // setSelectedVehicleId(null);
      // setSelectedPolicyId(null);
      // setLinkedPolicyNo(null); // Reset linked policy number
      // fetchData();
    } catch (error) {
      message.error('Failed to add vehicle to policy');
    }
  };

  const columns = [
    { title: 'Make and Model', dataIndex: 'MakeAndModel', key: 'MakeAndModel' },
    { title: 'Year', dataIndex: 'Year', key: 'Year' },
    { title: 'Body Type', dataIndex: 'BodyType', key: 'BodyType' },
    { title: 'Plate Number', dataIndex: 'PlateNo', key: 'PlateNo' },
    { title: 'Serial No / Chassis No', dataIndex: 'SerialNoOrChassisNo', key: 'SerialNoOrChassisNo' },
    { title: 'Excess', dataIndex: 'Excess', key: 'Excess' },
    { title: 'Seat Capacity', dataIndex: 'SeatCapacity', key: 'SeatCapacity' },
    { title: 'Sum Insured', dataIndex: 'SumInsured', key: 'SumInsured' },
    { title: 'Engine Number', dataIndex: 'EngineNo', key: 'EngineNo' },
    { title: 'Use of Vehicle', dataIndex: 'UseOfVehicle', key: 'UseOfVehicle' },
    { title: 'CC/HP', dataIndex: 'CC_HP', key: 'CC_HP' },
    { title: 'Duty Free', dataIndex: 'DutyFree', key: 'DutyFree' },

    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          {/* <Button onClick={() => handleEdit(record)}>Edit</Button> */}
          <Button onClick={() => handleDelete(record.VehicleID)} danger>
            Delete
          </Button>
          <Button onClick={() => handleAddPolicyClick(record.VehicleID)} style={{ marginLeft: '8px' }}>
            Add Policy
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <AntdInput.Search
        placeholder="Search by Make and Model or Plate Number"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        style={{ marginBottom: 16 }}
      />

      <Table columns={columns} dataSource={filteredData} rowKey="VehicleID" />

      {/* Edit Vehicle Modal */}
      <Modal
        title="Edit Vehicle"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        footer={null}
      >
        <Form initialValues={editingItem} onFinish={handleUpdate}>
          <Form.Item name="MakeAndModel" label="Make and Model">
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
          setSelectedVehicleId(null);
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
          onClick={() => navigate(`/dashboard/addinsurance`, { state: { selectedVehicleId , objectTypes} })} 
          style={{ marginLeft: 16 }} 
          disabled={!!linkedPolicyNo} // Disable if a policy is linked
        >
          Create New Policy
        </Button>
      </Modal>
    </>
  );
};

export default VehiclesViewPage;
