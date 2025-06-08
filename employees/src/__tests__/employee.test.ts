import request from "supertest";
import app from "../index";

describe("Employees API", () => {
  it("should get all employees", async () => {
    const res = await request(app).get("/employees");
    console.log(res.body); // временно
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new employee", async () => {
    const newEmployee = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      position: "Tester",
    };

    const res = await request(app).post("/employees").send(newEmployee);
    console.log(res.body); // временно
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test User");
  });
});
