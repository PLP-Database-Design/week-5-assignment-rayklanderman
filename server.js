const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API");
});

// 1. Retrieve all patients and display as an HTML table
app.get("/patients", (req, res) => {
  connection.query(
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients",
    (err, results) => {
      if (err) {
        return res.status(500).send("<h1>Error fetching patients</h1>");
      }

      // Build HTML table
      let html =
        '<h1>Patients</h1><table border="1" style="border-collapse: collapse; width: 100%;"><tr><th>ID</th><th>Name</th><th>Date of Birth</th></tr>';

      results.forEach((patient) => {
        html += `<tr><td>${patient.patient_id}</td><td>${patient.first_name} ${patient.last_name}</td><td>${patient.date_of_birth}</td></tr>`;
      });

      html += "</table>";

      res.send(html);
    }
  );
});

// 2. Retrieve all providers
app.get("/providers", (req, res) => {
  connection.query(
    "SELECT first_name, last_name, provider_specialty FROM providers",
    (err, results) => {
      if (err) {
        return res.status(500).send("<h1>Error fetching providers</h1>");
      }

      let html =
        '<h1>Providers</h1><table border="1" style="border-collapse: collapse; width: 100%;"><tr><th>First Name</th><th>Last Name</th><th>Specialty</th></tr>';

      results.forEach((provider) => {
        html += `<tr><td>${provider.first_name}</td><td>${provider.last_name}</td><td>${provider.provider_specialty}</td></tr>`;
      });

      html += "</table>";

      res.send(html);
    }
  );
});

// 3. Filter patients by first name
app.get("/patients/first-name/:firstName", (req, res) => {
  const firstName = req.params.firstName;
  connection.query(
    "SELECT * FROM patients WHERE first_name = ?",
    [firstName],
    (err, results) => {
      if (err) {
        return res.status(500).send("<h1>Error fetching patients</h1>");
      }

      let html =
        '<h1>Filtered Patients</h1><table border="1" style="border-collapse: collapse; width: 100%;"><tr><th>ID</th><th>Name</th><th>Date of Birth</th></tr>';

      results.forEach((patient) => {
        html += `<tr><td>${patient.patient_id}</td><td>${patient.first_name} ${patient.last_name}</td><td>${patient.date_of_birth}</td></tr>`;
      });

      html += "</table>";

      res.send(html);
    }
  );
});

// 4. Retrieve all providers by their specialty
app.get("/providers/specialty/:specialty", (req, res) => {
  const specialty = req.params.specialty;
  connection.query(
    "SELECT * FROM providers WHERE provider_specialty = ?",
    [specialty],
    (err, results) => {
      if (err) {
        return res.status(500).send("<h1>Error fetching providers</h1>");
      }

      let html =
        '<h1>Providers by Specialty</h1><table border="1" style="border-collapse: collapse; width: 100%;"><tr><th>First Name</th><th>Last Name</th><th>Specialty</th></tr>';

      results.forEach((provider) => {
        html += `<tr><td>${provider.first_name}</td><td>${provider.last_name}</td><td>${provider.provider_specialty}</td></tr>`;
      });

      html += "</table>";

      res.send(html);
    }
  );
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
