import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { HiDownload } from 'react-icons/hi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const ShowPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [clients, setClients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedPolicyId, setExpandedPolicyId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const clientIdFilter = location.state?.idDatas || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesData, clientsData, providersData, vehiclesData] = await Promise.all([
          axios.get('http://localhost:4000/imlservertwo/policies'),
          axios.get('http://localhost:4000/imlservertwo/clients'),
          axios.get('http://localhost:4000/imlservertwo/insurance-providers'),
          axios.get('http://localhost:4000/imlservertwo/vehicles'),
        ]);

        setPolicies(policiesData.data);
        setClients(clientsData.data);
        setProviders(providersData.data);
        setVehicles(vehiclesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleRowSelect = (policyId) => {
    setSelectedRows((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleRowClick = (policyId) => {
    setExpandedPolicyId((prev) => (prev === policyId ? null : policyId));
  };

  const handleNavigateEdit = (policyId) => {
    navigate('/editPolicy', { state: { id: policyId } });

  };

  const handleDelete = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await axios.delete(`http://localhost:4000/imlservertwo/policies/${policyId}`);
        setPolicies((prev) => prev.filter((policy) => policy.PolicyID !== policyId));
        alert('Policy deleted successfully.');
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Error deleting policy. Please try again.');
      }
    }
  };

  const handleVehicleEdit = (vehicleId) => {
    navigate('/editVehicle', { state: { id: vehicleId } });
  };

  const handleVehicleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(` http://localhost:4000/imlservertwo/vehicles/${vehicleId}`);
        setVehicles((prev) => prev.filter((vehicle) => vehicle.VehicleID !== vehicleId));
        alert('Vehicle deleted successfully.');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Error deleting vehicle. Please try again.');
      }
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const selectedPolicies = policies.filter((policy) => selectedRows.includes(policy.PolicyID));
    const worksheet = XLSX.utils.json_to_sheet(selectedPolicies);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Policies');
    const workbookOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookOut], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected_policies.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.PolicyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.ClientID.toString().includes(searchTerm)
  ).filter((policy) => clientIdFilter === policy.ClientID);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.ClientID === clientId);
    return client ? client.Name : 'Unknown';
  };

  const getProviderName = (providerId) => {
    const provider = providers.find((p) => p.ProviderID === providerId);
    return provider ? provider.Name : 'Unknown';
  };

  const getVehicleDetails = (policyId) => vehicles.filter((vehicle) => vehicle.PolicyID === policyId);

  return (
    <section className="min-h-screen p-4 bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Policies</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by Policy No or Client ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-800 text-white"
            />
            <button
              onClick={exportToExcel}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <HiDownload className="mr-2" />
              Export Selected
            </button>
            <button
             onClick={() =>  navigate('/insurance/Motor-Vehicle', { state: { idData: clientIdFilter} })}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaEdit className="mr-2" />
              Add Policy
            </button>
          </div>
        </div>
        <table className="w-full table-auto bg-gray-800">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-300">
              <th className="px-4 py-2 border-b">Select</th>
              <th className="px-4 py-2 border-b">Policy No</th>
              <th className="px-4 py-2 border-b">Client Name</th>
              <th className="px-4 py-2 border-b">Provider Name</th>
              <th className="px-4 py-2 border-b">Option ID</th>
              <th className="px-4 py-2 border-b">Branch</th>
              <th className="px-4 py-2 border-b">Premium</th>
              <th className="px-4 py-2 border-b">Policy Period Start</th>
              <th className="px-4 py-2 border-b">Policy Period End</th>
              <th className="px-4 py-2 border-b">Geographical Area</th>
              <th className="px-4 py-2 border-b">Commission</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy) => (
                <React.Fragment key={policy.PolicyID}>
                  <tr
                    className={`hover:bg-gray-700 cursor-pointer ${selectedRows.includes(policy.PolicyID) ? 'bg-gray-600' : ''}`}
                    onClick={() => handleRowClick(policy.PolicyID)}
                  >
                    <td className="px-4 py-2 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(policy.PolicyID)}
                        onChange={() => handleRowSelect(policy.PolicyID)}
                      />
                    </td>
                    <td className="px-4 py-2 border">{policy.PolicyNo}</td>
                    <td className="px-4 py-2 border">{getClientName(policy.ClientID)}</td>
                    <td className="px-4 py-2 border">{getProviderName(policy.ProviderID)}</td>
                    <td className="px-4 py-2 border">{policy.OptionID}</td>
                    <td className="px-4 py-2 border">{policy.Branch}</td>
                    <td className="px-4 py-2 border">{policy.Premium}</td>
                    <td className="px-4 py-2 border">{new Date(policy.PolicyPeriodStart).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{new Date(policy.PolicyPeriodEnd).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{policy.GeographicalArea}</td>
                    <td className="px-4 py-2 border">{policy.Commission}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleNavigateEdit(policy.PolicyID)}
                        className="text-blue-500 hover:text-blue-700 px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(policy.PolicyID)}
                        className="text-red-500 hover:text-red-700 px-2 py-1 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedPolicyId === policy.PolicyID && (
                    <tr>
                      <td colSpan="13">
                        <table className="w-full table-auto bg-gray-700">
                          <thead>
                            <tr className="text-left text-sm font-medium text-gray-300">
                              <th className="px-4 py-2 border-b">Make And Model</th>
                              <th className="px-4 py-2 border-b">Year</th>
                              <th className="px-4 py-2 border-b">Body Type</th>
                              <th className="px-4 py-2 border-b">Plate No</th>
                              <th className="px-4 py-2 border-b">Serial No</th>
                              <th className="px-4 py-2 border-b">Seat Capacity</th>
                              <th className="px-4 py-2 border-b">Sum Insured</th>
                              <th className="px-4 py-2 border-b">Engine No</th>
                              <th className="px-4 py-2 border-b">Use Of Vehicle</th>
                              <th className="px-4 py-2 border-b">CC/HP</th>
                              <th className="px-4 py-2 border-b">Duty Free</th>
                              <th className="px-4 py-2 border-b">Owner Type</th>
                              <th className="px-4 py-2 border-b">Additional Details</th>
                              <th className="px-4 py-2 border-b">Excess</th>
                              <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getVehicleDetails(policy.PolicyID).map((vehicle) => (
                              <tr key={vehicle.VehicleID}>
                                <td className="px-4 py-2 border">{vehicle.MakeAndModel}</td>
                                <td className="px-4 py-2 border">{vehicle.Year}</td>
                                <td className="px-4 py-2 border">{vehicle.BodyType}</td>
                                <td className="px-4 py-2 border">{vehicle.PlateNo}</td>
                                <td className="px-4 py-2 border">{vehicle.SerialNo}</td>
                                <td className="px-4 py-2 border">{vehicle.SeatCapacity}</td>
                                <td className="px-4 py-2 border">{vehicle.SumInsured}</td>
                                <td className="px-4 py-2 border">{vehicle.EngineNo}</td>
                                <td className="px-4 py-2 border">{vehicle.UseOfVehicle}</td>
                                <td className="px-4 py-2 border">{vehicle.CC_HP}</td>
                                <td className="px-4 py-2 border">{vehicle.DutyFree}</td>
                                <td className="px-4 py-2 border">{vehicle.OwnerType}</td>
                                <td className="px-4 py-2 border">{vehicle.AdditionalDetails}</td>
                                <td className="px-4 py-2 border">{vehicle.Excess}</td>
                                <td className="px-4 py-2 border text-center">
                                  <button
                                    onClick={() => handleVehicleEdit(vehicle.VehicleID)}
                                    className="text-blue-500 hover:text-blue-700 px-2 py-1"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleVehicleDelete(vehicle.VehicleID)}
                                    className="text-red-500 hover:text-red-700 px-2 py-1 ml-2"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="px-4 py-2 text-center">No policies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ShowPolicies;
