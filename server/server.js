const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs

const app = express();
const PORT = process.env.PORT || 3001;

// Use CORS to allow requests from other domains
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// MySQL Connection Configuration
const db = mysql.createConnection({
  host: 'localhost', // Server address
  user: 'root', // Replace with your MySQL username
  password: '2151215121', // Replace with your MySQL password
  database: 'imlphaseone', // Replace with your database name
  port: 3307 // Port number (3307 in your case)
});

// Connect to MySQL database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Users CRUD
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { name, email, password, phone_number, role, status, company_id } = req.body;
  const id = uuidv4();
  const created_at = new Date();
  db.query(
    'INSERT INTO users (id, name, email, password, phone_number, role, status, company_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, email, password, phone_number, role, status, company_id, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`User added with ID: ${id}`);
    }
  );
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone_number, role, status, company_id } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, role = ?, status = ?, company_id = ? WHERE id = ?',
    [name, email, password, phone_number, role, status, company_id, id],
    (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`User with ID: ${id} updated`);
    }
  );
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`User with ID: ${id} deleted`);
  });
});

// Repeat similar CRUD operations for companies, vehicles, policies, insurance_providers, payments, policy_updates, claims, reinsurance_details
// Example for companies:
app.get('/companies', (req, res) => {
  db.query('SELECT * FROM companies', (err, results) => {
    if (err) {
      console.error('Error fetching companies:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.post('/companies', (req, res) => {
  const { company_name, phone_number, tin_number, address, contact_person } = req.body;
  const id = uuidv4();
  const created_at = new Date();
  db.query(
    'INSERT INTO companies (id, company_name, phone_number, tin_number, address, contact_person, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, company_name, phone_number, tin_number, address, contact_person, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding company:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Company added with ID: ${id}`);
    }
  );
});

// Similar PUT and DELETE routes for companies
app.put('/companies/:id', (req, res) => {
  const { id } = req.params;
  const { company_name, phone_number, tin_number, address, contact_person } = req.body;
  db.query(
    'UPDATE companies SET company_name = ?, phone_number = ?, tin_number = ?, address = ?, contact_person = ? WHERE id = ?',
    [company_name, phone_number, tin_number, address, contact_person, id],
    (err, result) => {
      if (err) {
        console.error('Error updating company:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Company with ID: ${id} updated`);
    }
  );
});

app.delete('/companies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM companies WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting company:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Company with ID: ${id} deleted`);
  });
});

app.put('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const { license_plate, model, manufacturer, year, chassis_number, engine_number, cc, vehicle_type, owner_id, company_id } = req.body;
  db.query(
    'UPDATE vehicles SET license_plate = ?, model = ?, manufacturer = ?, year = ?, chassis_number = ?, engine_number = ?, cc = ?, vehicle_type = ?, owner_id = ?, company_id = ? WHERE id = ?',
    [license_plate, model, manufacturer, year, chassis_number, engine_number, cc, vehicle_type, owner_id, company_id, id],
    (err, result) => {
      if (err) {
        console.error('Error updating vehicle:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Vehicle with ID: ${id} updated`);
    }
  );
});
app.get('/vehicles', (req, res) => {
  db.query('SELECT * FROM vehicles', (err, results) => {
    if (err) {
      console.error('Error fetching vehicles:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});
app.post('/vehicles', (req, res) => {
  const { license_plate, model, manufacturer, year, chassis_number, engine_number, cc, vehicle_type, owner_id, company_id } = req.body;
  const id = uuidv4();
  const created_at = new Date();
  db.query(
    'INSERT INTO vehicles (id, license_plate, model, manufacturer, year, chassis_number, engine_number, cc, vehicle_type, owner_id, company_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, license_plate, model, manufacturer, year, chassis_number, engine_number, cc, vehicle_type, owner_id, company_id, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding vehicle:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Vehicle added with ID: ${id}`);
    }
  );
});
app.delete('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting vehicle:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Vehicle with ID: ${id} deleted`);
  });
});
app.post('/insurance_providers', (req, res) => {
  const { company_name, contact_email, contact_phone } = req.body;
  const insurance_provider_id = uuidv4();
  const created_at = new Date();
  db.query(
    'INSERT INTO insurance_providers (insurance_provider_id, company_name, contact_email, contact_phone, created_at) VALUES (?, ?, ?, ?, ?)',
    [insurance_provider_id, company_name, contact_email, contact_phone, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding insurance provider:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Insurance provider added with ID: ${insurance_provider_id}`);
    }
  );
});

// Read Insurance Providers
app.get('/insurance_providers', (req, res) => {
  db.query('SELECT * FROM insurance_providers', (err, results) => {
    if (err) {
      console.error('Error fetching insurance providers:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Update Insurance Provider
app.put('/insurance_providers/:id', (req, res) => {
  const { id } = req.params;
  const { company_name, contact_email, contact_phone } = req.body;
  db.query(
    'UPDATE insurance_providers SET company_name = ?, contact_email = ?, contact_phone = ? WHERE insurance_provider_id = ?',
    [company_name, contact_email, contact_phone, id],
    (err, result) => {
      if (err) {
        console.error('Error updating insurance provider:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Insurance provider with ID: ${id} updated`);
    }
  );
});

// Delete Insurance Provider
app.delete('/insurance_providers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM insurance_providers WHERE insurance_provider_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting insurance provider:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Insurance provider with ID: ${id} deleted`);
  });
});

// Create Policy
app.post('/policies', (req, res) => {
  const {
    policy_name, policy_details, provider_id, user_id, vehicle_id, category,
    reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage,
    premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage,
    premium_death, third_party_extension, total_premium, created_at
  } = req.body;
  
  const policy_id = uuidv4();
  
  db.query(
    'INSERT INTO policies (policy_id, policy_name, policy_details, provider_id, user_id, vehicle_id, category, reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage, premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage, premium_death, third_party_extension, total_premium, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [policy_id, policy_name, policy_details, provider_id, user_id, vehicle_id, category, reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage, premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage, premium_death, third_party_extension, total_premium, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding policy:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Policy added with ID: ${policy_id}`);
    }
  );
});

