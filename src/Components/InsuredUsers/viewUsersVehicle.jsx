import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';

const ViewUserVehicles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {}; // Get the user ID from URL parameters
  const [vehicles, setVehicles] = useState([]);
  const [userName, setUserName] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesResponse, usersResponse, companiesResponse] = await Promise.all([
          axios.get('http://localhost:3001/vehicles'),
          axios.get('http://localhost:3001/users'),
          axios.get('http://localhost:3001/companies'),
        ]);

        // Filter vehicles to show only those owned by the selected user
        const userVehicles = vehiclesResponse.data.filter(vehicle => vehicle.owner_id === userId);
        setVehicles(userVehicles);

        // Find and set the user name
        const user = usersResponse.data.find(user => user.id === userId);
        if (user) {
          setUserName(user.name);
        }

        // Set company data
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const columns = React.useMemo(
    () => [
      { Header: 'License Plate', accessor: 'license_plate' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Manufacturer', accessor: 'manufacturer' },
      { Header: 'Year', accessor: 'year' },
      { Header: 'Chassis Number', accessor: 'chassis_number' },
      { Header: 'Engine Number', accessor: 'engine_number' },
      { Header: 'Engine Capacity (cc)', accessor: 'cc' },
      { Header: 'Vehicle Type', accessor: 'vehicle_type' },
      {
        Header: 'Company',
        accessor: 'company_id',
        Cell: ({ value }) => {
          const company = companies.find(company => company.id === value);
          return company ? company.company_name : 'N/A';
        },
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy h:mm a'),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [navigate, companies]
  );

  const handleEdit = (vehicleId) => {
    navigate(`/editVehicle/${vehicleId}`);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`http://localhost:3001/vehicles/${vehicleId}`);
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(vehicles);

    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName}_Vehicles.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: vehicles });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Vehicles of User: {userName}</h2>
        <button
          onClick={exportToExcel}
          className="flex items-center text-green-600 hover:text-green-900"
        >
          <HiDownload className="mr-2" />
          Export to Excel
        </button>
      </div>
      <table {...getTableProps()} className="table-auto w-full border-collapse">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900"
                  key={column.id}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-sky-700" key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="border px-4 py-2 text-sm text-gray-100 text-left" key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUserVehicles;
