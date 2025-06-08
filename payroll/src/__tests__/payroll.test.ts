import request from "supertest";
import app from "../index"; 
import pool from "../db";

describe("Payroll API", () => {
  it("should get all payroll records", async () => {
    const res = await request(app).get("/payroll");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create payroll record manually", async () => {
    const salary = 120;
    const response = await pool.query(
      "INSERT INTO payroll (employee_id, date, hours, salary) VALUES ($1, $2, $3, $4) RETURNING *",
      [1, "2025-06-07", 12, salary]
    );

    expect(response.rows[0].salary).toBe(salary);
    expect(response.rows[0]).toHaveProperty("id");
  });
});
