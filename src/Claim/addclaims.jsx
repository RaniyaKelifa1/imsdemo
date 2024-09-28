import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddClaim = () => {
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [form, setForm] = useState({
    DateOfAccident: new Date().toISOString().split('T')[0],
    NatureOfAccident: '',
    PlaceOfAccident: '',
    IsThirdPartyInvolved: 'No',
    ThirdPartyName: '',
    ThirdPartyPhoneNumber: '',
    DriverLicenseNo: '',
    DriverLevel: '',
    ClaimStatus: 'Notified',
    NotifiedDate: new Date().toISOString().split('T')[0],
    WorkInOrderDate: '',
    SettledDate: '',
    SeasonalStatusReport: '',
    PolicyID: '',
    VehicleID: '',
    ClientID: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
    fetchVehicles();
    fetchPolicies();
  }, []);

  const fetchClients = () => {
    axios.get('http://localhost:4000/imlservertwo/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Error fetching clients', error));
  };

  const fetchVehicles = () => {
    axios.get('http://localhost:4000/imlservertwo/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Error fetching vehicles', error));
  };

  const fetchPolicies = () => {
    axios.get('http://localhost:4000/imlservertwo/policies')
      .then(response => setPolicies(response.data))
      .catch(error => console.error('Error fetching policies', error));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));

    if (name === 'ClientID') {
      const filtered = policies.filter(policy => policy.ClientID === value);
      setFilteredPolicies(filtered);
      setForm(prevForm => ({
        ...prevForm,
        PolicyID: '',
        VehicleID: '',
      }));
      setFilteredVehicles([]);
    }

    if (name === 'PolicyID') {
      const filtered = vehicles.filter(vehicle => vehicle.PolicyID === value);
      setFilteredVehicles(filtered);
      setForm(prevForm => ({
        ...prevForm,
        VehicleID: '',
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:4000/imlservertwo/claims', form)
      .then(() => {
        navigate('/claims');
      })
      .catch(error => console.error('Error adding claim', error));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-800 relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-4xl mx-auto">
          
          <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">
            Add Claim
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                  <select
                    name="ClientID"
                    value={form.ClientID}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.ClientID} value={client.ClientID}>
                        {client.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    name="PolicyID"
                    value={form.PolicyID}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    disabled={!form.ClientID}
                  >
                    <option value="">Select Policy</option>
                    {filteredPolicies.map(policy => (
                      <option key={policy.PolicyID} value={policy.PolicyID}>
                        {policy.PolicyNo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    name="VehicleID"
                    value={form.VehicleID}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    disabled={!form.PolicyID}
                  >
                    <option value="">Select Vehicle</option>
                    {filteredVehicles.map(vehicle => (
                      <option key={vehicle.VehicleID} value={vehicle.VehicleID}>
                        {vehicle.RegistrationNo}
                      </option>
                    ))}
                  </select>
                </div>
                  <label htmlFor="DateOfAccident" className="block text-gray-100">Date of Accident</label>
                  <input
                    type="date"
                    name="DateOfAccident"
                    value={form.DateOfAccident}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
              
                <div>
                  <label htmlFor="NatureOfAccident" className="block text-gray-100">Nature of Accident</label>
                  <textarea
                    name="NatureOfAccident"
                    value={form.NatureOfAccident}
                    onChange={handleChange}
                    placeholder="Describe the nature of the accident"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    rows="3"
                  />
                </div>
                <div>
                  <label htmlFor="PlaceOfAccident" className="block text-gray-100">Place of Accident</label>
                  <input
                    type="text"
                    name="PlaceOfAccident"
                    value={form.PlaceOfAccident}
                    onChange={handleChange}
                    placeholder="Enter the place of the accident"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="IsThirdPartyInvolved" className="block text-gray-100">Is Third Party Involved?</label>
                  <select
                    name="IsThirdPartyInvolved"
                    value={form.IsThirdPartyInvolved}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {form.IsThirdPartyInvolved === 'Yes' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="ThirdPartyName" className="block text-gray-100">Third Party Name</label>
                      <input
                        type="text"
                        name="ThirdPartyName"
                        value={form.ThirdPartyName}
                        onChange={handleChange}
                        placeholder="Enter third party name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="ThirdPartyPhoneNumber" className="block text-gray-100">Third Party Phone Number</label>
                      <input
                        type="text"
                        name="ThirdPartyPhoneNumber"
                        value={form.ThirdPartyPhoneNumber}
                        onChange={handleChange}
                        placeholder="Enter third party phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="DriverLicenseNo" className="block text-gray-100">Driver License Number</label>
                  <input
                    type="text"
                    name="DriverLicenseNo"
                    value={form.DriverLicenseNo}
                    onChange={handleChange}
                    placeholder="Enter driver license number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="DriverLevel" className="block text-gray-100">Driver Level</label>
                  <input
                    type="text"
                    name="DriverLevel"
                    value={form.DriverLevel}
                    onChange={handleChange}
                    placeholder="Enter driver level"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="ClaimStatus" className="block text-gray-100">Claim Status</label>
                  <select
                    name="ClaimStatus"
                    value={form.ClaimStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  >
                    <option value="Notified">Notified</option>
                    <option value="Work in Order">Work in Order</option>
                    <option value="Settled">Settled</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="NotifiedDate" className="block text-gray-100">Notified Date</label>
                    <input
                      type="date"
                      name="NotifiedDate"
                      value={form.NotifiedDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="WorkInOrderDate" className="block text-gray-100">Work In Order Date</label>
                    <input
                      type="date"
                      name="WorkInOrderDate"
                      value={form.WorkInOrderDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="SettledDate" className="block text-gray-100">Settled Date</label>
                    <input
                      type="date"
                      name="SettledDate"
                      value={form.SettledDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="SeasonalStatusReport" className="block text-gray-100">Seasonal Status Report</label>
                  <input
                    type="text"
                    name="SeasonalStatusReport"
                    value={form.SeasonalStatusReport}
                    onChange={handleChange}
                    placeholder="Enter seasonal status report"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
           
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Add Claim
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddClaim;
