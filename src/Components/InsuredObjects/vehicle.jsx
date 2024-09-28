import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Layout, InputNumber, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const AddVehicle = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

 

  const handleSubmit = async (values) => {
    console.log('Form values:', values);
    try {
      const response = await fetch('https://bminsurancebrokers.com/imlserver/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      message.success('Vehicle added successfully!');
      form.resetFields();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      message.error('Failed to add vehicle');
    }
  };

  const handleViewVehicle = () => {
    navigate('/dashboard/Viewveh');
  };

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Title level={2} style={{ color: '#001529' }}>Add Vehicle</Title>
        <Form.Item>
          <Button
            onClick={handleViewVehicle}
            style={{ width: '100%', maxWidth: '500px', backgroundColor: '#008080', color: '#ffffff' }}
            block
          >
            View Vehicles
          </Button>
        </Form.Item>

        <Form
          form={form}
          name="add-vehicle"
          onFinish={handleSubmit}
          layout="vertical"
          style={{ width: '100%', maxWidth: '500px' }}
        >
        

          <Form.Item
            name="MakeAndModel"
            label="Make and Model"
            rules={[{ required: true, message: 'Please enter the Make and Model' }]}
          >
            <Input placeholder="Enter Make and Model" />
          </Form.Item>

          <Form.Item
            name="Year"
            label="Year"
            rules={[
              { required: true, message: 'Please enter the Year' },
              { type: 'number', min: 1900, max: new Date().getFullYear(), message: 'Year must be between 1900 and the current year' },
            ]}
          >
            <InputNumber placeholder="Enter Year" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="BodyType"
            label="Body Type"
            rules={[{ required: true, message: 'Please enter the Body Type' }]}
          >
            <Input placeholder="Enter Body Type" />
          </Form.Item>

          <Form.Item
            name="PlateNo"
            label="Plate No"
            rules={[{ required: true, message: 'Please enter the Plate No' }]}
          >
            <Input placeholder="Enter Plate No" />
          </Form.Item>

          <Form.Item
            name="SerialNoOrChassisNo"
            label="Serial/Chassis No"
            rules={[{ required: true, message: 'Please enter the Serial/Chassis No' }]}
          >
            <Input placeholder="Enter Serial or Chassis No" />
          </Form.Item>
        
          <Form.Item
            name="Excess"
            label="Excess"
            rules={[{ required: true, message: 'Please enter the Excess' }]}
          >
            <Input placeholder="Enter Excess" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="SeatCapacity"
            label="Seat Capacity"
            rules={[{ required: true, message: 'Please enter the Seat Capacity' }]}
          >
            <InputNumber placeholder="Enter Seat Capacity" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="SumInsured"
            label="Sum Insured"
            rules={[{ required: true, message: 'Please enter the Sum Insured' }]}
          >
            <InputNumber placeholder="Enter Sum Insured" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="EngineNo"
            label="Engine No"
            rules={[{ required: true, message: 'Please enter the Engine No' }]}
          >
            <Input placeholder="Enter Engine No" />
          </Form.Item>

          <Form.Item
            name="UseOfVehicle"
            label="Use of Vehicle"
            rules={[{ required: true, message: 'Please enter the Use of Vehicle' }]}
          >
            <Input placeholder="Enter Use of Vehicle" />
          </Form.Item>

          <Form.Item
            name="CC_HP"
            label="CC/HP"
            rules={[{ required: true, message: 'Please enter the CC/HP' }]}
          >
            <Input placeholder="Enter CC/HP" />
          </Form.Item>

          <Form.Item
            name="DutyFree"
            label="Duty Free"
            rules={[{ required: true, message: 'Please select Duty Free status' }]}
          >
            <Select placeholder="Select Duty Free Status">
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="Condition"
            label="Condition"
            rules={[{ required: true, message: 'Please enter the Condition' }]}
          >
            <Input placeholder="Enter Condition (New/Used)" />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Vehicle
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default AddVehicle;
