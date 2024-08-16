import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MM/dd/yyyy'); // You can change the format here
};

const EditPolicy = () => {
  const [policy, setPolicy] = useState({
    PolicyNo: '',
    clientID: '',
    providerID: '',
    optionID: '',
    branch: '',
    premium: '',
    policyPeriodStart: '',
    policyPeriodEnd: '',
    geographicalArea: '',
    commission: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const { id } = location.state || {};
  const policyID = id;

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!policyID) return;
    
      try {
        const { data } = await axios.get(`/imlservertwo/policies/`);
        console.log('Fetched Data:', data);
        const PolicyClick = data.find(item => item.PolicyID === id);
       
        if (PolicyClick) {
          console.log('PolicyClick Object:', PolicyClick.PolicyPeriodStart);
          setPolicy({
            PolicyNo: PolicyClick.PolicyNo,
            clientID: PolicyClick.clientID || PolicyClick.ClientID,
            providerID: PolicyClick.ProviderID,
            optionID: PolicyClick.OptionID,
            branch: PolicyClick.Branch,
            premium: PolicyClick.Premium,
            policyPeriodStart: formatDate(PolicyClick.PolicyPeriodStart),
            policyPeriodEnd: formatDate(PolicyClick.PolicyPeriodEnd),
            geographicalArea: PolicyClick.GeographicalArea,
            commission: PolicyClick.Commission
          });
          setLoading(false);
        } else {
          console.log('Policy not found.');
        }
      } catch (error) {
        console.error('Error fetching policy data:', error.response || error.message);
      }
    };

    fetchPolicy();
  }, [policyID, id]);

  useEffect(() => {
    if (!loading) {
      console.log('Updated Policy:', policy);
      console.log('Client ID:', policy.policyPeriodStart);
    }
  }, [policy, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPolicy({ ...policy, [name]: value });
  };

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    const newVehicles = [...vehicles];
    newVehicles[index][name] = value;
    setVehicles(newVehicles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/imlservertwo/policies/${policyID}`,policy );
      // navigate('/policies'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error updating policy', error.bodyType);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="min-h-screen flex items-center justify-center bg-textured relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-4xl mx-auto flex">
          <div className="w-full pr-4">
            <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">
              Edit Policy
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="PolicyNo"
                value={policy.PolicyNo}
                onChange={handleInputChange}
                placeholder="Policy Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="text"
                name="clientID"
                value={policy.clientID}
                onChange={handleInputChange}
                placeholder="Client ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="text"
                name="providerID"
                value={policy.providerID}
                onChange={handleInputChange}
                placeholder="Provider ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="text"
                name="optionID"
                value={policy.optionID}
                onChange={handleInputChange}
                placeholder="Option ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="text"
                name="branch"
                value={policy.branch}
                onChange={handleInputChange}
                placeholder="Branch"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="number"
                name="premium"
                value={policy.premium}
                onChange={handleInputChange}
                placeholder="Premium"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
  <div>
  <label>Policy Period Start:</label>
  <input
    type="text"
    name="policyPeriodStart"
    value={policy.policyPeriodStart}
    onChange={handleInputChange}
    className="w-full py-2 px-3 rounded-md"
  />
</div>

<div>
  <label>Policy Period End:</label>
  <input
    type="text"
    name="policyPeriodEnd"
    value={policy.policyPeriodEnd}
    onChange={handleInputChange}
    className="w-full py-2 px-3 rounded-md"
  />
</div>

  
              <input
                type="text"
                name="geographicalArea"
                value={policy.geographicalArea}
                onChange={handleInputChange}
                placeholder="Geographical Area"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <input
                type="number"
                name="commission"
                value={policy.commission}
                onChange={handleInputChange}
                placeholder="Commission"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
              />
  
              <h3 className="text-xl font-semibold mb-4 text-gray-100">Vehicles</h3>
              {vehicles.map((vehicle, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    name="makeAndModel"
                    value={vehicle.makeAndModel || ''}
                    onChange={(e) => handleVehicleChange(index, e)}
                    placeholder="Make and Model"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
  
                  <input
                    type="text"
                    name="year"
                    value={vehicle.year || ''}
                    onChange={(e) => handleVehicleChange(index, e)}
                    placeholder="Year"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
  
                  <input
                    type="text"
                    name="bodyType"
                    value={vehicle.bodyType || ''}
                    onChange={(e) => handleVehicleChange(index, e)}
                    placeholder="Body Type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
  
                  <input
                    type="text"
                    name="plateNumber"
                    value={vehicle.plateNumber || ''}
                    onChange={(e) => handleVehicleChange(index, e)}
                    placeholder="Plate Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
  
                  {/* Add other vehicle fields similarly */}
                </div>
              ))}
  
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Update Policy
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditPolicy;
