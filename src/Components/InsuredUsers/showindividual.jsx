import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiDownload } from 'react-icons/hi';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const ShowIndividuals = () => {
  const [individuals, setIndividuals] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndividuals = async () => {
      let individuals = [];
      try {
        const response = await axios.get('/ / /imlservertwo/clients', {
          params: { ClientType: 'Individual' }
        });

        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].ClientType === 'Individual') {
            individuals.push(response.data[index]);
          }
        }
        setIndividuals(individuals);
      } catch (err) {
        setError('Error fetching individuals');
        console.error(err);
      }
    };

    fetchIndividuals();
  }, []);

  const handleSearch = () => {
    // This function could be used for debouncing search or other tasks
  };

  const handleRowSelect = (clientId) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(clientId)
        ? prevSelectedRows.filter(id => id !== clientId)
        : [...prevSelectedRows, clientId]
    );
  };

  const handleRowClick = (clientId) => {
    navigate('/chooseInsruance', { state: { idClick: clientId } });
  };

  const handleNavigateEdit = (clientId) => {
    navigate('/editIndividual', { state: { idEdit: clientId } });
  };

  const handleDelete = async (clientId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this individual?');
      if (!confirmDelete) return;

      await axios.delete(` /imlservertwo/clients/${clientId}`);
      setIndividuals(prevIndividuals => prevIndividuals.filter(individual => individual.ClientID !== clientId));
      console.log(clientId);
      console.log(individual.ClientID);
      alert('Individual successfully deleted.');
    } catch (error) {
      console.error('Error handling delete:', error);
      alert('There was an error deleting the individual. Please try again.');
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const filteredIndividuals = individuals.filter(individual =>
      selectedRows.includes(individual.ClientID)
    );
    const ws = XLSX.utils.json_to_sheet(filteredIndividuals);
    XLSX.utils.book_append_sheet(wb, ws, 'Selected Individuals');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_individuals.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const normalizePhone = (phone) => phone.replace(/\D/g, '');

  const normalizedSearchTerm = normalizePhone(searchTerm);

  const filteredIndividuals = individuals.filter(individual => {
    const normalizedPhone = normalizePhone(individual.PhoneNumber);
    return normalizedPhone.includes(normalizedSearchTerm);
  });

  return (
    <section className="min-h-screen p-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100">Individual Clients</h2>
          <div className="flex space-x-4">
            <div className="relative">
            <div className="relative">
  <i className="fas fa-search text-white absolute left-3 top-1/2 transform -translate-y-1/2"></i>
  <input
    type="text"
    placeholder="Search by phone number...."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10 pr-4 py-2 rounded-md text-white border border-gray-300"
  />
</div>

            </div>
            <button onClick={exportToExcel} className="flex items-center text-green-600 hover:text-green-900">
              <HiDownload className="mr-2" />
              Export Selected
            </button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Select</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Name</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Email</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">City</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Subcity</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">House No</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Wereda</th>
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndividuals.length > 0 ? (
              filteredIndividuals.map(individual => (
                <tr
                  key={individual.ClientID}
                  className={`hover:bg-sky-700 cursor-pointer ${selectedRows.includes(individual.ClientID) ? 'bg-sky-800' : ''}`}
                  onClick={() => handleRowClick(individual.ClientID)}
                >
                  <td className="px-4 py-2 text-left border">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(individual.ClientID)}
                      onChange={() => handleRowSelect(individual.ClientID)}
                    />
                  </td>
                  <td className="px-4 py-2 text-left border">{individual.Name}</td>
                  <td className="px-4 py-2 text-left border">{individual.Email}</td>
                  <td className="px-4 py-2 text-left border">{individual.PhoneNumber}</td>
                  <td className="px-4 py-2 text-left border">{individual.Address_City}</td>
                  <td className="px-4 py-2 text-left border">{individual.Address_Subcity}</td>
                  <td className="px-4 py-2 text-left border">{individual.Address_HouseNo}</td>
                  <td className="px-4 py-2 text-left border">{individual.Address_Wereda}</td>
                  <td className="px-4 py-2 text-left border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                    handleNavigateEdit(individual.ClientID)
                        // console.log(`Edit individual ${individual.ClientID}`);
                      }}
                      className="text-blue-600 hover:text-blue-900 ml-2"
                    >
                      <FaEdit />
                    
                    </button>
                    <button
                     onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(individual.ClientID);
                    }}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-2 text-center border">No individuals found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ShowIndividuals;
