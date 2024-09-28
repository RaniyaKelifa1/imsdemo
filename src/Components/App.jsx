<<<<<<< HEAD
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './InitialPages/dashboard';
import AddContactPerson from './InsuredUsers/addperson';
import AddOrganization from './InsuredUsers/addorg';
import AddAddress from './InsuredUsers/addAddress';
// import DemoViewPage from './InsuredUsers/demoview';
import DemoCViewPage from './InsuredUsers/democlientview';
import WelcomePage from './InitialPages/loginpage';
import AddOrganizationType from './InsuredUsers/AddOrganizationType';
import AddPersonType from './InsuredUsers/AddPersonType';
import AddVehicle from './InsuredObjects/vehicle';
import AddProperty from './InsuredObjects/property';
import AddLifeObjects from './InsuredObjects/life';
import AddBondDetails from './InsuredObjects/bond';
import MachineriesViewPage from './InsuredObjects/viewmachinary';
import LifeObjectsViewPage from './InsuredObjects/lifeView';
import VehiclesViewPage from './InsuredObjects/editVehicle';
import PropertyObjectsViewPage from './InsuredObjects/viewproperty';
import './App.css';
import AddMachinery from './InsuredObjects/machinary';
import InsurableObjectForm from './InsuredObjects/ObjectTypes';
import MiscellaneousObjectsViewPage from './InsuredObjects/Viewmiscel';
import AddMiscellaneousObjectPage from './InsuredObjects/addMiscel';
import AddInsurancePolicy from './insurancePolicy/insruancepolicy';
import AddMotorInsurance from './insurancePolicy/addmotorinsurance';
import MarineInsuranceForm from './insurancePolicy/addmarine';
import FireLightningInsuranceForm from './insurancePolicy/addfireand';
import ViewInsurancePolicyPage from './insurancePolicy/viewinsurance';
import WorkmensCompensationForm from './InsuredObjects/workmen';
import WorkmenCompensationViewPage from './InsuredObjects/workcompview';
function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />}>
        <Route path="ObjectForm" element={<InsurableObjectForm />} />
          <Route path="addperson" element={<AddContactPerson />} />
          <Route path="addorganization" element={<AddOrganization />} />
          <Route path="addaddress" element={<AddAddress />} />
          <Route path="add-organization-type" element={<AddOrganizationType />} />
          <Route path="addpersontype" element={<AddPersonType />} />
          <Route path="demoview" element={<DemoCViewPage />} />
          <Route path="clientview" element={<DemoCViewPage />} />
          <Route path="addvehicle" element={<AddVehicle />} />
          <Route path="viewMachinary" element={<MachineriesViewPage />} />
          <Route path="addprop" element={<AddProperty />} />
          <Route path="addLife" element={<AddLifeObjects />} />
          <Route path="addMachine" element={<AddMachinery />} />
          <Route path="addBond" element={<AddBondDetails />} />
          <Route path="ViewLife" element={<LifeObjectsViewPage />} />
          <Route path="viewprop" element={<PropertyObjectsViewPage />} />
          <Route path="Viewveh" element={<VehiclesViewPage />} />
          <Route path="ViewMis" element={<MiscellaneousObjectsViewPage />} />
          <Route path="addmis" element={<AddMiscellaneousObjectPage />} />
          <Route path="AddInsurance" element={<AddInsurancePolicy/>} />
          <Route path="AddMotor" element={<AddMotorInsurance/>} />
          <Route path="AddMarine" element={<MarineInsuranceForm/>} />
          <Route path="AddFireand" element={<FireLightningInsuranceForm/>} />
          <Route path="viewInsurance" element={<ViewInsurancePolicyPage/>} />
          <Route path="workmen" element={<WorkmensCompensationForm/>} />
          <Route path="viewworkmen" element={<WorkmenCompensationViewPage/>} />
=======
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
>>>>>>> origin/master
        </Route>
      </Routes>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default Apps;
>>>>>>> origin/master
