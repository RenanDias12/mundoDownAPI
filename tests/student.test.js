import { TestDatabase } from "./database";
import { Student } from "../src/models/student";
import mongoose from "mongoose";

const testDatabase = new TestDatabase();
beforeAll(async () => {
  await testDatabase.connect();
});

afterAll(async () => {
  await testDatabase.clear();
  await testDatabase.disconnect();
});

describe("Student test", () => {
  it("Structure test", async () => {
    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    expect(student).toHaveProperty("_id");
    expect(student).toHaveProperty("name");
    expect(student).toHaveProperty("email");
    expect(student).toHaveProperty("password");
  });

  it("Result of save", async () => {
    const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: "John",
      email: "john@email.com",
      password: "12345",
    });
    const result = await student.save();

    expect(result._id).toEqual(student._id);
    expect(result.password).not.toEqual("12345");
  });
});
