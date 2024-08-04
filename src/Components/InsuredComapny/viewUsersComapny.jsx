import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';

const ViewCompanyUsers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { idUsers } = location.state || {}; // Get the company ID from URL parameters
  const [users, setUsers] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          axios.get('https://bminsurancebrokers.com/imlserver/users'),
          axios.get('https://bminsurancebrokers.com/imlserver/companies'),
        ]);

        // Filter users to show only those belonging to the selected company
        const companyUsers = usersResponse.data.filter(user => user.company_id === idUsers);
        setUsers(companyUsers);

        // Find and set the company name
        const company = companiesResponse.data.find(company => company.id === idUsers);
        if (company) {
          setCompanyName(company.company_name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    }; 

    fetchVehicles();
    fetchData();
  }, [idUsers]);
  const handleNavigateVehicle = (userId) => {
    navigate('/usersvehicles', { state: { userId } });
  };
  const columns = React.useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Status', accessor: 'status' },

      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy h:mm a'),
      },
      {
        Header: 'Number of Insured Vehicles',
        accessor: 'id',
        Cell: ({ row }) => {
          const userId = row.original.id;
          const userVehiclesCount = vehicles.filter(vehicle => vehicle.owner_id === row.original.id).length;
          return (
            <button
              onClick={() => handleNavigateVehicle( row.original.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              {userVehiclesCount}
            </button>
          );
        },
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
    [navigate]
  );

  const handleEdit = (userId) => {
    navigate(`/editUser/${userId}`); // Replace with the appropriate route for editing a user
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://bminsurancebrokers.com/imlserver/users/${userId}`);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(users);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName}_Users.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: users });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Users of Company: {companyName}</h2>
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

export default ViewCompanyUsers;
