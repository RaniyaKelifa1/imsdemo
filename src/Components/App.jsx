import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './InitialPages/header'; 
import ViewCompanyUsers from './InsuredComapny/viewUsersComapny';
import User from './InsuredUsers/user';
import ViewCompany from './InsuredComapny/viewCompanies';
import Company from './InsuredComapny/companies';
import EditCompany from './InsuredComapny/editcompany';
import Welcome from './InitialPages/welcomepage';
import ViewUsers from './InsuredUsers/viewusers';
import EditUser from './InsuredUsers/edituser';
import FeaturesSection from './InitialPages/choosetabs';
import ViewVehicles from './InsuredVehicles/viewVehicles';
import ViewUserVehicles from './InsuredUsers/viewUsersVehicle';
import Vehicles from './InsuredVehicles/Vehicle';
import EditVehicle from './InsuredVehicles/editVehicle';
import ViewPolicies from './Policy/viewPolicy';
import ViewClaims from '../Claim/viewclaims';
import ViewInsuranceProviders from './InsuranceProviders/viewInsurance';
import AddClaims from '../Claim/addclaims';
import AddPolicy from './Policy/addpolicy';
import EditPolicy from './Policy/editpolicy';
import EditClaim from '../Claim/editClaim';

// Component to conditionally render Header based on route
const AppHeader = () => {
  const location = useLocation();
  return location.pathname !== '/' ? <Header /> : null;
};

const App = () => {
  // Example usage of API base URL from environment variables
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  console.log('API Base URL:', apiUrl); // For debugging purposes

  return (
    <Router>
      {/* Conditionally render the Header component */}
      <AppHeader />
      <Routes>
        <Route path="/company" element={<Company />} />
        <Route path="/" element={<FeaturesSection />} />
        <Route path="/editCompany" element={<EditCompany />} />
        <Route path="/companylist" element={<ViewCompany />} />
        <Route path="/companyusers" element={<ViewCompanyUsers/>} />
        <Route path="/users" element={<User />} />
        <Route path="/viewusers" element={<ViewUsers />} />
        <Route path="/editusers" element={<EditUser />} /> 
        <Route path="/usersvehicles" element={<ViewUserVehicles />} />
        <Route path="/vehicles" element={<Vehicles/>} />
        <Route path="/viewvehicles" element={<ViewVehicles/>} />
        <Route path="/editvehicle" element={<EditVehicle/>} />
        <Route path="/viewpolicy" element={<ViewPolicies/>} />
        <Route path="/viewclaims" element={<ViewClaims/>} />
        <Route path="/viewinsurance" element={<ViewInsuranceProviders/>} />
        <Route path="/claims" element={<AddClaims/>} />
        <Route path="/policies" element={<AddPolicy/>} />
        <Route path="/editpolicy" element={<EditPolicy/>} />
        <Route path="/editclaim" element={<EditClaim/>} />
      </Routes>
    </Router>
  );
};

export default App;
