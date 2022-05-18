import supertest from "supertest";
import app from "./testServer";
import { TestDatabase } from "./database";
import mongoose from "mongoose";

const testDatabase = new TestDatabase();
describe("Student routes tests", () => {
  let token = "";
  const studentMock = {
    id: "",
    name: "Mary Evans",
    email: "maryEvans@email.com",
    password: "mypass",
    teacherId: "",
  };
  const teacherMock = {
    id: "",
    name: "John Doe",
    email: "johnDoe@email.com",
    password: "mypass",
  };

  beforeAll(async () => {
    await testDatabase.connect();
    const loginResponse = await supertest(app).post("/auth/login").send({
      email: process.env.D_USER_EMAIL,
      password: process.env.D_USER_PASS,
      type: process.env.D_USER_TYPE,
    });

    token = loginResponse.body.token;

    await supertest(app)
      .post("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(teacherMock);

    const teacher = await supertest(app)
      .get(`/teacherByEmail?email=${teacherMock.email}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    teacherMock.id = teacher.body._id;
    studentMock.teacherId = teacher.body._id;
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Create student - Without token", async () => {
    const response = await supertest(app)
      .post("/student")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get all students - Without token", async () => {
    const response = await supertest(app)
      .get("/student")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get student by Id - Without token", async () => {
    const response = await supertest(app)
      .get("/studentById")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get student by email - Without token", async () => {
    const response = await supertest(app)
      .get("/studentByEmail")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get teacher - Without token", async () => {
    const response = await supertest(app)
      .get("/myTeacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Update student password - Without token", async () => {
    const response = await supertest(app)
      .put("/student/pass")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Remove student - Without token", async () => {
    const response = await supertest(app)
      .delete("/student")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Create student", async () => {
    const response = await supertest(app)
      .post("/student")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(studentMock);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Student created");
  });

  it("Create student with conflict", async () => {
    const response = await supertest(app)
      .post("/student")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(studentMock);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Existent student");
  });

  it("Get all students", async () => {
    const response = await supertest(app)
      .get("/student")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    studentMock.id = response.body[0]._id;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("Get student by Id", async () => {
    const response = await supertest(app)
      .get(`/studentById?id=${studentMock.id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body._id).toBe(studentMock.id);
    expect(response.body.name).toBe(studentMock.name);
    expect(response.body.email).toBe(studentMock.email);
  });

  it("Get student by email", async () => {
    const response = await supertest(app)
      .get(`/studentByEmail?email=${studentMock.email}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body._id).toBe(studentMock.id);
    expect(response.body.name).toBe(studentMock.name);
    expect(response.body.email).toBe(studentMock.email);
  });

  it("Get my teacher", async () => {
    const response = await supertest(app)
      .get(`/myTeacher?id=${studentMock.id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(teacherMock.id);
    expect(response.body.name).toBe(teacherMock.name);
    expect(response.body.email).toBe(teacherMock.email);
  });

  it("Update student password", async () => {
    const body = {
      id: studentMock.id,
      password: studentMock.password,
      newPassword: "123",
    };
    const response = await supertest(app)
      .put("/student/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Password updated");
  });

  it("Update student password - With wrong id", async () => {
    const body = {
      id: new mongoose.Types.ObjectId().toString(),
      password: studentMock.password,
      newPassword: "123",
    };
    const response = await supertest(app)
      .put("/student/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Student not found");
  });

  it("Update student password - With wrong password", async () => {
    const body = {
      id: studentMock.id,
      password: studentMock.password,
      newPassword: "123",
    };
    const response = await supertest(app)
      .put("/student/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Invalid password");
  });
});
