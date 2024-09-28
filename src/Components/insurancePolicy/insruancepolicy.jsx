import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, InputNumber, Button, DatePicker, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const AddInsurancePolicy = () => {
  const location = useLocation();
  const { selectedVehicleId,objectTypes } = location.state || {};
  const { selectedCompensationId, objectType  } = location.state || {};
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [policyTypes, setPolicyTypes] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState(null); // State for selected ClientID
  const [clientType, setClientType] = useState(''); // State for client type
  const [selectedArea, setSelectedArea] = useState('');
  const [otherArea, setOtherArea] = useState('');
 
  let ObjType = objectType || objectTypes || "Undefined"; // Simplified logic
  let ObjID = selectedVehicleId || selectedCompensationId; // Simplified logic
  const handleAreaChange = (value) => {
    setSelectedArea(value);
    if (value !== 'Others') {
      setOtherArea(''); // Reset "Others" field if another option is selected
    }
  };
  const generatePolicyNumber = () => {
    return `BM-${Date.now()}`;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurance-companies');
        setCompanies(response.data);
      } catch (error) {
        message.error('Failed to fetch companies');
      }
    };

    const fetchPolicyTypes = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurancepolicytypes');
        setPolicyTypes(response.data);
      } catch (error) {
        message.error('Failed to fetch policy types');
      }
    };

    fetchCompanies();
    fetchPolicyTypes();
    
    form.setFieldsValue({ PolicyNo: generatePolicyNumber() });
  }, [form]);

  // Fetch clients based on selected client type
  const fetchClients = async (type) => {
    try {
      const endpoint = type === 'person' ? 'https://bminsurancebrokers.com/imlserver/persons' : 'https://bminsurancebrokers.com/imlserver/organizations';
      const response = await axios.get(endpoint);
      setClients(response.data);
    } catch (error) {
      message.error(`Failed to fetch ${type} clients`);
    }
  };

  const handleClientTypeChange = (value) => {
    setClientType(value);
    setClients([]); // Reset clients
    setSelectedClientID(null); // Reset selected client ID
    if (value) {
      fetchClients(value);
    }
  };

  const handleClientSelect = async (value) => {
    try {
      const endpoint = `https://bminsurancebrokers.com/imlserver/clients`;
      const response = await axios.get(endpoint);
      const data = response.data;
  console.log(clientType)
      if (Array.isArray(data) && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const client = data[i];
  
          // Check if clientType is organization and matches the provided OrganizationID
          if (clientType === 'organization' && client.OrganizationID === value) {
            setSelectedClientID(client.ClientID); // Set the ClientID for organization
            break; // Exit loop after setting the valid ClientID
          }
          
          // Check if clientType is person and matches the provided PersonID
          if (clientType === 'person' && client.PersonID === value) {
            setSelectedClientID(client.ClientID); // Set the ClientID for person
            break; // Exit loop after setting the valid ClientID
          }
        }
      } else {
        console.error('No clients found for the given ID');
      }
  
      console.log('Selected ClientID:', selectedClientID);
    } catch (error) {
      console.error('Error fetching ClientID:', error);
    }
  };


  if (!objectTypes){
ObjType == objectType
  }else if(!objectType){
    ObjType == objectTypes
  }else{
    ObjType ="Undefined"
  }

 

  const handleSubmit = async (values) => {
    try {
      const data = {
        PolicyNo: values.PolicyNo,
        ExternalPolicyNo: values.ExternalPolicyNo,
        PolicyType: values.PolicyType,
        Premium: parseFloat(values.Premium),
        GeographicalArea: values.GeographicalArea,
        PeriodStart: values.PeriodStart.format('YYYY-MM-DD'),
        PeriodEnd: values.PeriodEnd.format('YYYY-MM-DD'),
        RenewalDate: values.RenewalDate.format('YYYY-MM-DD'),
        PolicyStatus: values.PolicyStatus,
        CreatedBy: values.CreatedBy,
        CreatedOn: moment().format('YYYY-MM-DD'),
        IsDeleted: values.IsDeleted ? 1 : 0,
        ClientID: selectedClientID, // Send the selected ClientID
        CompanyID: values.CompanyID,
        Branch: values.Branch,
        VehicleID: ObjID,
        objectTypes: ObjType,
        Commission: values.Commission
      };

      await axios.post('https://bminsurancebrokers.com/imlserver/policies', data);
      message.success('Insurance Policy added successfully!');
      form.resetFields();
      form.setFieldsValue({ PolicyNo: generatePolicyNumber() });
      setSelectedClientID(null); // Reset selected ClientID after submission
    } catch (error) {
      console.error('Error adding insurance policy:', error);
      message.error('Failed to add insurance policy');
    }
  };

  return (
    <Form
      form={form}
      name="add-insurance"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ width: '100%', maxWidth: '600px' }}
    >
      <Form.Item
        name="PolicyNo"
        label="Policy Number"
        rules={[{ required: true, message: 'Policy Number is auto-generated.' }]}
      >
        <Input placeholder={generatePolicyNumber()} disabled />
      </Form.Item>

      <Form.Item
        name="ExternalPolicyNo"
        label="External Policy Number"
        rules={[{ required: true, message: 'Please enter the external policy number' }]}
      >
        <Input placeholder="Enter External Poliicy Number" />
      </Form.Item>

      <Form.Item
        name="PolicyType"
        label="Policy Type"
        rules={[{ required: true, message: 'Please select the policy type' }]}
      >
        <Select placeholder="Select Policy Type">
          {policyTypes.map(type => (
            <Option key={type.PolicyTypeID} value={type.PolicyTypeID}>
              {type.Ptype}
            </Option>
          ))}
        </Select>
      </Form.Item>


      <Form.Item
        name="ClientType"
        label="Client Type"
        rules={[{ required: true, message: 'Please select a client type' }]}
      >
        <Select placeholder="Select Client Type" onChange={handleClientTypeChange}>
          <Option value="person">Person</Option>
          <Option value="organization">Organization</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="ClientID"
        label="Client"
        rules={[{ required: true, message: 'Please select a client' }]}
      >
      <Select placeholder="Select Client" onChange={handleClientSelect} disabled={!clientType}>
  {clients.map((client, index) => {
    const clientKey = client[clientType === 'organization' ? 'OrganizationID' : 'PersonID'] || `client-${index}`;
    const clientValue = client[clientType === 'organization' ? 'OrganizationID' : 'PersonID'];
    
    return (
      <Option key={clientKey} value={clientValue}>
        {client.Name} {/* Ensure 'Name' is a valid property in your client object */}
      </Option>
    );
  })}
