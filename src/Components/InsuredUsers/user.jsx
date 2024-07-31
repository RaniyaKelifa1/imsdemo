import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function User() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    role: '',
    status: '',
    company_id: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  };

  const fetchCompanies = () => {
    axios.get('http://localhost:3001/companies')
      .then(response => setCompanies(response.data))
      .catch(error => console.error('Error fetching companies', error));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3001/users', form)
      .then(() => {
        fetchUsers();
        resetForm();
      })
      .catch(error => console.error('Error creating user', error));
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      phone_number: '',
      role: '',
      status: '',
      company_id: '',
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add User Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">Add User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                Add User
              </button>
            </form>
            <div className="mt-4 flex justify-between">
              <button onClick={() => navigate('/company')} className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                <FaArrowLeft className="mr-2" />
                Previous
              </button>
              <button onClick={() => navigate('/vehicles')} className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                Next
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          {/* List of Users Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">List of Users</h2>
            <ul className="space-y-4">
              {users.map(user => (
                <li key={user.id} className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="text-lg font-semibold text-gray-700">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-sm text-gray-600">
                    Company: {companies.find(company => company.id === user.company_id)?.company_name || 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={() => navigate('/viewusers')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
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

export default User;
