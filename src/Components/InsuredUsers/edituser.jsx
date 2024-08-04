// src/components/EditUser.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';

function EditUser() {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const location = useLocation();
  const { idEdit } = location.state || {};
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: '',
    status: '',
    company_id: '',
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  var users = []; // Array to store user data

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/users');
        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].id === idEdit) {
            users.push(response.data[index]);
            setUser(response.data[index]);
            setForm(response.data[index]);
            break; // Exit loop once user is found
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAlertMessage('Error fetching user data.');
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

    if (idEdit) {
      fetchUser();
    }
    fetchCompanies();
  }, [idEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [name]: value };
      const updatedFields = user
        ? Object.keys(updatedForm).filter(key => updatedForm[key] !== user[key])
        : Object.keys(updatedForm);
      setEditedFields(updatedFields);
      return updatedForm;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!idEdit) {
      setAlertMessage('Invalid user ID.');
      setAlertType('error');
      return;
    }

    try {
      await axios.put(`https://bminsurancebrokers.com/imlserver/users/${idEdit}`, form);
      setAlertMessage('User details updated successfully!');
      setAlertType('success');
      navigate('/viewusers'); // Adjust navigation as needed
    } catch (error) {
      console.error('Error updating user:', error);
      setAlertMessage('Error updating user. Please try again.');
      setAlertType('error');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage('');
    setAlertType('');
  };

  return (
    <section>
      <div className="container mx-auto px-2=">
        <div className="grid md:grid-cols-2 gap-1">
          {/* Edit User Section */}
          <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Edit User</h2>
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
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter user name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Enter role"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              />
              <input
                type="text"
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Enter status"
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
              <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
                Save Changes
              </button>
            </form>
           
          </div>

          {/* List of Users Section */}
        
        </div>
      </div>
    </section>
  );
}

export default EditUser;
