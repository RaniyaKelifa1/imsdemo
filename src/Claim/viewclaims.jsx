import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ViewClaims = () => {
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get('http://localhost:3001/claims');
        setClaims(response.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/policies');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchClaims();
    fetchUsers();
    fetchPolicies();
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this claim?');
      if (!confirmDelete) {
        return;
      }

      await axios.delete(`http://localhost:3001/claims/${id}`);
      setClaims(prevClaims => prevClaims.filter(claim => claim.claim_id !== id));
      alert('Claim successfully deleted.');
    } catch (error) {
      console.error('Error handling delete:', error);
      alert('There was an error deleting the claim. Please try again.');
    }
  };

  const handleNavigateEdit = (claimId) => {
    navigate('/editclaim', { state: { idEdit: claimId } });
  };

  const handleAddClaim = () => {
    navigate('/claims');
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user_id',
        Cell: ({ value }) => {
          const user = users.find(user => user.id === value);
          return user ? user.name : 'N/A';
        },
      },
      {
        Header: 'Policy',
        accessor: 'policy_id',
        Cell: ({ value }) => {
          const policy = policies.find(policy => policy.policy_id === value);
          return policy ? policy.policy_name : 'N/A';
        },
      },
      {
        Header: 'Vehicle',
        accessor: 'vehicle_id',
        Cell: ({ value }) => {
          const vehicle = vehicles.find(vehicle => vehicle.id === value);
          return vehicle ? vehicle.license_plate : 'N/A';
        },
      },
      {
        Header: 'Claim Date',
        accessor: 'claim_date',
        Cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy h:mm a'),
      },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Amount', accessor: 'amount' },
      { Header: 'Claim Details', accessor: 'claim_details' },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleNavigateEdit(row.original.claim_id)}
              className="text-blue-600 hover:text-blue-900"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original.claim_id)}
              className="text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [users, policies, vehicles]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: claims });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(claims.map(claim => ({
      ...claim,
      user_name: users.find(user => user.id === claim.user_id)?.name || 'N/A',
      policy_name: policies.find(policy => policy.policy_id === claim.policy_id)?.policy_name || 'N/A',
      vehicle_license_plate: vehicles.find(vehicle => vehicle.id === claim.vehicle_id)?.license_plate || 'N/A',
    })));

    XLSX.utils.book_append_sheet(wb, ws, 'Claims');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claims_list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Claims List</h2>
        <div className="flex space-x-4">
          <button onClick={handleAddClaim} className="flex items-center text-blue-600 hover:text-blue-900">
            Add Claim
          </button>
          <button onClick={exportToExcel} className="flex items-center text-green-600 hover:text-green-900">
            <HiDownload className="mr-2" />
            Export to Excel
          </button>
        </div>
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

export default ViewClaims;
