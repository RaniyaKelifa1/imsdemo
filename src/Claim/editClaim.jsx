import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function EditClaim() {
  const [claim, setClaim] = useState(null);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    claim_id: '',
    user_id: '',
    policy_id: '',
    claim_date: '', // Initialize as empty
    status: 'Pending', // Default status
    amount: 0,
    vehicle_id: '',
    claim_details: '',
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const location = useLocation();
  const { idEdit } = location.state || {};

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await axios.get(' /imlservertwo/claims');
        const fetchedClaim = response.data.find(claim => claim.claim_id === idEdit);
        if (fetchedClaim) {
          setClaim(fetchedClaim);
          setForm(prevForm => ({
            ...fetchedClaim,
            claim_date: new Date(fetchedClaim.claim_date).toISOString().split('T')[0], // Convert to "yyyy-MM-dd"
          }));
        }
      } catch (error) {
        console.error('Error fetching claim data:', error);
        setAlertMessage('Error fetching claim data.');
        setAlertType('error');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(' /imlservertwo/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAlertMessage('Error fetching users.');
        setAlertType('error');
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(' /imlservertwo/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setAlertMessage('Error fetching vehicles.');
        setAlertType('error');
      }
    };

    const fetchPolicies = async () => {
      try {
        const response = await axios.get(' /imlservertwo/policies');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
        setAlertMessage('Error fetching policies.');
        setAlertType('error');
      }
    };

    if (idEdit) {
      fetchClaim();
    }
    fetchUsers();
    fetchVehicles();
    fetchPolicies();
  }, [idEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => {
      const updatedForm = {
        ...prevForm,
        [name]: type === 'checkbox' ? checked : value,
      };
      const updatedFields = claim
        ? Object.keys(updatedForm).filter(key => updatedForm[key] !== claim[key])
        : Object.keys(updatedForm);
      setEditedFields(updatedFields);
      return updatedForm;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!idEdit) {
      setAlertMessage('Invalid claim ID.');
      setAlertType('error');
      return;
    }

    try {
      // Ensure the claim_date is in "yyyy-MM-dd" format
      const formattedDate = new Date(form.claim_date).toISOString().split('T')[0];
      const { claim_id, ...updatedData } = { ...form, claim_date: formattedDate };

      await axios.put(` /imlservertwo/claims/${idEdit}`, updatedData);
      setAlertMessage('Claim details updated successfully!');
      setAlertType('success');
      navigate('/viewclaims'); // Adjust navigation as needed
    } catch (error) {
      console.error('Error updating claim:', error);
      setAlertMessage('Error updating claim. Please try again.');
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
          {/* Edit Claim Section */}
          <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Edit Claim</h2>
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
                name="claim_id"
                value={form.claim_id}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
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
                name="policy_id"
                value={form.policy_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select policy</option>
                {policies.map(policy => (
                  <option key={policy.policy_id} value={policy.policy_id}>
                    {policy.policy_name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="claim_date"
                value={form.claim_date}
                onChange={handleChange}
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
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter claim amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
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
              <textarea
                name="claim_details"
                value={form.claim_details}
                onChange={handleChange}
                placeholder="Enter claim details"
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

export default EditClaim;
