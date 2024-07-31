import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function AddClaim() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [form, setForm] = useState({
    claim_date: new Date().toISOString().split('T')[0], // Automatically set to current date
    claim_details: '',
    user_id: '',
    vehicle_id: '',
    policy_id: '',
    amount: '',
    status: 'Pending', // Default status
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchVehicles();
    fetchPolicies();
    fetchClaims();
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

  const fetchClaims = () => {
    axios.get('http://localhost:3001/claims')
      .then(response => setClaims(response.data))
      .catch(error => console.error('Error fetching claims', error));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));

    if (name === 'user_id') {
      const filtered = vehicles.filter(vehicle => vehicle.owner_id === value);
      setFilteredVehicles(filtered);
    }

    if (name === 'vehicle_id') {
      const filtered = policies.filter(policy => policy.vehicle_id === value);
      setFilteredPolicies(filtered);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3001/claims', form)
      .then(() => {
        fetchClaims();
        navigate('/claims');
      })
      .catch(error => console.error('Error adding claim', error));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Claim Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">Add Claim</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                name="claim_date"
                value={form.claim_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                hidden // Automatically set to current date
              />
              <textarea
                name="claim_details"
                value={form.claim_details}
                onChange={handleChange}
                placeholder="Enter claim details"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
                rows="4"
              />
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
              <select
                name="policy_id"
                value={form.policy_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select policy</option>
                {filteredPolicies.map(policy => (
                  <option key={policy.policy_id} value={policy.policy_id}>
                    {policy.policy_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter claim amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="Pending">Pending</option>
                <option value="Solved">Solved</option>
                <option value="Declined">Declined</option>
              </select>
              <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
                Add Claim
              </button>
            </form>
           
          </div>

          {/* List of Claims Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">List of Claims</h2>
            <ul className="space-y-4">
              {claims.map(claim => (
                <li key={claim.claim_id} className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="text-lg font-semibold text-gray-700">Claim ID: {claim.claim_id}</div>
                  <div className="text-sm text-gray-600">Details: {claim.claim_details}</div>
                  <div className="text-sm text-gray-600">
                    User: {users.find(user => user.id === claim.user_id)?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Vehicle: {vehicles.find(vehicle => vehicle.id === claim.vehicle_id)?.license_plate || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Policy: {policies.find(policy => policy.policy_id === claim.policy_id)?.policy_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Amount: ${claim.amount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {claim.status}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={() => navigate('/viewclaims')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
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

export default AddClaim;
