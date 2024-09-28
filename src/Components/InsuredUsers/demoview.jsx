
// // import React from 'react';
// const { Pie, Bar } = require('react-chartjs-2');
// const { Chart: ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } = require('chart.js');


// // Register components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// // Sample data
// // const addresses = [
// //   { AddressID: 1, City: "Addis Ababa", Subcity: "Subcity1", HouseNo: "123", Wereda: "Wereda1" },
// //   { AddressID: 2, City: "Addis Ababa", Subcity: "Subcity2", HouseNo: "456", Wereda: "Wereda2" }
// // ];

// // const persons = [
// //   { PersonID: 1, FirstName: "John", LastName: "Doe", PhoneNumber: "1234567890", Email: "john.doe@example.com", NationalID: "ID123456789", Type: "SalesAgent", AddressID: 1 },
// //   { PersonID: 2, FirstName: "Jane", LastName: "Smith", PhoneNumber: "0987654321", Email: "jane.smith@example.com", NationalID: "ID987654321", Type: "FreelanceAgent", AddressID: 2 }
// // ];

// // const organizations = [
// //   { OrganizationID: 1, Name: "Bizuhan Insurance", PhoneNumber: "1112223333", Email: "contact@bizuhaninsurance.com", OrganizationType: "InsuranceCompany", TIN: "TIN123456789", AddressID: 1 },
// //   { OrganizationID: 2, Name: "Mebratu Insurance Brokers", PhoneNumber: "4445556666", Email: "info@mebratuinsurance.com", OrganizationType: "PolicyRegisteredUser", TIN: "TIN987654321", AddressID: 2 }
// // ];

// const vehicles = [
//   { VehicleID: 1, Make: "Toyota", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "Honda", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 },
//   { VehicleID: 1, Make: "BYZ", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "Honda", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 },
//   { VehicleID: 1, Make: "Toyota", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "BMW", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 }
// ];

// const claims = [
//   { ClaimID: 1, PolicyID: 1, ClaimAmount: 5000, ClaimDate: "2024-09-01", Status: "Approved" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
// ];

// // Data preparation for charts
// const vehicleMakes = vehicles.reduce((acc, vehicle) => {
//   acc[vehicle.Make] = (acc[vehicle.Make] || 0) + 1;
//   return acc;
// }, {});

// const claimStatuses = claims.reduce((acc, claim) => {
//   acc[claim.Status] = (acc[claim.Status] || 0) + 1;
//   return acc;
// }, {});

// // Pie chart data
// const pieData = {
//   labels: Object.keys(vehicleMakes),
//   datasets: [{
//     label: 'Vehicle Makes',
//     data: Object.values(vehicleMakes),
//     backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
//     borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
//     borderWidth: 0.25 ,
//   }]
// };

// // Bar chart data
// const barData = {
//   labels: Object.keys(claimStatuses),
//   datasets: [{
//     label: 'Claim Statuses',
//     data: Object.values(claimStatuses),
//     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//     borderColor: 'rgba(75, 192, 192, 1)',
//     borderWidth: 1,
//   }]
// };

// const DemoViewPage = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Welcome to your dashboard</h1>
//       <div className="mb-8 bg-white shadow-md rounded-lg p-4">
//         <h2 className="text-xl font-semibold mb-4">Claim Status Distribution</h2>
//         <Bar
//           data={barData}
//           options={{
//             plugins: {
//               legend: {
//                 display: true,
//               },
//               title: {
//                 display: true,
//                 text: 'Claim Statuses',
//               },
//             },
//             scales: {
//               x: {
//                 beginAtZero: true,
//               },
//             },
//           }}
//         />
//       </div>
//       <div className="mb-1 bg-white shadow-md rounded-lg p-4">
//         <h2 className="text-xl font-semibold mb-4">Vehicle Makes Distribution</h2>
//         <Pie data={pieData} />
//       </div>

     
//     </div>
//   );
// };

// export default DemoViewPage;

// import React from 'react';
// const { Pie, Bar } = require('react-chartjs-2');
// const { Chart: ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } = require('chart.js');