</Select>

      </Form.Item>

      <Form.Item
        name="CompanyID"
        label="Company"
        rules={[{ required: true, message: 'Please select a company' }]}
      >
        <Select placeholder="Select Company">
          {companies.map(company => (
            <Option key={company.CompanyID} value={company.CompanyID}>
              {company.CompanyName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="Branch"
        label="Branch"
        rules={[{ required: true, message: 'Please enter the branch' }]}
      >
        <Input placeholder="Enter Branch" />
      </Form.Item>

      <Form.Item
        name="Premium"
        label="Premium"
        rules={[{ required: true, message: 'Please enter the premium amount' }]}
      >
        <InputNumber placeholder="Enter Premium" style={{ width: '100%' }} />
      </Form.Item>

      
      <Form.Item
            name="Commission"
            label="Commission"
            rules={[{ required: true, message: 'Please enter the Commission' }]}
          >
            <Input placeholder="Enter Commission" />
          </Form.Item>
      <Form.Item
        name="PeriodStart"
        label="Period Start"
        rules={[{ required: true, message: 'Please select the period start date' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        name="PeriodEnd"
        label="Period End"
        rules={[{ required: true, message: 'Please select the period end date' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        name="RenewalDate"
        label="Renewal Date"
        rules={[{ required: true, message: 'Please select the renewal date' }]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        name="PolicyStatus"
        label="Policy Status"
        rules={[{ required: true, message: 'Please enter the policy status' }]}
      >
        <Input placeholder="Enter Policy Status" />
      </Form.Item>

      <Form.Item
  name="CreatedBy"
  label="Created By"
  rules={[{ required: true, message: 'Please select the creator\'s name' }]}
>
  <Select placeholder="Select Creator">
    <Option value="direct">Direct</Option>
    <Option value="salesPerson">Sales Person</Option>
  </Select>
</Form.Item>
<Form.Item
        name="GeographicalArea"
        label="Geographical Area"
        rules={[{ required: false, message: 'Please select a geographical area' }]}
      >
        <Select
          placeholder="Select Geographical Area"
          value={selectedArea}
          onChange={handleAreaChange}
          style={{ width: '100%' }}
        >
          <Option value="Ethiopia">Ethiopia</Option>
          <Option value="Ethiopia & Djibuti">Ethiopia & Djibouti</Option>
          <Option value="Ethiopia & Kenya">Ethiopia & Kenya</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>

      {selectedArea === 'Others' && (
        <Form.Item
          name="OtherGeographicalArea"
          label="Please specify"
          rules={[{ required: true, message: 'Please specify the geographical area' }]}
        >
          <Input
            placeholder="Enter geographical area"
            value={otherArea}
            onChange={(e) => setOtherArea(e.target.value)}
            style={{ width: '100%' }}
          />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Add Insurance Policy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddInsurancePolicy;
