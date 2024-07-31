// src/components/EditCompany.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

function EditCompany() {
  const [company, setCompany] = useState(null);
  const location = useLocation();
  const { idEdit } = location.state || {};
  const [form, setForm] = useState({
    company_name: '',
    phone_number: '',
    tin_number: '',
    address: '',
    contact_person: '',
  });
  const [editedFields, setEditedFields] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  var usersCompany =[]; URL
// 
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/companies`);
        for (let index = 0; index < response.data.length; index++) {
          if(response.data[index].id === idEdit){
            usersCompany.push(response.data[index])
            console.log(response.data[index])
            setForm(response.data[index]); 
               }
        }
   // Populate form with existing company data
      } catch (error) {
        console.error('Error fetching company data:', error);
        setAlertMessage('Error fetching company data.');
        setAlertType('error');
      }
    };

    fetchCompany();
  }, [idEdit]);
  const handleChange = e => {
    const { name, value } = e.target;
  
    setForm(prevForm => {
      // Ensure `company` has a valid value before comparison
      const isCompanyAvailable = company !== null && company !== undefined;
      const updatedForm = { ...prevForm, [name]: value };
  
      // Compare updated form values with the company values if available
      const updatedFields = isCompanyAvailable
        ? Object.keys(updatedForm).filter(key => updatedForm[key] !== company[key])
        : Object.keys(updatedForm); // If `company` is not available, assume all fields are updated
  
      setEditedFields(updatedFields);
  
      return updatedForm;
    });
  };
  

  const handleSubmit = async e => {
    e.preventDefault();
  
    // Check if `idEdit` is available
    if (!idEdit) {
      setAlertMessage('Invalid company ID.');
      setAlertType('error');
      return;
    }
  
    try {
      // Make the API request to update the company
      await axios.put(`http://localhost:3001/companies/${idEdit}`, form);
  
      // Handle successful update
      setAlertMessage('Company details updated successfully!');
      setAlertType('success');
      
      // Optionally, navigate back or clear form data
      navigate('/companylist'); // Example navigation, adjust as needed
    } catch (error) {
      // Handle error during update
      console.error('Error updating company:', error);
      setAlertMessage('Error updating company. Please try again.');
      setAlertType('error');
    }
  };
  

  const handleAlertClose = () => {
    setAlertMessage('');
    setAlertType('');
  };

  return (
    <section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center bg-white">
          <div className="max-w-lg px-5  text-center md:px-10 md:py-24 lg:py-32">
            <h2 className="mb-8 text-3xl text-[#333333] font-bold md:mb-12 md:text-2xl">Edit Company Details</h2>

            {alertMessage && (
              <div
                className={`p-4 mb-4 text-white rounded-lg ${
                  alertType === 'success'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                <p>{alertMessage}</p>
                <button
                  onClick={handleAlertClose}
                  className="ml-4 text-sm underline"
                >
                  Close
                </button>
              </div>
            )}

            {editedFields.length > 0 && (
              <div className="p-4 mb-4 text-blue-500 border border-blue-500 rounded-lg">
                <p>Edited fields:</p>
                <ul>
                  {editedFields.map(field => (
                    <li key={field} className="text-sm">{field.replace('_', ' ').toUpperCase()}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mx-auto mb-4 max-w-sm pb-4">
              <div className="relative mb-4">
                <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                />
              </div>
              <div className="relative mb-4">
                <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                <input
                  type="text"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                />
              </div>
              <div className="relative mb-4">
                <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                <input
                  type="text"
                  name="tin_number"
                  value={form.tin_number}
                  onChange={handleChange}
                  placeholder="TIN Number"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                />
              </div>
              <div className="relative mb-4">
                <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                />
              </div>
              <div className="relative mb-4">
                <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                <input
                  type="text"
                  name="contact_person"
                  value={form.contact_person}
                  onChange={handleChange}
                  placeholder="Contact Person"
                  className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333]"
                />
              </div>

              <button type="submit" className="flex items-center justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white transition [box-shadow:rgb(171,_196,_245)_-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]">
                <p className="mr-6 font-bold">Update Company</p>
                
              </button>
             
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditCompany;
