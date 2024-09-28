// import React from 'react';
const { BrowserRouter: Router, Route, Routes } = require('react-router-dom');
const Dashboard = require('./InitialPages/dashboard').default;
const AddContactPerson = require('./InsuredUsers/addperson').default; // Adjust the path as necessary
const AddOrganization = require('./InsuredUsers/addorg').default;
const AddAddress = require('./InsuredUsers/addAddress').default;
const DemoViewPage = require('./InsuredUsers/demoview').default;
const DemoCViewPage = require('./InsuredUsers/democlientview').default;
const LoginPage = require('./InitialPages/loginpage').default;



function Apps() {
  return (
  
    <Router>
    
      
      <Routes>
        
      <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="addperson" element={<AddContactPerson />} />
          <Route path="addorganization" element={<AddOrganization />} />
          <Route path="addaddress" element={<AddAddress />} />
          <Route path="demoview" element={<DemoViewPage />} />
          <Route path="clientview" element={<DemoCViewPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Apps;
