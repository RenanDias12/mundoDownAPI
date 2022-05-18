import { TestDatabase } from "./database";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "./testServer";

describe("Teacher test", () => {
  const testDatabase = new TestDatabase();
  let token = "";

  beforeAll(async () => {
    await testDatabase.connect();
    const loginResponse = await supertest(app)
    .post("/auth/login")
    .send({
      email: process.env.D_USER_EMAIL,
      password: process.env.D_USER_PASS,
      type: process.env.D_USER_TYPE,
    });
    
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();    
  });

  it("Send email", async () => {
    const body = {
        "to": process.env.EMAIL_EXAMPLE,
        "subject": "Email de Teste do Jest",
        "text": "Aluno(a): Mary Evans,\nIdade: 8,\nAtividades: 15,\nAcertos: 15,\nDesempenho: 100%"
    }
    const response = await supertest(app)
      .post("/email")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe(`Email sent to ${process.env.EMAIL_EXAMPLE}`);
  });

  it("Send email - Without token", async () => {
    const body = {
        "to": process.env.EMAIL_EXAMPLE,
        "subject": "Email de Teste do Jest",
        "text": "Aluno(a): Mary Evans,\nIdade: 8,\nAtividades: 15,\nAcertos: 15,\nDesempenho: 100%"
    }
    const response = await supertest(app)
      .post("/email")
      .set("Accept", "application/json")
      .send(body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Unprovided token");
  });
  
});
