// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, message, Modal } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Search } = Input;

const ViewInsurancePolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('');
  const [policyTypeFilter, setPolicyTypeFilter] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [policyTypes, setPolicyTypes] = useState({});
  const [selectedObject, setSelectedObject] = useState(null);
  const [isObjectModalVisible, setIsObjectModalVisible] = useState(false);

  useEffect(() => {
    fetchPolicies();
    fetchPolicyTypes();
  }, );

  const fetchPolicies = async () => {
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/policies');
      const fetchedPolicies = response.data;

      const clientIds = fetchedPolicies.map(policy => policy.ClientID);
      // eslint-disable-next-line no-unused-vars
      const uniqueClientIds = [...new Set(clientIds)];

      const clientsResponse = await axios.get(`https://bminsurancebrokers.com/imlserver/clients`);
      const clientsData = clientsResponse.data;

      const clientsMap = {};
      clientsData.forEach(client => {
        clientsMap[client.ClientID] = client;
      });

      const policiesWithInsuredNames = await Promise.all(
        fetchedPolicies.map(async (policy) => {
          const client = clientsMap[policy.ClientID];
          
          if (client) {
            const insuredName = await fetchInsuredName(client);
            return { ...policy, NameOfInsured: insuredName, ClientType: client.ClientType };
          }
          return policy; 
        })
      );

      setPolicies(policiesWithInsuredNames);
      setFilteredPolicies(policiesWithInsuredNames);
    } catch (error) {
      message.error('Failed to fetch policies');
    }
  };

  const fetchPolicyTypes = async () => {
    try {
      const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurancepolicytypes');
      const policyTypesData = response.data;

      const policyTypesMap = {};
      policyTypesData.forEach(type => {
        policyTypesMap[type.PolicyTypeID] = type.Ptype; 
      });

      setPolicyTypes(policyTypesMap);
    } catch (error) {
      message.error('Failed to fetch policy types');
    }
  };

  const fetchInsuredName = async (client) => {
    const personsData = {};
    const organizationsData = {};

    try {
      const personsResponse = await axios.get(`https://bminsurancebrokers.com/imlserver/persons`);
      personsResponse.data.forEach(person => {
        personsData[person.PersonID] = person.Name; 
      });

      const organizationsResponse = await axios.get(`https://bminsurancebrokers.com/imlserver/organizations`);
      organizationsResponse.data.forEach(org => {
        organizationsData[org.OrganizationID] = org.Name; 
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      return 'Unknown'; 
    }

    return client.ClientType === 'Person'
      ? personsData[client.PersonID] || 'Unknown' 
      : organizationsData[client.OrganizationID] || 'Unknown'; 
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = policies.filter((policy) =>
      (policy.PolicyNo && policy.PolicyNo.toLowerCase().includes(value.toLowerCase())) ||
      (policy.NameOfInsured && policy.NameOfInsured.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPolicies(filtered);
  };

  const handleFilterByClientType = (value) => {
    setClientTypeFilter(value);
    filterPolicies(value, policyTypeFilter);
  };

  const handleFilterByPolicyType = (value) => {
    setPolicyTypeFilter(value);
    filterPolicies(clientTypeFilter, value);
  };

  const filterPolicies = (clientType, policyType) => {
    const filtered = policies.filter((policy) => {
      const matchesClientType = clientType === '' || policy.ClientType === clientType;
      const matchesPolicyType = policyType === '' || policy.PolicyType === policyType;
      return matchesClientType && matchesPolicyType;
    });
    setFilteredPolicies(filtered);
  };

  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPolicy(null);
  };

  const handleViewObjectDetails = async (policy) => {
    try {
      // Fetch all insurable objects
      const response = await axios.get(`https://bminsurancebrokers.com/imlserver/insurableobjects`);
      const insurableObjects = response.data;
  
      // Filter the insurable objects that match the PolicyID
      const filteredObjects = insurableObjects.filter(obj => obj.PolicyID === policy.PolicyID);
  
      const objectDetails = []; // Initialize an array to hold the object details
  console.log(filteredObjects)
      // Use a for loop to fetch details for each filtered object sequentially
      for (const obj of filteredObjects) {
        // Construct the URL correctly using backticks
        const objectResponse = await axios.get(`https://bminsurancebrokers.com/imlserver/${obj.ObjectType}/${obj.ObjectID}`);
        
        // Merge the details with the original object
        objectDetails.push({ ...obj, details: objectResponse.data });
      
        // This line is not needed if you are already filtering the `filteredObjects`
        // If you need to log the object ID, you can log it here
        console.log(`Fetched details from: https://bminsurancebrokers.com/imlserver/${obj.ObjectType}/${obj.ObjectID}`);
      }
      
    
      setSelectedObject(objectDetails); // Set the object details
      setIsObjectModalVisible(true); // Show the object modal
    } catch (error) {
      message.error('Failed to fetch object details');
    }
  };
  
  

  const handleObjectModalClose = () => {
    setIsObjectModalVisible(false);
    setSelectedObject(null);
  };

  const updatedFilteredPolicies = filteredPolicies.map(policy => ({
    ...policy,
    PolicyType: policyTypes[policy.PolicyType] || 'Unknown', 
  }));

  const columns = [
    { title: 'Policy No', dataIndex: 'PolicyNo', key: 'PolicyNo' },
    { title: 'Policy Type', dataIndex: 'PolicyType', key: 'PolicyType' },
    { title: 'Name of Insured', dataIndex: 'NameOfInsured', key: 'NameOfInsured' },
    { title: 'Premium', dataIndex: 'Premium', key: 'Premium' },
    { title: 'Geographical Area', dataIndex: 'GeographicalArea', key: 'GeographicalArea' },
    { title: 'Period Start', dataIndex: 'PeriodStart', key: 'PeriodStart' },
    { title: 'Period End', dataIndex: 'PeriodEnd', key: 'PeriodEnd' },
    { title: 'Client Type', dataIndex: 'ClientType', key: 'ClientType' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          <Button type="default" onClick={() => handleViewObjectDetails(record)}>
            View Object Details
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Insurance Policies</h2>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Policy No or Name of Insured"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300, marginRight: 16 }}
        />

        <Select
          placeholder="Filter by Client Type"
          value={clientTypeFilter}
          onChange={handleFilterByClientType}
          style={{ width: 200, marginRight: 16 }}
        >
          <Option value="">All</Option>
          <Option value="Person">Person</Option>
          <Option value="Organization">Organization</Option>
        </Select>

        <Select
          placeholder="Filter by Policy Type"
          value={policyTypeFilter}
          onChange={handleFilterByPolicyType}
          style={{ width: 200 }}
        >
          <Option value="">All</Option>
          {Object.entries(policyTypes).map(([id, name]) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <Table columns={columns} dataSource={updatedFilteredPolicies} rowKey="PolicyID" />

      {selectedPolicy && (
        <Modal
          title={`Policy Details - ${selectedPolicy.PolicyNo}`}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <p><strong>Policy No:</strong> {selectedPolicy.PolicyNo}</p>
          <p><strong>Policy Type:</strong> {selectedPolicy.PolicyType}</p>
          <p><strong>Name of Insured:</strong> {selectedPolicy.NameOfInsured}</p>
          <p><strong>Premium:</strong> {selectedPolicy.Premium}</p>
          <p><strong>Geographical Area:</strong> {selectedPolicy.GeographicalArea}</p>
          <p><strong>Period Start:</strong> {selectedPolicy.PeriodStart}</p>
          <p><strong>Period End:</strong> {selectedPolicy.PeriodEnd}</p>
          <p><strong>Client Type:</strong> {selectedPolicy.ClientType}</p>
        </Modal>
      )}

      {/* Modal to display insurable object details */}
      <Modal
        title="Object Details"
        visible={isObjectModalVisible}
        onCancel={handleObjectModalClose}
        footer={null}
      >
        {selectedObject ? (
          selectedObject.map((obj, index) => (
            <div key={index}>
              <h4>{obj.ObjectType} Details</h4>
              <p><strong>ID:</strong> {obj.ObjectID}</p>
              <p><strong>Details:</strong> {JSON.stringify(obj.details)}</p> {/* Displaying raw object details */}
            </div>
          ))
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default ViewInsurancePolicyPage;
