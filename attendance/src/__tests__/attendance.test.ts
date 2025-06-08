import request from "supertest";
import app from "../index";

describe("Attendance API", () => {
  it("should get all attendance records", async () => {
    const res = await request(app).get("/attendance");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new attendance record", async () => {
    const res = await request(app)
      .post("/attendance")
      .send({
        employeeId: 1,
        date: new Date().toISOString().split("T")[0],
        hours: 5,
      });

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.employee_id).toBe(1);
  });
});
