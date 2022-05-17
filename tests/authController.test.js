import supertest from "supertest";
import app from "./testServer";
import "dotenv/config";
import { TestDatabase } from "./database";

const testDatabase = new TestDatabase();
let token = "";
describe("Test token structure and validation", () => {
  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Test unprovided token", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Test bad token", async () => {
    const loginResponse = await supertest(app)
    .post("/auth/login")
    .send({
      email: process.env.D_USER_EMAIL,
      password: process.env.D_USER_PASS,
      type: process.env.D_USER_TYPE,
    });
    
    token = loginResponse.body.token;
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", token);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Bad token");
  });

  it("Test malformed token", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearrer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Malformed token");
  });

  it("Test invalid token", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token.split(".")[0]);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Invalid token");
  });

});
