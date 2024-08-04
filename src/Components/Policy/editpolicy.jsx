// src/components/EditPolicy.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function EditPolicy() {
  const [policy, setPolicy] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    policy_name: '',
    policy_details: '',
    provider_id: '',
    user_id: '',
    vehicle_id: '',
    category: '',
    reinsured: false,
    renewal_count: 0,
    company_id: '',
    sum_insured_including_tax: 0,
    premium_own_damage: 0,
    premium_third_party: 0,
    premium_pvt: 0,
    premium_workmen: 0,
    premium_bsg: 0,
    premium_property_damage: 0,
    premium_death: 0,
    third_party_extension: false,
    total_premium: 0,
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const location = useLocation();
  const { idEdit } = location.state || {};
  var policies = [];

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/policies');
        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].policy_id === idEdit) {
            policies.push(response.data[index]);
            setPolicy(response.data[index]);
            setForm(response.data[index]);
            break; // Exit loop once policy is found
          }
        }
      } catch (error) {
        console.error('Error fetching policy data:', error);
        setAlertMessage('Error fetching policy data.');
        setAlertType('error');
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setAlertMessage('Error fetching companies.');
        setAlertType('error');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAlertMessage('Error fetching users.');
        setAlertType('error');
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setAlertMessage('Error fetching vehicles.');
        setAlertType('error');
      }
    };

    if (idEdit) {
      fetchPolicy();
    }
    fetchCompanies();
    fetchUsers();
    fetchVehicles();
  }, [idEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => {
      const updatedForm = {
        ...prevForm,
        [name]: type === 'checkbox' ? checked : value,
      };
      const updatedFields = policy
        ? Object.keys(updatedForm).filter(key => updatedForm[key] !== policy[key])
        : Object.keys(updatedForm);
      setEditedFields(updatedFields);
      return updatedForm;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!idEdit) {
      setAlertMessage('Invalid policy ID.');
      setAlertType('error');
      return;
    }

    try {
      await axios.put(`https://bminsurancebrokers.com/imlserver/policies/${idEdit}`, form);
      setAlertMessage('Policy details updated successfully!');
      setAlertType('success');
      navigate('/viewpolicies'); // Adjust navigation as needed
    } catch (error) {
      console.error('Error updating policy:', error);
      setAlertMessage('Error updating policy. Please try again.');
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
          {/* Edit Policy Section */}
          <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Edit Policy</h2>
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
                name="policy_name"
                value={form.policy_name}
                onChange={handleChange}
                placeholder="Enter policy name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <textarea
                name="policy_details"
                value={form.policy_details}
                onChange={handleChange}
                placeholder="Enter policy details"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <select
                name="provider_id"
                value={form.provider_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select provider</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select
                name="vehicle_id"
                value={form.vehicle_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.license_plate} - {vehicle.model}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="reinsured"
                  checked={form.reinsured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-800">Reinsured</label>
              </div>
              <input
                type="number"
                name="renewal_count"
                value={form.renewal_count}
                onChange={handleChange}
                placeholder="Enter renewal count"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
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
              <input
                type="number"
                name="sum_insured_including_tax"
                value={form.sum_insured_including_tax}
                onChange={handleChange}
                placeholder="Enter sum insured including tax"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_own_damage"
                value={form.premium_own_damage}
                onChange={handleChange}
                placeholder="Enter premium for own damage"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_third_party"
                value={form.premium_third_party}
                onChange={handleChange}
                placeholder="Enter premium for third party"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_pvt"
                value={form.premium_pvt}
                onChange={handleChange}
                placeholder="Enter premium for private vehicle"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_workmen"
                value={form.premium_workmen}
                onChange={handleChange}
                placeholder="Enter premium for workmen"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_bsg"
                value={form.premium_bsg}
                onChange={handleChange}
                placeholder="Enter premium for BSG"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_property_damage"
                value={form.premium_property_damage}
                onChange={handleChange}
                placeholder="Enter premium for property damage"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="number"
                name="premium_death"
                value={form.premium_death}
                onChange={handleChange}
                placeholder="Enter premium for death"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="third_party_extension"
                  checked={form.third_party_extension}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-800">Third Party Extension</label>
              </div>
              <input
                type="number"
                name="total_premium"
                value={form.total_premium}
                onChange={handleChange}
                placeholder="Enter total premium"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
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

export default EditPolicy;
