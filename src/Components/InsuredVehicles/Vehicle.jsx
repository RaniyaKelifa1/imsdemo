import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Vehicles() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
    fetchVehicles();
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

  const fetchVehicles = () => {
    axios.get('http://localhost:3001/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Error fetching vehicles', error));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    if (name === 'company_id') {
      const filtered = users.filter(user => user.company_id === value);
      setFilteredUsers(filtered);
    }
    if (name === 'owner_id') {
      const user = users.find(user => user.id === value);
      if (user) {
        setForm(prevForm => ({ ...prevForm, company_id: user.company_id }));
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3001/vehicles', form)
      .then(() => {
        fetchVehicles();
        navigate('/vehicles');
      })
      .catch(error => console.error('Error adding vehicle', error));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add Vehicle Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">Add Vehicle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <select
                name="owner_id"
                value={form.owner_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800"
              >
                <option value="">Select user</option>
                {filteredUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
                Add Vehicle
              </button>
            </form>
       
          </div>

          {/* List of Vehicles Section */}
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">List of Vehicles</h2>
            <ul className="space-y-4">
              {vehicles.map(vehicle => (
                <li key={vehicle.id} className="p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="text-lg font-semibold text-gray-700">{vehicle.license_plate}</div>
                  <div className="text-sm text-gray-600">{vehicle.model}</div>
                  <div className="text-sm text-gray-600">
                    Company: {companies.find(company => company.id === vehicle.company_id)?.company_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Owner: {users.find(user => user.id === vehicle.owner_id)?.name || 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={() => navigate('/viewvehicles')} className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
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

export default Vehicles;
