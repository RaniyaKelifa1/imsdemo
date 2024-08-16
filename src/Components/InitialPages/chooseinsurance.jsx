import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const insuranceOptions = [
  'Motor Vehicle',
  'Fire and Allied Perils',
  'Burglary & House Breaking',
  'Consequential Loss (Business Interruption)',
  'Marine (Cargo and Hull)',
  'Goods-in-Transit',
  'Inland Carriers Liability',
  'Aviation (Cargo & Hull)',
  'Bonds',
  'Engineering',
  'All Risks',
];

const ChooseInsurance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { idClick } = location.state || {};

  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const fetchClientName = async () => {
      try {
        const response = await axios.get(`https://bminsurancebrokers.com/imlservertwo/clients/`);
        for (let index = 0; index < response.data.length; index++) {
       if (response.data[index].ClientID === idClick) {
        setClientName (response.data[index].Name)
        console.log(response.data[index].Name)
       }
        }
     
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    if (idClick) {
      fetchClientName();
    }
  }, [idClick]);

  const handleOptionClick = (option, clientId) => {
    navigate(`/view/insurance/${option.replace(/ /g, '-')}`,{ state: { idDatas: clientId } });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Choose Class of Business for{' '}
        <span className="text-blue-400 font-semibold">{clientName}</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {insuranceOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-center rounded-md border border-neutral-800 bg-slate-950 p-4 text-center shadow-lg cursor-pointer hover:bg-neutral-800 transition"
            onClick={() => handleOptionClick(option,idClick)}
          >
            <p className="text-gray-400">{option}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChooseInsurance;
