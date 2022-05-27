import supertest from "supertest";
import app from "./testServer";
import { TestDatabase } from "./database";
import mongoose from "mongoose";

const testDatabase = new TestDatabase();
describe("Teacher routes tests", () => {
  let token = "";
  const studentMock = {
    id: "",
    name: "Mary Evans",
    age: 12,
    fone: "+55 35 998765654",
    email: "maryEvans@email.com",
    password: "mypass",
    teacherIds: [],
    modules: []
  };
  const teacherMock = {
    id: "",
    name: "John Doe",
    age: 34,
  	fone: "+55 35 998765654",
    email: "johnDoe@email.com",
    password: "mypass",
    studentIds: []
  };
  
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

    await supertest(app)
      .post("/student")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(studentMock);

    const student = await supertest(app)
      .get(`/studentByEmail?email=${studentMock.email}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    studentMock.id = student.body._id;
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Create teacher - Without token", async () => {
    const response = await supertest(app)
      .post("/teacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get all teachers - Without token", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get teacher by Id - Without token", async () => {
    const response = await supertest(app)
      .get("/teacherById")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get teacher by email - Without token", async () => {
    const response = await supertest(app)
      .get("/teacherByEmail")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Get students list - Without token", async () => {
    const response = await supertest(app)
      .get("/studentsList")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Update teacher password - Without token", async () => {
    const response = await supertest(app)
      .put("/teacher/pass")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Remove teacher - Without token", async () => {
    const response = await supertest(app)
      .delete("/teacher")
      .set("Accept", "application/json");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Unprovided token");
  });

  it("Create teacher", async () => {

    const response = await supertest(app)
      .post("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(teacherMock);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Teacher created");
  });

  it("Create teacher with conflict", async () => {

    const response = await supertest(app)
      .post("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(teacherMock);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Existent teacher");
  });

  it("Get all teachers", async () => {
    const response = await supertest(app)
      .get("/teacher")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    teacherMock.id = response.body[1]._id;
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("Get teacher by Id", async () => {
    const response = await supertest(app)
      .get(`/teacherById?id=${teacherMock.id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body._id).toBe(teacherMock.id);
    expect(response.body.name).toBe(teacherMock.name);
    expect(response.body.email).toBe(teacherMock.email);
  });

  it("Get teacher by email", async () => {
    const response = await supertest(app)
      .get(`/teacherByEmail?email=${teacherMock.email}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body._id).toBe(teacherMock.id);
    expect(response.body.name).toBe(teacherMock.name);
    expect(response.body.email).toBe(teacherMock.email);
  });

  it("Put a student", async () => {
    const response = await supertest(app)
      .put('/teacher/student')
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({studentId: studentMock.id, teacherId: teacherMock.id});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Student added");
  });

  it("Get students list", async () => {
    const response = await supertest(app)
      .get(`/studentsList?id=${teacherMock.id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("Update teacher password", async () => { 
    const body = {
      "id": teacherMock.id,
      "password": teacherMock.password,
      "newPassword": "123"
    }
    const response = await supertest(app)
      .put("/teacher/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("Message");
    expect(response.body.Message).toBe("Password updated");
  });

  it("Update teacher password - With wrong id", async () => { 
    const body = {
      "id": new mongoose.Types.ObjectId().toString(),
      "password": teacherMock.password,
      "newPassword": "123"
    };
    const response = await supertest(app)
      .put("/teacher/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Teacher not found");
  });

  it("Update teacher password - With wrong password", async () => { 
    const body = {
      "id": teacherMock.id,
      "password": teacherMock.password,
      "newPassword": "123"
    };
    const response = await supertest(app)
      .put("/teacher/pass")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(body);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("Error");
    expect(response.body.Error).toBe("Invalid password");
  });
});
