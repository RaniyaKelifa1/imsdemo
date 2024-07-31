import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function AddPolicy() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
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
    sum_insured_including_tax: '',
    premium_own_damage: '',
    premium_third_party: '',
    premium_pvt: '',
    premium_workmen: '',
    premium_bsg: '',
    premium_property_damage: '',
    premium_death: '',
    third_party_extension: false,
    total_premium: '',
    created_at: new Date().toISOString().slice(0, 16) // Initialize with current date and time
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchVehicles();
    fetchPolicies();
    fetchProviders(); // Fetch insurance providers
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  };

  const fetchVehicles = () => {
    axios.get('http://localhost:3001/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Error fetching vehicles', error));
  };

  const fetchPolicies = () => {
    axios.get('http://localhost:3001/policies')
      .then(response => setPolicies(response.data))
      .catch(error => console.error('Error fetching policies', error));
  };

  const fetchProviders = () => {
    axios.get('http://localhost:3001/insurance_providers') // Adjust the endpoint as necessary
      .then(response => setProviders(response.data))
      .catch(error => console.error('Error fetching providers', error));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'user_id') {
      const filtered = vehicles.filter(vehicle => vehicle.owner_id === value);
      setFilteredVehicles(filtered);
    }
    if (name === 'vehicle_id') {
      // Optionally handle vehicle selection
    }
  };

  const handleDateChange = e => {
    setForm(prevForm => ({
      ...prevForm,
      created_at: e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Format created_at to SQL datetime format if needed
    const formattedForm = {
      ...form,
      created_at: form.created_at.replace('T', ' ') // Convert 'T' to space for SQL
    };
    axios.post('http://localhost:3001/policies', formattedForm)
      .then(() => {
        fetchPolicies();
        navigate('/policies');
      })
      .catch(error => console.error('Error adding policy', error));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Policy Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">Add Policy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Existing form fields */}
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
                rows="4"
              />
              <select
                name="provider_id"
                value={form.provider_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select provider</option>
                {providers.map(provider => (
                  <option key={provider.insurance_provider_id} value={provider.insurance_provider_id}>
                    {provider.company_name}
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
                {filteredVehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.license_plate}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter policy category"
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
                <label>Reinsured</label>
              </div>
              <input
                type="number"
                name="renewal_count"
                value={form.renewal_count}
                onChange={handleChange}
                placeholder="Enter renewal count"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                placeholder="Enter company ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
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
                <label>Third Party Extension</label>
              </div>
              <input
                type="number"
                name="total_premium"
                value={form.total_premium}
                onChange={handleChange}
                placeholder="Enter total premium"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <div>
                <label>Created At:</label>
                <input
                  type="datetime-local"
                  name="created_at"
                  value={form.created_at}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
                Add Policy
              </button>
            </form>
            <div className="mt-4 flex justify-between">
              <button onClick={() => navigate('/previous-page')} className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                <FaArrowLeft className="mr-2" />
                Previous
              </button>
              <button onClick={() => navigate('/policies')} className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                Next
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          {/* List of Policies Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">List of Policies</h2>
            <ul className="space-y-4">
              {policies.map(policy => (
                <li key={policy.policy_id} className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="text-lg font-semibold text-gray-700">{policy.policy_name}</div>
                  <div className="text-sm text-gray-600">{policy.policy_details}</div>
                  <div className="text-sm text-gray-600">
                    Provider: {providers.find(provider => provider.insurance_provider_id === policy.provider_id)?.company_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Vehicle: {vehicles.find(vehicle => vehicle.id === policy.vehicle_id)?.license_plate || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    User: {users.find(user => user.id === policy.user_id)?.name || 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={() => navigate('/view-policies')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                <FaEye className="mr-2" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddPolicy;
