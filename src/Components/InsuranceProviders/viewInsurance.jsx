import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ViewInsuranceProviders = () => {
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsuranceProviders = async () => {
      try {
        const response = await axios.get('https://bminsurancebrokers.com/imlserver/insurance_providers');
        setInsuranceProviders(response.data);
      } catch (error) {
        console.error('Error fetching insurance providers:', error);
      }
    };

    fetchInsuranceProviders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this insurance provider?');
      if (!confirmDelete) return;

      await axios.delete(`https://bminsurancebrokers.com/imlserver/insurance_providers/${id}`);
      setInsuranceProviders(prevProviders => prevProviders.filter(provider => provider.insurance_provider_id !== id));
      alert('Insurance provider successfully deleted.');
    } catch (error) {
      console.error('Error handling delete:', error);
      alert('There was an error deleting the insurance provider. Please try again.');
    }
  };

  const handleNavigateEdit = (providerId) => {
    navigate('/editinsurance', { state: { idEdit: providerId } });
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Company Name', accessor: 'company_name' },
      { Header: 'Contact Email', accessor: 'contact_email' },
      { Header: 'Contact Phone', accessor: 'contact_phone' },
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
              onClick={() => handleNavigateEdit(row.original.insurance_provider_id)}
              className="text-blue-600 hover:text-blue-900"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(row.original.insurance_provider_id)}
              className="text-red-600 hover:text-red-900"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: insuranceProviders });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(insuranceProviders);
    XLSX.utils.book_append_sheet(wb, ws, 'Insurance Providers');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insurance_providers_list.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-left">Insurance Providers List</h2>
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

export default ViewInsuranceProviders;
