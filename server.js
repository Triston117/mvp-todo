import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
dotenv.config();
const app = express();
const PORT = 3000;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Your engine check light has come on.");
});

// basic error and route
app.get("/tasks", (req, res) => {
  res.status(400).send("Specify a day.");
});

// tasks for day
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

// new task finish parse
app.post("/tasks/:day", (req, res) => {
  const { day, task } = req.body;

  pool.query(
    `INSERT INTO ${day} (task, completed) VALUES ($1, false)`,
    [task],
    (err, result) => {
      if (err) {
        console.log(`Error adding task to ${day} table: ${err}`);
        res.status(500).send("Error adding task");
      } else {
        console.log(`Added task to ${day} table: ${task}`);
        res.status(201).send("Task added successfully");
      }
    }
  );
});

// delete a task from the database
app.delete("/tasks/:day/:id", (req, res) => {
  const { day, id } = req.params;

  pool.query(`DELETE FROM ${day} WHERE id = $1`, [id], (err, result) => {
    if (err) {
      console.log(`Error deleting task from ${day} table: ${err}`);
      res.status(500).send("Error deleting task");
    } else {
      console.log(`Deleted task from ${day} table: ${id}`);
      res.status(200).send("Task deleted successfully");
    }
  });
});

// changed completed from false to true:
app.patch("/tasks/:day/:id", (req, res) => {
  const { day, id } = req.params;

  pool.query(
    `UPDATE ${day} SET completed = true WHERE id = $1`,
    [id],
    (err, result) => {
      if (err) {
        console.log(`Error updating task in ${day} table: ${err}`);
        res.status(500).send("Error updating task");
      } else {
        console.log(`Updated task in ${day} table: ${id}`);
        res.status(200).send("Task updated successfully");
      }
    }
  );
});

// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
