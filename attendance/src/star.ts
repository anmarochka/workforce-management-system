import express from "express";
import dotenv from "dotenv";
import pool  from "./db";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/attendance", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Attendance service running on port ${port}`);
});
