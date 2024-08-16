import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function EditIndividual() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address_city: '',
    address_subcity: '',
    address_wereda: '',
    address_houseno: '',
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const location = useLocation();
  const { idEdit } = location.state || {};

  useEffect(() => {
    const fetchIndividual = async () => {
      if (!idEdit) return;
      try {
        const response = await axios.get('/https://bminsurancebrokers.com/imlservertwo/clients');
        console.log('Fetched Data:', response.data);
        const individualData = response.data.find(item => item.ClientID === idEdit);
        console.log('Individual Data:', individualData);

        if (individualData) {
          setForm(individualData);
          console.log(form.address_city)
        } else {
          setAlertMessage('Individual not found.');
          setAlertType('error');
        }
      } catch (error) {
        console.error('Error fetching individual data:', error.response || error.message);
        setAlertMessage('Error fetching individual data.');
        setAlertType('error');
      }
    };

    fetchIndividual();
  }, [idEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [name]: value };
      const updatedFields = Object.keys(updatedForm).filter(key => updatedForm[key] !== prevForm[key]);
      setEditedFields(updatedFields);
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idEdit) {
      setAlertMessage('Invalid individual ID.');
      setAlertType('error');
      return;
    }

    try {
      await axios.put(`https://bminsurancebrokers.com/imlservertwo/clients/${idEdit}`, form);
      setAlertMessage('Individual details updated successfully!');
      setAlertType('success');
      navigate('/ShowIndividuals'); // Adjust the navigation as needed
    } catch (error) {
      console.error('Error updating individual:', error);
      setAlertMessage('Error updating individual. Please try again.');
      setAlertType('error');
    }
  };

  const handleAlertClose = () => {
    setAlertMessage('');
    setAlertType('');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-textured relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-lg mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">Edit Individual Details</h2>

          {alertMessage && (
            <div
              className={`p-4 mb-4 text-white rounded-lg ${
                alertType === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <p>{alertMessage}</p>
              <button
                onClick={handleAlertClose}
                className="ml-4 text-sm underline"
              >
                Close
              </button>
            </div>
          )}

          {editedFields.length > 0 && (
            <div className="p-4 mb-4 text-blue-500 border border-blue-500 rounded-lg">
              <p>Edited fields:</p>
              <ul>
                {editedFields.map(field => (
                  <li key={field} className="text-sm">{field.replace('_', ' ').toUpperCase()}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mb-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                name="address_city"
                value={form.address_city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                name="address_subcity"
                value={form.address_subcity}
                onChange={handleChange}
                placeholder="Subcity"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                name="address_wereda"
                value={form.address_wereda}
                onChange={handleChange}
                placeholder="Wereda"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                name="address_houseno"
                value={form.address_houseno}
                onChange={handleChange}
                placeholder="House No"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update Individual
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EditIndividual;
