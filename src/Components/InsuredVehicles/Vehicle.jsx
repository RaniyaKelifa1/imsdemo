import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddVehicle = () => {
  const location = useLocation();
  const { policyNo, clientName } = location.state || {};
  const [policyID, setPolicyID] = useState(null);
  const [vehicleCount, setVehicleCount] = useState(1); // Default to 1 vehicle
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicyID = async () => {
      try {
        const response = await axios.get(`/imlservertwo/policies/`);
        const foundPolicy = response.data.find(policy => policy.PolicyNo === policyNo);
        if (foundPolicy) {
          setPolicyID(foundPolicy.PolicyID);
        } else {
          console.error('Policy not found for PolicyNo:', policyNO);
        }
      } catch (error) {
        console.error('Error fetching PolicyID:', error.response ? error.response.data : error.message);
      }
    };

    fetchPolicyID();
  }, [policyNo]);

  useEffect(() => {
    // Initialize the vehicles array based on the number of vehicles
    setVehicles(Array.from({ length: vehicleCount }, () => ({
      MakeAndModel: '',
      Year: '',
      BodyType: '',
      PlateNo: '',
      SerialNo: '',
      SeatCapacity: '',
      SumInsured: '',
      EngineNo: '',
      UseOfVehicle: '',
      CC_HP: '',
      DutyFree: 'No',
      OwnerType: '',
      AdditionalDetails: '',
    })));
  }, [vehicleCount]);

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    setVehicles(prevVehicles => {
      const updatedVehicles = [...prevVehicles];
      updatedVehicles[index] = { ...updatedVehicles[index], [name]: value };
      return updatedVehicles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!policyID) {
      console.error('Policy ID not found');
      return;
    }

    const isValid = vehicles.every(vehicle =>
      vehicle.MakeAndModel &&
      vehicle.Year &&
      vehicle.BodyType &&
      vehicle.PlateNo &&
      vehicle.SerialNo &&
      vehicle.SeatCapacity &&
      vehicle.SumInsured &&
      vehicle.EngineNo &&
      vehicle.UseOfVehicle &&
      vehicle.CC_HP &&
      vehicle.DutyFree &&
      vehicle.OwnerType
    );
  
    if (!isValid) {
      console.error('Please fill out all vehicle fields.');
      return;
    }

    const vehiclesData = vehicles.map(vehicle => ({
      PolicyID: policyID,
      MakeAndModel: vehicle.MakeAndModel ?? null,
      Year: vehicle.Year ?? null,
      BodyType: vehicle.BodyType ?? null,
      PlateNo: vehicle.PlateNo ?? null,
      SerialNo: vehicle.SerialNo ?? null,
      SeatCapacity: vehicle.SeatCapacity ?? null,
      SumInsured: vehicle.SumInsured ?? null,
      EngineNo: vehicle.EngineNo ?? null,
      UseOfVehicle: vehicle.UseOfVehicle ?? null,
      CC_HP: vehicle.CC_HP ?? null,
      DutyFree: vehicle.DutyFree ?? null,
      OwnerType: vehicle.OwnerType ?? null,
      AdditionalDetails: vehicle.AdditionalDetails ?? null,
      Excess: vehicle.Excess ?? null
    }));
  
    try {
      const response = await axios.post('http://localhost:4000/imlservertwo/vehicles', vehiclesData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Vehicles added successfully:', response.data);
      alert('Vehicles added successfully.');
     navigate("/")
    } catch (error) {
      console.error('Error adding vehicles:', error.response ? error.response.data : error.message);
      console.log(vehiclesData[0])
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-textured relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gray-900 p-8 rounded shadow-md max-w-4xl mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-gray-100 text-center">
            Add Vehicles for Policy No: <span className="text-blue-400">{policyNo}</span> - {clientName}
          </h2>
          <div className="mb-8">
            <label htmlFor="vehicleCount" className="text-gray-100">
              Number of Vehicles:
            </label>
            <input
              type="number"
              id="vehicleCount"
              name="vehicleCount"
              value={vehicleCount}
              min="1"
              onChange={(e) => setVehicleCount(parseInt(e.target.value) || 1)}
              className="ml-4 px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-gray-700 mb-6"></div>
            {vehicles.map((vehicle, index) => (
              <div key={index}>
                <h3 className="text-xl text-gray-200 mb-4">Vehicle {index + 1}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="MakeAndModel"
                    value={vehicle.MakeAndModel}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Make and Model"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="number"
                    name="Year"
                    value={vehicle.Year}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Year"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="BodyType"
                    value={vehicle.BodyType}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Body Type"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="PlateNo"
                    value={vehicle.PlateNo}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Plate Number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="SerialNo"
                    value={vehicle.SerialNo}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Serial Number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="number"
                    name="SeatCapacity"
                    value={vehicle.SeatCapacity}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Seat Capacity"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="number"
                    name="SumInsured"
                    value={vehicle.SumInsured}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Sum Insured"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="EngineNo"
                    value={vehicle.EngineNo}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Engine Number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="UseOfVehicle"
                    value={vehicle.UseOfVehicle}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Use of Vehicle"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <input
                    type="text"
                    name="CC_HP"
                    value={vehicle.CC_HP}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="CC/HP"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <select
                    name="DutyFree"
                    value={vehicle.DutyFree || 'No'}
                    onChange={e => handleVehicleChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <input
                    type="text"
                    name="OwnerType"
                    value={vehicle.OwnerType}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Owner Type"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                    <input
                    type="text"
                    name="Excess"
                    value={vehicle.Excess}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Excess"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                  <textarea
                    name="AdditionalDetails"
                    value={vehicle.AdditionalDetails}
                    onChange={e => handleVehicleChange(index, e)}
                    placeholder="Additional Details"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-700 text-gray-100"
                  />
                </div>
                <div className="border-b border-gray-700 my-6"></div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddVehicle;