// Register components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Sample data
// const addresses = [
//   { AddressID: 1, City: "Addis Ababa", Subcity: "Subcity1", HouseNo: "123", Wereda: "Wereda1" },
//   { AddressID: 2, City: "Addis Ababa", Subcity: "Subcity2", HouseNo: "456", Wereda: "Wereda2" }
// ];

// const persons = [
//   { PersonID: 1, FirstName: "John", LastName: "Doe", PhoneNumber: "1234567890", Email: "john.doe@example.com", NationalID: "ID123456789", Type: "SalesAgent", AddressID: 1 },
//   { PersonID: 2, FirstName: "Jane", LastName: "Smith", PhoneNumber: "0987654321", Email: "jane.smith@example.com", NationalID: "ID987654321", Type: "FreelanceAgent", AddressID: 2 }
// ];

// const organizations = [
//   { OrganizationID: 1, Name: "Bizuhan Insurance", PhoneNumber: "1112223333", Email: "contact@bizuhaninsurance.com", OrganizationType: "InsuranceCompany", TIN: "TIN123456789", AddressID: 1 },
//   { OrganizationID: 2, Name: "Mebratu Insurance Brokers", PhoneNumber: "4445556666", Email: "info@mebratuinsurance.com", OrganizationType: "PolicyRegisteredUser", TIN: "TIN987654321", AddressID: 2 }
// ];

// const vehicles = [
//   { VehicleID: 1, Make: "Toyota", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "Honda", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 },
//   { VehicleID: 1, Make: "BYZ", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "Honda", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 },
//   { VehicleID: 1, Make: "Toyota", Model: "Corolla", Year: 2020, RegistrationNumber: "XYZ123", PolicyID: 1 },
//   { VehicleID: 2, Make: "BMW", Model: "Civic", Year: 2021, RegistrationNumber: "ABC456", PolicyID: 2 }
// ];

// const claims = [
//   { ClaimID: 1, PolicyID: 1, ClaimAmount: 5000, ClaimDate: "2024-09-01", Status: "Approved" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
//   { ClaimID: 2, PolicyID: 2, ClaimAmount: 7000, ClaimDate: "2024-09-05", Status: "Pending" },
// ];

// Data preparation for charts
// const vehicleMakes = vehicles.reduce((acc, vehicle) => {
//   acc[vehicle.Make] = (acc[vehicle.Make] || 0) + 1;
//   return acc;
// }, {});

// const claimStatuses = claims.reduce((acc, claim) => {
//   acc[claim.Status] = (acc[claim.Status] || 0) + 1;
//   return acc;
// }, {});

// // Pie chart data
// const pieData = {
//   labels: Object.keys(vehicleMakes),
//   datasets: [{
//     label: 'Vehicle Makes',
//     data: Object.values(vehicleMakes),
//     backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
//     borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
//     borderWidth: 0.25 ,
//   }]
// };

// Bar chart data
// const barData = {
//   labels: Object.keys(claimStatuses),
//   datasets: [{
//     label: 'Claim Statuses',
//     data: Object.values(claimStatuses),
//     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//     borderColor: 'rgba(75, 192, 192, 1)',
//     borderWidth: 1,
//   }]
// };

const DemoViewPage = () => {
  // return (
  //   <div className="p-8">
  //     <h1 className="text-3xl font-bold mb-6">Welcome to your dashboard</h1>
  //     <div className="mb-8 bg-white shadow-md rounded-lg p-4">
  //       <h2 className="text-xl font-semibold mb-4">Claim Status Distribution</h2>
  //       <Bar
  //         data={barData}
  //         options={{
  //           plugins: {
  //             legend: {
  //               display: true,
  //             },
  //             title: {
  //               display: true,
  //               text: 'Claim Statuses',
  //             },
  //           },
  //           scales: {
  //             x: {
  //               beginAtZero: true,
  //             },
  //           },
  //         }}
  //       />
  //     </div>
  //     <div className="mb-1 bg-white shadow-md rounded-lg p-4">
  //       <h2 className="text-xl font-semibold mb-4">Vehicle Makes Distribution</h2>
  //       <Pie data={pieData} />
  //     </div>

     
  //   </div>
  // );
};

export default DemoViewPage;

