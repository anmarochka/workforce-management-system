import request from "supertest";
import app from "../start";
import { pool } from "../db";

describe("Tax API", () => {
  it("should get all tax records", async () => {
    const res = await request(app).get("/tax");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create tax record manually", async () => {
    const result = await pool.query(
      "INSERT INTO tax (employee_id, month, income, tax_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [1, "2025-06", 1000, 200]
    );
    expect(result.rows.length).toBe(1);
    expect(Number(result.rows[0].tax_amount)).toBe(200);

  });
});
