import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
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

    fetchCompanies();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const associatedUsers = users.filter(user => user.company_id === id);

      if (associatedUsers.length > 0) {
        alert(`Cannot delete company. There are ${associatedUsers.length} users associated with this company.`);
        return;
      }

      if (window.confirm('Are you sure you want to delete this company?')) {
        await axios.delete(`https://bminsurancebrokers.com/imlserver/companies/${id}`);
        setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== id));
      }
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };

  const handleNavigate = (companyId) => {
    navigate('/editCompany', { state: { idEdit: companyId } });
  };

  const handleNavigateUsers = (companyId) => {
    navigate('/companyusers', { state: { idUsers: companyId } });
  };

  const handleAddCompany = () => {
    navigate('/company');
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Company Name', accessor: 'company_name' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'TIN Number', accessor: 'tin_number' },
      { Header: 'Address', accessor: 'address' },
      { Header: 'Contact Person', accessor: 'contact_person' },
      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy h:mm a'),
      },
      {
        Header: 'Number of Insured Users',
        accessor: 'id',
        Cell: ({ row }) => {
          const userCount = users.filter(user => user.company_id === row.original.id).length;
          return (
            <button
              onClick={() => handleNavigateUsers(row.original.id)}
              className="text-blue-600 hover:text-blue-900"
            >
              {userCount}
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
              onClick={() => handleNavigate(row.original.id)}
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
    [users]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: companies });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(companies);

    XLSX.utils.book_append_sheet(wb, ws, 'Companies');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies_list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Added Companies List</h2>
        <div className="flex space-x-4">
          <button onClick={handleAddCompany} className="flex items-center text-blue-600 hover:text-blue-900">
            Add Company
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

export default ViewCompanies;
