import supertest from "supertest";
import app from "./testServer";
import { TestDatabase } from "./database";
import { send } from "express/lib/response";

const testDatabase = new TestDatabase();
describe("Teacher routes test", () => {
  let token = "";
  const teacherMock = {
    "id": "",
    "name": "John Doe",
    "email": "johnDoe@email.com",
    "password": "123456"
  }
  const studentMock = {
    "id": "",
    "name": "Mary Evans",
    "email": "maryEvans@email.com",
    "password": "123456",
    "teacherId": teacherMock.id
  }
  

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

    teacherMock.id = response.body[0]._id;
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
    expect(response.body.email).toBe(teacherMock.email);
  });

  it("Get students list", async () => {
    //Create and get a student
    await supertest(app)
      .post("/student")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send(studentMock);
    const data = await supertest(app)
      .get(`/studentByEmail?email=${studentMock.email}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);
    studentMock._id = data.body._id;

    const response = await supertest(app)
      .get(`/studentsList?id=${teacherMock.id}`)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // it("Update teacher password", async () => {npm 
  //   const response = await supertest(app)
  //     .get(`/studentsList?id=${teacherMock.id}`)
  //     .set("Accept", "application/json")
  //     .set("Authorization", "Bearer " + token);
  //     send({
  //       "id": teacherMock.id,
  //       "password": "1234",
  //     })

  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array);
  // });
});
