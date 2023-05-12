import express from "express";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const daysOfTheWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
daysOfTheWeek.forEach((day) => {
  pool.query(
    `
    CREATE TABLE IF NOT EXISTS ${day} (
      id SERIAL PRIMARY KEY,
      task VARCHAR(255) NOT NULL
    )
  `,
    (err, res) => {
      if (err) {
        console.log(`Error creating ${day} table: ${err}`);
      } else {
        console.log(`Created ${day} table`);
      }
    }
  );
});

// add a new task to the database
app.post("/tasks", (req, res) => {
  const { day, task } = req.body;

  pool.query(`INSERT INTO ${day} (task) VALUES ($1)`, [task], (err, result) => {
    if (err) {
      console.log(`Error adding task to ${day} table: ${err}`);
      res.status(500).send("Error adding task");
    } else {
      console.log(`Added task to ${day} table: ${task}`);
      res.status(201).send("Task added successfully");
    }
  });
});

// get all tasks for a particular day
app.get("/tasks/:day", (req, res) => {
  const day = req.params.day;

  pool.query(`SELECT * FROM ${day}`, (err, result) => {
    if (err) {
      console.log(`Error getting tasks from ${day} table: ${err}`);
      res.status(500).send("Error getting tasks");
    } else {
      console.log(`Got tasks from ${day} table`);
      res.status(200).send(result.rows);
    }
  });
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
