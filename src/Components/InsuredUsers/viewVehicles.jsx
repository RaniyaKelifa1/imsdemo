import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ViewUserVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchVehicles();
    fetchUsers();
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this vehicle?');
      if (!confirmDelete) {
        return;
      }

      await axios.delete(`https://bminsurancebrokers.com/imlserver/vehicles/${id}`);
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
      alert('Vehicle successfully deleted.');
    } catch (error) {
      console.error('Error handling delete:', error);
      alert('There was an error deleting the vehicle. Please try again.');
    }
  };

  const handleNavigateEdit = (vehicleId) => {
    navigate('/editvehicle', { state: { idEdit: vehicleId } });
  };

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
        Header: 'Owner',
        accessor: 'owner_id',
        Cell: ({ value }) => {
          const owner = users.find(user => user.id === value);
          return owner ? owner.name : 'N/A';
        },
      },
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
              onClick={() => handleNavigateEdit(row.original.id)}
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
    [users, companies] // Add users and companies as dependencies for proper updates
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: vehicles });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(vehicles.map(vehicle => ({
      ...vehicle,
      owner_name: users.find(user => user.id === vehicle.owner_id)?.name || 'N/A',
      company_name: companies.find(company => company.id === vehicle.company_id)?.company_name || 'N/A',
    })));

    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicles_list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Vehicles List</h2>
        <button onClick={exportToExcel} className="flex items-center text-green-600 hover:text-green-900">
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

export default ViewUserVehicles ;
