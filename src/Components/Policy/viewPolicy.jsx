import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ViewPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/policies');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
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

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
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

    fetchPolicies();
    fetchUsers();
    fetchCompanies();
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this policy?');
      if (!confirmDelete) {
        return;
      }

      await axios.delete(`http://localhost:3001/policies/${id}`);
      setPolicies(prevPolicies => prevPolicies.filter(policy => policy.policy_id !== id));
      alert('Policy successfully deleted.');
    } catch (error) {
      console.error('Error handling delete:', error);
      alert('There was an error deleting the policy. Please try again.');
    }
  };

  const handleNavigateEdit = (policyId) => {
    navigate('/editpolicy', { state: { idEdit: policyId } });
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Policy Name', accessor: 'policy_name' },
      { Header: 'Policy Details', accessor: 'policy_details' },
      {
        Header: 'Provider',
        accessor: 'provider_id',
        Cell: ({ value }) => {
          const provider = users.find(user => user.id === value);
          return provider ? provider.name : 'N/A';
        },
      },
      {
        Header: 'User',
        accessor: 'user_id',
        Cell: ({ value }) => {
          const user = users.find(user => user.id === value);
          return user ? user.name : 'N/A';
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
      { Header: 'Category', accessor: 'category' },
      {
        Header: 'Reinsured',
        accessor: 'reinsured',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      { Header: 'Renewal Count', accessor: 'renewal_count' },
      {
        Header: 'Company',
        accessor: 'company_id',
        Cell: ({ value }) => {
          const company = companies.find(company => company.id === value);
          return company ? company.company_name : 'N/A';
        },
      },
      { Header: 'Sum Insured Including Tax', accessor: 'sum_insured_including_tax' },
      { Header: 'Premium Own Damage', accessor: 'premium_own_damage' },
      { Header: 'Premium Third Party', accessor: 'premium_third_party' },
      { Header: 'Premium Pvt', accessor: 'premium_pvt' },
      { Header: 'Premium Workmen', accessor: 'premium_workmen' },
      { Header: 'Premium BSG', accessor: 'premium_bsg' },
      { Header: 'Premium Property Damage', accessor: 'premium_property_damage' },
      { Header: 'Premium Death', accessor: 'premium_death' },
      {
        Header: 'Third Party Extension',
        accessor: 'third_party_extension',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      { Header: 'Total Premium', accessor: 'total_premium' },
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
              onClick={() => handleNavigateEdit(row.original.policy_id)}
              className="text-blue-600 hover:text-blue-900"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original.policy_id)}
              className="text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [users, companies, vehicles]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: policies });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(policies.map(policy => ({
      ...policy,
      provider_name: users.find(user => user.id === policy.provider_id)?.name || 'N/A',
      user_name: users.find(user => user.id === policy.user_id)?.name || 'N/A',
      vehicle_license_plate: vehicles.find(vehicle => vehicle.id === policy.vehicle_id)?.license_plate || 'N/A',
      company_name: companies.find(company => company.id === policy.company_id)?.company_name || 'N/A',
    })));

    XLSX.utils.book_append_sheet(wb, ws, 'Policies');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies_list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddPolicyAlert = () => {
    alert('Add Policy or Upload Policy feature will be added soon.');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Policies List</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddPolicyAlert} // Handle alert on click
            className="flex items-center text-blue-600 hover:text-blue-900"
          >
            Add Policy
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
              <th className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-900">Actions</th>
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
                <td className="border px-4 py-2 text-sm text-gray-100 text-left">
                  {row.original.actions}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPolicies;
