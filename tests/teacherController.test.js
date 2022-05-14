import supertest from "supertest";
import app from "./testServer";
import { TestDatabase } from "./database";

const testDatabase = new TestDatabase();
describe("Teacher routes test", () => {
  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Create default user", async () => {
    const response = await supertest(app)
      .post("/createDefault")
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Default user created");
  });

  it("Create default user - already exists", async () => {
    const response = await supertest(app)
      .post("/createDefault")
      .set("Accept", "application/json");

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Default user already exists!");
  });

  it("Get all teachers - Without token", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });
});
