import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import pg from "pg";
dotenv.config();
const app = express();
const PORT = 3000;
//Ahhhh
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// tasks for day
app.get("/tasks/:day", (req, res) => {
  const day = req.params.day.toLowerCase(); // Convert day to lowercase
  pool.query(`SELECT * FROM "${day}"`, (err, result) => {
    if (err) {
      console.log(`Error getting tasks from ${day} table: ${err}`);
      res.status(500).send("Error getting tasks");
    } else {
      console.log(`Got tasks from ${day} table`);
      res.status(200).send(result.rows);
    }
  });
});

// new task
app.post("/tasks/:dayOfWeek", (req, res) => {
  const dayOfWeek = req.params.dayOfWeek.toLowerCase(); // Convert dayOfWeek to lowercase
  const task = req.body.task;

  pool.query(
    `INSERT INTO "${dayOfWeek}" (task, completed) VALUES ($1, false)`,
    [task],
    (err, result) => {
      if (err) {
        console.log(`Error adding task to ${dayOfWeek} table: ${err}`);
        res.status(500).send("Error adding task");
      } else {
        console.log(`Added task to ${dayOfWeek} table: ${task}`);
        res.status(201).send("Task added successfully");
      }
    }
  );
});

// delete a task from the database
app.delete("/tasks/:day/:id", (req, res) => {
  const { day, id } = req.params;
  const dayLowerCase = day.toLowerCase(); // Convert day to lowercase

  pool.query(
    `DELETE FROM "${dayLowerCase}" WHERE id = $1`,
    [id],
    (err, result) => {
      if (err) {
        console.log(`Error deleting task from ${dayLowerCase} table: ${err}`);
        res.status(500).send("Error deleting task");
      } else {
        console.log(`Deleted task from ${dayLowerCase} table: ${id}`);
        res.status(200).send("Task deleted successfully");
      }
    }
  );
});

// changed completed from false to true:
app.patch("/tasks/:day/:id", (req, res) => {
  const { day, id } = req.params;
  const dayLowerCase = day.toLowerCase(); // Convert day to lowercase

  pool.query(
    `UPDATE "${dayLowerCase}" SET completed = true WHERE id = $1`,
    [id],
    (err, result) => {
      if (err) {
        console.log(`Error updating task in ${dayLowerCase} table: ${err}`);
        res.status(500).send("Error updating task");
      } else {
        console.log(`Updated task in ${dayLowerCase} table: ${id}`);
        res.status(200).send("Task updated successfully");
      }
    }
  );
});

// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
