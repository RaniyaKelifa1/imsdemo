import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';



const AddMotorPolicy = () => {
  const MOTOR_VEHICLE_INSURANCE_OPTION_ID = 1; // Assuming 1 is the ID for Motor Vehicle Insurance
  const [form, setForm] = useState({
    PolicyNo: '',
    clientID: '',
    providerID: '',
    optionID: MOTOR_VEHICLE_INSURANCE_OPTION_ID,
    branch: '',
    premium: '',
    policyPeriodStart: '',
    policyPeriodEnd: '',
    geographicalArea: '',
    commission: '',
    vehicleCount: 1,
    vehicles: [],
  });

  const [clients, setClients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [policy, setPolicy] = useState([]);
  const [error, setError] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { idData, policyno } = location.state || {};

  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes,PolicyRes, providersRes] = await Promise.all([
          axios.get('/imlservertwo/clients'),
          axios.get('/imlservertwo/Policies'),
          axios.get('/imlservertwo/insurance-providers'),
        ]);

        const client = clientsRes.data.find(client => client.ClientID === idData);
        if (client) {
          setClientName(client.Name);
        }

        setClients(clientsRes.data);
        setPolicy(PolicyRes.data);
        setProviders(providersRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };

    fetchData();
  }, [idData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const updatedVehicles = [...prevForm.vehicles];
      updatedVehicles[index] = { ...updatedVehicles[index], [name]: value };
      return { ...prevForm, vehicles: updatedVehicles };
    });
  };

  const handleVehicleCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setForm(prevForm => {
      const updatedVehicles = [...prevForm.vehicles];
      if (updatedVehicles.length < count) {
        while (updatedVehicles.length < count) {
          updatedVehicles.push({});
        }
      } else {
        updatedVehicles.splice(count);
      }
      return { ...prevForm, vehicleCount: count, vehicles: updatedVehicles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        clientID: idData,
        vehicles: form.vehicles.slice(0, form.vehicleCount),
      };

      await axios.post('/imlservertwo/policies', data, {
        headers: { 'Content-Type': 'application/json' }
      });
    const policyNo = form.PolicyNo;
    const clientName = clients.find(client => client.ClientID === idData)?.Name;
    console.log(data)
    // console.log(clientName)
    // console.log(policyNo)

    // Navigate to the AddVehicle page with policy ID, policy number, and client name
    navigate('/add-vehicle', { state: { policyNo, clientName } });
      // Handle success, e.g., redirect or show a success message
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data.errors || {};
        setError(errors);
      } else {
        setError({ general: 'Error adding policy. Please try again.' });
      }
      console.error('Error adding policys', error.response ? error.response.data : error.message);
    
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-textured relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-4xl mx-auto flex">
          <div className="w-full pr-4">
            <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">
              Add Motor Policy{' '}
              <span className="text-blue-400 font-semibold">{clientName}</span>
            </h2>
            {error.general && <p className="text-red-500 text-center mb-4">{error.general}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="PolicyNo"
                value={form.PolicyNo}
                onChange={handleChange}
                placeholder="Policy Number"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
              {error.PolicyNo && <p className="text-red-500 text-sm">{error.PolicyNo.msg}</p>}

              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={clientName}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />

              <select
                name="providerID"
                value={form.providerID}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-white"
              >
                <option value="">Select Provider</option>
                {providers.map(provider => (
                  <option key={provider.ProviderID} value={provider.ProviderID}>{provider.Name}</option>
                ))}
              </select>

   

              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Branch"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />

              <input
                type="number"
                name="premium"
                value={form.premium}
                onChange={handleChange}
                placeholder="Premium"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />

              <div className="flex space-x-4">
                <div>
                  <label htmlFor="policyPeriodStart" className="text-gray-100">Policy Start</label>
                  <input
                    type="date"
                    name="policyPeriodStart"
                    value={form.policyPeriodStart}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="policyPeriodEnd" className="text-gray-100">Policy End</label>
                  <input
                    type="date"
                    name="policyPeriodEnd"
                    value={form.policyPeriodEnd}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
              </div>

              <input
                type="text"
                name="geographicalArea"
                value={form.geographicalArea}
                onChange={handleChange}
                placeholder="Geographical Area"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />

              <input
                type="number"
                name="commission"
                value={form.commission}
                onChange={handleChange}
                placeholder="Commission"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />

           

              {form.vehicles.map((vehicle, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    name="MakeAndModel"
                    value={vehicle.MakeAndModel || ''}
                    onChange={(e) => handleVehicleChange(index, e)}
                    placeholder="Make and Model"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  {/* Add more vehicle fields as needed */}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Add Motor Policy
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddMotorPolicy;