// Read Policies
app.post('/policies', (req, res) => {
  const {
    policy_name, policy_details, provider_id, user_id, vehicle_id, category,
    reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage,
    premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage,
    premium_death, third_party_extension, total_premium, created_at
  } = req.body;
  
  const policy_id = uuidv4();
  
  db.query(
    'INSERT INTO policies (policy_id, policy_name, policy_details, provider_id, user_id, vehicle_id, category, reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage, premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage, premium_death, third_party_extension, total_premium, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [policy_id, policy_name, policy_details, provider_id, user_id, vehicle_id, category, reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage, premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage, premium_death, third_party_extension, total_premium, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding policy:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Policy added with ID: ${policy_id}`);
    }
  );
});

// Update Policy
app.put('/policies/:id', (req, res) => {
  const { id } = req.params;
  const {
    policy_name, policy_details, provider_id, user_id, vehicle_id, category,
    reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage,
    premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage,
    premium_death, third_party_extension, total_premium, created_at
  } = req.body;
  
  db.query(
    'UPDATE policies SET policy_name = ?, policy_details = ?, provider_id = ?, user_id = ?, vehicle_id = ?, category = ?, reinsured = ?, renewal_count = ?, company_id = ?, sum_insured_including_tax = ?, premium_own_damage = ?, premium_third_party = ?, premium_pvt = ?, premium_workmen = ?, premium_bsg = ?, premium_property_damage = ?, premium_death = ?, third_party_extension = ?, total_premium = ?, created_at = ? WHERE policy_id = ?',
    [policy_name, policy_details, provider_id, user_id, vehicle_id, category, reinsured, renewal_count, company_id, sum_insured_including_tax, premium_own_damage, premium_third_party, premium_pvt, premium_workmen, premium_bsg, premium_property_damage, premium_death, third_party_extension, total_premium, created_at, id],
    (err, result) => {
      if (err) {
        console.error('Error updating policy:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Policy with ID: ${id} updated`);
    }
  );
});

// Delete Policy
app.delete('/policies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM policies WHERE policy_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting policy:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Policy with ID: ${id} deleted`);
  });
});
app.post('/claims', (req, res) => {
  const { user_id, policy_id, claim_date, status, amount, vehicle_id, claim_details } = req.body;
  const claim_id = uuidv4();
  db.query(
    'INSERT INTO claims (claim_id, user_id, policy_id, claim_date, status, amount, vehicle_id, claim_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [claim_id, user_id, policy_id, claim_date, status, amount, vehicle_id, claim_details],
    (err, result) => {
      if (err) {
        console.error('Error adding claim:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Claim added with ID: ${claim_id}`);
    }
  );
});

// Read Claims
app.get('/claims', (req, res) => {
  db.query('SELECT * FROM claims', (err, results) => {
    if (err) {
      console.error('Error fetching claims:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Update Claim
app.put('/claims/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, policy_id, claim_date, status, amount, vehicle_id, claim_details } = req.body;
  db.query(
    'UPDATE claims SET user_id = ?, policy_id = ?, claim_date = ?, status = ?, amount = ?, vehicle_id = ?, claim_details = ? WHERE claim_id = ?',
    [user_id, policy_id, claim_date, status, amount, vehicle_id, claim_details, id],
    (err, result) => {
      if (err) {
        console.error('Error updating claim:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Claim with ID: ${id} updated`);
    }
  );
});

// Delete Claim
app.delete('/claims/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM claims WHERE claim_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting claim:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Claim with ID: ${id} deleted`);
  });
});

app.post('/insurance_providers', (req, res) => {
  const { company_name, contact_email, contact_phone } = req.body;
  const insurance_provider_id = uuidv4();
  const created_at = new Date();
  db.query(
    'INSERT INTO insurance_providers (insurance_provider_id, company_name, contact_email, contact_phone, created_at) VALUES (?, ?, ?, ?, ?)',
    [insurance_provider_id, company_name, contact_email, contact_phone, created_at],
    (err, result) => {
      if (err) {
        console.error('Error adding insurance provider:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send(`Insurance provider added with ID: ${insurance_provider_id}`);
    }
  );
});

// Read Insurance Providers
app.get('/insurance_providers', (req, res) => {
  db.query('SELECT * FROM insurance_providers', (err, results) => {
    if (err) {
      console.error('Error fetching insurance providers:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

// Update Insurance Provider
app.put('/insurance_providers/:id', (req, res) => {
  const { id } = req.params;
  const { company_name, contact_email, contact_phone } = req.body;
  db.query(
    'UPDATE insurance_providers SET company_name = ?, contact_email = ?, contact_phone = ? WHERE insurance_provider_id = ?',
    [company_name, contact_email, contact_phone, id],
    (err, result) => {
      if (err) {
        console.error('Error updating insurance provider:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.send(`Insurance provider with ID: ${id} updated`);
    }
  );
});

// Delete Insurance Provider
app.delete('/insurance_providers/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM insurance_providers WHERE insurance_provider_id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting insurance provider:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Insurance provider with ID: ${id} deleted`);
  });
});

// Repeat similar CRUD operations for vehicles, policies, insurance_providers, payments, policy_updates, claims, reinsurance_details

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
