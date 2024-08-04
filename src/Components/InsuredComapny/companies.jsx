import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    company_name: '',
    phone_number: '',
    tin_number: '',
    address: '',
    contact_person: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
  }, []);

  const fetchCompanies = () => {
    axios.get('https://bminsurancebrokers.com/imlserver/companies')
      .then(response => setCompanies(response.data))
      .catch(error => console.error('Error fetching companies', error));
  };

  const fetchUsers = () => {
    axios.get('https://bminsurancebrokers.com/imlserver/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  };

  const getUserCountForCompany = (companyId) => {
    return users.filter(user => user.company_id === companyId).length;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://bminsurancebrokers.com/imlserver/companies', form)
      .then(() => {
        fetchCompanies();
        resetForm();
      })
      .catch(error => console.error('Error creating company', error));
  };

  const resetForm = () => {
    setForm({
      company_name: '',
      phone_number: '',
      tin_number: '',
      address: '',
      contact_person: '',
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Company Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add Insured Company</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
              <input
                type="text"
                name="tin_number"
                value={form.tin_number}
                onChange={handleChange}
                placeholder="Enter TIN number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
              <input
                type="text"
                name="contact_person"
                value={form.contact_person}
                onChange={handleChange}
                placeholder="Enter contact person name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 flex items-center justify-center transition duration-200"
              >
                <p className="mr-2 font-bold">Add Company</p>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Plus Sign</title>
                  <path d="M10 3v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between">
                <button onClick={() => navigate('/company')} className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                  <FaArrowLeft className="mr-2" />
                  Previous
                </button>
                <button onClick={() => navigate('/users')}  className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200">
                  Next
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </div>
          
          {/* List of Companies Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">List of Companies</h2>
            <ul className="space-y-4">
              {companies.map(company => (
                <li key={company.id} className="p-4 bg-gray-50 border border-gray-300 rounded-md">
                  <strong className="text-gray-700">{company.company_name}</strong> - {company.phone_number}
                  <div className="text-sm text-gray-600">Users: {getUserCountForCompany(company.id)}</div>
                  <div className="border-t border-gray-300 mt-4"></div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate('/companylist')}
                className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
              >
                <FaEye className="mr-2" />
                <p className="font-semibold">View</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Company;
