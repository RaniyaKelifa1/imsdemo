import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './addclient.css'; // Import the CSS file for additional styles

const AddClient = () => {
  const [clientType, setClientType] = useState('Individual');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address_city: '',
    address_subcity: '',
    address_wereda: '',
    address_houseno: '',
    contactPerson: '',
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleClientTypeChange = (e) => {
    setClientType(e.target.value);
    setForm(prevForm => ({
      ...prevForm,
      contactPerson: '' // Clear contactPerson when changing to Individual
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/imlservertwo/clients', { ...form, clientType }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate('/'); // Redirect to the clients list page or a confirmation page
    } catch (error) {
      if (error.response && error.response.data) {
        // Parse and set validation errors
        const errors = error.response.data.errors || {};
        setError(errors);
      } else {
        setError({ general: 'Error adding client. Please try again.' });
      }
      console.error('Error adding client', error.response ? error.response.data : error.message);
    }
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-textured relative">
      <div className="absolute inset-0  z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-lg mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">Add Client</h2>
          {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row">
              <select
                value={clientType}
                onChange={handleClientTypeChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
            </div>

            {clientType === 'Company' && (
              <>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                />
                {error.name && <p className="text-red-500 text-sm">{error.name.msg}</p>}
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                />
              </>
            )}

            {clientType === 'Individual' && (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            )}

            {error.name && <p className="text-red-500 text-sm">{error.name.msg}</p>}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
            {error.email && <p className="text-red-500 text-sm">{error.email.msg}</p>}
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
            {error.phoneNumber && <p className="text-red-500 text-sm">{error.phoneNumber.msg}</p>}
            <input
              type="text"
              name="address_city"
              value={form.address_city}
              onChange={handleChange}
              placeholder="City"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="address_subcity"
              value={form.address_subcity}
              onChange={handleChange}
              placeholder="Subcity"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="address_wereda"
              value={form.address_wereda}
              onChange={handleChange}
              placeholder="Wereda"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
            <input
              type="text"
              name="address_houseno"
              value={form.address_houseno}
              onChange={handleChange}
              placeholder="House No"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
            >
              {clientType === 'Individual' ? 'Add Individual' : 'Add Company'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddClient;
