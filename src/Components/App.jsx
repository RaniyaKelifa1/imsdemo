import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './InitialPages/header'; 
import FeaturesSection from './InitialPages/choosetabs';
import AddClient from './InsuredUsers/user';
import ShowIndividuals from './InsuredUsers/showindividual';
import ShowCompany from './InsuredUsers/showcomapnies';
import EditIndividual from './InsuredUsers/editIndividual';
import ChooseInsurance from './InitialPages/chooseinsurance';
import AddMotorPolicy from './Policy/addMotorpolicy';
import AddVehicle from './InsuredVehicles/Vehicle';
import ShowPolicies from './Policy/viewPolicy';
import EditPolicy from './Policy/editpolicy';

// Component to conditionally render Header based on route
const AppHeader = () => {
  const location = useLocation();
  return location.pathname !== '/' ? <Header /> : null;
};

const App = () => {
  // Example usage of API base URL from environment variables
  // const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // console.log('API Base URL:', apiUrl); // For debugging purposes

  return (
    <Router>
      {/* Conditionally render the Header component */}
      <AppHeader />
      <Routes>
     
        <Route path="/" element={<FeaturesSection />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/ShowIndividuals" element={<ShowIndividuals />} />
        <Route path="/ShowCompanies" element={<ShowCompany />} />
        <Route path="/editIndividual" element={<EditIndividual />} />
        <Route path="/chooseInsruance" element={<ChooseInsurance />} />
        <Route path="/insurance/Motor-Vehicle" element={<AddMotorPolicy />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/view/insurance/Motor-Vehicle" element={<ShowPolicies />} />
        <Route path="/editPolicy" element={<EditPolicy />} />
        





      </Routes>
    </Router>
  );
};

export default App;
