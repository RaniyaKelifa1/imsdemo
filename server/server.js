const cors = require('cors');
const express = require('express');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');

const app = express();
const hostname = '127.0.0.1';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MySQL Connection Pool Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2151215121',
  database: process.env.DB_NAME || 'imlphasetwo',
  port: process.env.DB_PORT || 3307, // Ensure this matches your local MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Connected to MySQL database using connection pool');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Helper function for database query execution
async function executeQuery(query, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Example route to test the database connection
app.get('/imlserver', (req, res) => {
  res.send('Welcome to the API----new');
});

// Clients CRUD
app.get('/imlserver/clients', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM clients', []);
    res.json(results);
  } catch (err) {
    console.error('Error fetching insurance providers:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/imlserver/clients', [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required'),
  // Additional validation rules if needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno, clientType, contactPerson } = req.body;

  let query;
  let values;

  if (clientType === 'Company') {
    query = 'INSERT INTO clients (name, clientType, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno, contactPerson) VALUES (?,?,  ?, ?, ?, ?, ?, ?, ?)';
    values = [name, clientType, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno, contactPerson];
  } else if (clientType === 'Individual') {
    query = 'INSERT INTO clients (name, clientType, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    values = [name, email, clientType, phoneNumber, address_city, address_subcity, address_wereda, address_houseno];
  } else {
    return res.status(400).json({ errors: [{ msg: 'Invalid client type' }] });
  }

  try {
    const result = await executeQuery(query, values);
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phoneNumber,
      address_city,
      address_subcity,
      address_wereda,
      address_houseno,
      contactPerson: clientType === 'Company' ? contactPerson : undefined
    });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/imlserver/clients/:id', [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required'),
  // Add more validation rules as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno } = req.body;

  try {
    await executeQuery(
      'UPDATE clients SET name = ?, email = ?, phoneNumber = ?, address_city = ?, address_subcity = ?, address_wereda = ?, address_houseno = ? WHERE ClientID = ?',
      [name, email, phoneNumber, address_city, address_subcity, address_wereda, address_houseno, id]
    );
    res.status(200).send('Client updated successfully');
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/imlserver/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await executeQuery('DELETE FROM clients WHERE ClientID = ?', [id]);
    res.status(200).send('Client deleted successfully');
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Insurance Providers CRUD
app.get('/imlserver/insurance-providers', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM insuranceproviders', []);
    res.json(results);
  } catch (err) {
    console.error('Error fetching insurance providers:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/imlserver/insurance-providers', [
  check('company_name').notEmpty().withMessage('Company name is required'),
  // Add more validation rules as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { company_name, contact_email, contact_phone } = req.body;

  try {
    const result = await executeQuery(
      'INSERT INTO insuranceproviders (company_name, contact_email, contact_phone) VALUES (?, ?, ?)',
      [company_name, contact_email, contact_phone]
    );
    res.status(201).json({ id: result.insertId, company_name, contact_email, contact_phone });
  } catch (err) {
    console.error('Error creating insurance provider:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/imlserver/insurance-providers/:id', [
  check('company_name').notEmpty().withMessage('Company name is required'),
  // Add more validation rules as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { company_name, contact_email, contact_phone } = req.body;

  try {
    await executeQuery(
      'UPDATE insuranceproviders SET company_name = ?, contact_email = ?, contact_phone = ? WHERE id = ?',
      [company_name, contact_email, contact_phone, id]
    );
    res.status(200).send('Insurance provider updated successfully');
  } catch (err) {
    console.error('Error updating insurance provider:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/imlserver/insurance-providers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await executeQuery('DELETE FROM insuranceproviders WHERE id = ?', [id]);
    res.status(200).send('Insurance provider deleted successfully');
  } catch (err) {
    console.error('Error deleting insurance provider:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Policies CRUD
app.get('/imlserver/policies', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM policies', []);
    res.json(results);
  } catch (err) {
    console.error('Error fetching policies:', err);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/imlserver/policies', async (req, res) => {
  try {
    const {
      PolicyNo, clientID, providerID, optionID,
      branch, premium, policyPeriodStart, policyPeriodEnd,
      geographicalArea, commission, vehicles
    } = req.body;

    // Validate inputs as needed

    // Insert the policy into the Policies table
    const query = `
      INSERT INTO Policies 
      (PolicyNo, clientID, providerID, optionID, branch, premium, 
      policyPeriodStart, policyPeriodEnd, geographicalArea, commission) 
      VALUES (?, ?, ?, ?, ?, ?, ?,  ?, ?, ?)
    `;
    const values = [
      PolicyNo, clientID, providerID, optionID,  branch, premium,
      policyPeriodStart, policyPeriodEnd, geographicalArea, commission
    ];

    const newPolicy = await executeQuery(query, values);
    const policyID = newPolicy.insertId;

    // Insert associated vehicles into the Vehicles table
    if (vehicles && vehicles.length > 0) {
      for (const vehicle of vehicles) {
        const vehicleQuery = `
          INSERT INTO Vehicles (policyID, makeAndModel, year, bodyType, plateNumber) 
          VALUES (?, ?, ?, ?, ?)
        `;
        const vehicleValues = [
          policyID, vehicle.makeAndModel, vehicle.year, vehicle.bodyType, vehicle.plateNumber
        ];

        await executeQuery(vehicleQuery, vehicleValues);
      }
    }

    res.status(201).send({ message: 'Policy and vehicles added successfully' });
  } catch (error) {
    console.error('Error inserting policy and vehicles:', error);
    res.status(500).send({ error: 'Failed to add policy and vehicles' });
  }
});


app.put('/imlserver/policies/:id', [
  check('PolicyNo').notEmpty().withMessage('Policy number is required'),
  // Add more validation rules as needed
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  let {
    PolicyNo,
    ClientID,
    ProviderID,
    OptionID,
    Branch,
    Premium,
    PolicyPeriodStart,
    PolicyPeriodEnd,
    GeographicalArea,
    Commission
  } = req.body;

  // Replace undefined with null
  PolicyNo = PolicyNo || null;
  ClientID = ClientID || null;
  ProviderID = ProviderID || null;
  OptionID = OptionID || null;
  Branch = Branch || null;
  Premium = Premium || null;
  PolicyPeriodStart = PolicyPeriodStart || null;
  PolicyPeriodEnd = PolicyPeriodEnd || null;
  GeographicalArea = GeographicalArea || null;
  Commission = Commission || null;

  try {
    await executeQuery(
      `UPDATE policies 
       SET PolicyNo = ?, 
           ClientID = ?, 
           ProviderID = ?, 
           OptionID = ?, 
           Branch = ?, 
           Premium = ?, 
           PolicyPeriodStart = ?, 
           PolicyPeriodEnd = ?, 
           GeographicalArea = ?, 
           Commission = ?
       WHERE PolicyID = ?`,
      [PolicyNo, ClientID, ProviderID, OptionID, Branch, Premium, PolicyPeriodStart, PolicyPeriodEnd, GeographicalArea, Commission, id]
    );
    res.status(200).send('Policy updated successfully');
  } catch (err) {
    console.error('Error updating policy:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/imlserver/policies/:id', async (req, res) => {
  const { id } = req.params;
console.log(id)
  try {
    await executeQuery('DELETE FROM policies WHERE PolicyID = ?', [id]);
    res.status(200).send('Policy deleted successfully');
  } catch (err) {
    console.error('Error deleting policy:', err);
    res.status(500).send('Internal Server Error');
  }
});
// POST /imlserver/vehicles
// Vehicles CRUD
app.get('/imlserver/vehicles', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM vehicles', []);
    res.json(results);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/imlserver/vehicles', async (req, res) => {
  let vehicles = req.body;

  // Ensure that vehicles is always an array
  if (!Array.isArray(vehicles)) {
    vehicles = [vehicles];
  }

  console.log(`Number of vehicles: ${vehicles.length}`);
  console.log(vehicles);

  if (!vehicles || vehicles.length === 0) {
    return res.status(400).json({ errors: [{ msg: 'Invalid vehicles data format' }] });
  }

  for (const vehicle of vehicles) {
    try {
      // Insert each vehicle into the database
      await executeQuery(
        `INSERT INTO vehicles (PolicyID, MakeAndModel, Year, BodyType, PlateNo, SerialNo, SeatCapacity, SumInsured, EngineNo, UseOfVehicle, CC_HP, DutyFree, OwnerType, AdditionalDetails, Excess)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.PolicyID,
          vehicle.MakeAndModel ?? null,
          vehicle.Year ?? null,
          vehicle.BodyType ?? null,
          vehicle.PlateNo ?? null,
          vehicle.SerialNo ?? null,
          vehicle.SeatCapacity ?? null,
          vehicle.SumInsured ?? null,
          vehicle.EngineNo ?? null,
          vehicle.UseOfVehicle ?? null,
          vehicle.CC_HP ?? null,
          vehicle.DutyFree ?? null,
          vehicle.OwnerType ?? null,
          vehicle.AdditionalDetails ?? null,
          vehicle.Excess ?? null
        ]
      );
    } catch (error) {
      console.error('Error inserting vehicle:', error);
      return res.status(500).send('Failed to add vehicle');
    }
  }

  res.status(201).json({ message: 'Vehicles added successfully' });
});




app.put('/imlserver/vehicles/:id', [
  check('PolicyID').notEmpty().withMessage('Policy ID is required'),
  check('MakeAndModel').notEmpty().withMessage('Make and Model is required'),
  check('Year').isInt().withMessage('Year must be a number'),
  check('BodyType').notEmpty().withMessage('Body Type is required'),
  check('PlateNo').notEmpty().withMessage('Plate Number is required'),
  check('SerialNo').notEmpty().withMessage('Serial Number is required'),
  check('SeatCapacity').isInt().withMessage('Seat Capacity must be a number'),
  check('SumInsured').isDecimal().withMessage('Sum Insured must be a decimal number'),
  check('EngineNo').notEmpty().withMessage('Engine Number is required'),
  check('UseOfVehicle').notEmpty().withMessage('Use of Vehicle is required'),
  check('CC_HP').notEmpty().withMessage('CC/HP is required'),
  check('DutyFree').isIn(['Yes', 'No']).withMessage('Duty Free must be Yes or No'),
  check('OwnerType').notEmpty().withMessage('Owner Type is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { PolicyID, MakeAndModel, Year, BodyType, PlateNo, SerialNo, SeatCapacity, SumInsured, EngineNo, UseOfVehicle, CC_HP, DutyFree, OwnerType, AdditionalDetails, Excess } = req.body;

  try {
    await executeQuery(
      `UPDATE vehicles SET PolicyID = ?, MakeAndModel = ?, Year = ?, BodyType = ?, PlateNo = ?, SerialNo = ?, SeatCapacity = ?, SumInsured = ?, EngineNo = ?, UseOfVehicle = ?, CC_HP = ?, DutyFree = ?, OwnerType = ?, AdditionalDetails = ?, Excess = ?
       WHERE VehicleID = ?`,
      [PolicyID, MakeAndModel, Year, BodyType, PlateNo, SerialNo, SeatCapacity, SumInsured, EngineNo, UseOfVehicle, CC_HP, DutyFree, OwnerType, AdditionalDetails, Excess, id]
    );
    res.status(200).send('Vehicle updated successfully');
  } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/imlserver/vehicles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await executeQuery('DELETE FROM vehicles WHERE VehicleID = ?', [id]);
    res.status(200).send('Vehicle deleted successfully');
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Server listening
app.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});
