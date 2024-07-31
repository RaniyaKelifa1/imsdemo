// src/components/EditVehicle.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';

function EditVehicle() {
  const [vehicle, setVehicle] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const { idEdit } = location.state || {};
  const [form, setForm] = useState({
    license_plate: '',
    model: '',
    manufacturer: '',
    year: '',
    chassis_number: '',
    engine_number: '',
    cc: '',
    vehicle_type: '',
    owner_id: '',
    company_id: '',
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  var vehicles = []; // Array to store vehicle data

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get('http://localhost:3001/vehicles');
        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].id === idEdit) {
            vehicles.push(response.data[index]);
            setVehicle(response.data[index]);
            setForm(response.data[index]);
            break; // Exit loop once vehicle is found
          }
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        setAlertMessage('Error fetching vehicle data.');
        setAlertType('error');
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setAlertMessage('Error fetching companies.');
        setAlertType('error');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAlertMessage('Error fetching users.');
        setAlertType('error');
      }
    };

    if (idEdit) {
      fetchVehicle();
    }
    fetchCompanies();
    fetchUsers();
  }, [idEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [name]: value };
      const updatedFields = vehicle
        ? Object.keys(updatedForm).filter(key => updatedForm[key] !== vehicle[key])
        : Object.keys(updatedForm);
      setEditedFields(updatedFields);
      return updatedForm;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!idEdit) {
      setAlertMessage('Invalid vehicle ID.');
      setAlertType('error');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/vehicles/${idEdit}`, form);
      setAlertMessage('Vehicle details updated successfully!');
      setAlertType('success');
      navigate('/viewvehicles'); // Adjust navigation as needed
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setAlertMessage('Error updating vehicle. Please try again.');
      setAlertType('error');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage('');
    setAlertType('');
  };

  return (
    <section>
      <div className="container mx-auto px-2">
        <div className="grid md:grid-cols-2 gap-1">
          {/* Edit Vehicle Section */}
          <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Edit Vehicle</h2>
            {alertMessage && (
              <div
                className={`mb-4 p-4 rounded-md text-white ${
                  alertType === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {alertMessage}
                <button onClick={handleAlertClose} className="ml-4">
                  &times;
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
              <input
                type="text"
                name="license_plate"
                value={form.license_plate}
                onChange={handleChange}
                placeholder="Enter license plate"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Enter model"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="Enter manufacturer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Enter year"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="chassis_number"
                value={form.chassis_number}
                onChange={handleChange}
                placeholder="Enter chassis number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="engine_number"
                value={form.engine_number}
                onChange={handleChange}
                placeholder="Enter engine number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="cc"
                value={form.cc}
                onChange={handleChange}
                placeholder="Enter engine capacity (cc)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handleChange}
                placeholder="Enter vehicle type"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <select
                name="owner_id"
                value={form.owner_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select owner</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
              <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditVehicle;
