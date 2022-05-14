import { TestDatabase } from "./database";
import { Teacher } from "../src/models/teacher";
import mongoose from "mongoose";

describe("Teacher test", () => {
  const testDatabase = new TestDatabase();

  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Structure test", async () => {
    const teacher = new Teacher({
      _id: new mongoose.Types.ObjectId(),
      name: "John",
      email: "john@email.com",
      password: "12345",
    });

    expect(teacher).toHaveProperty("_id");
    expect(teacher).toHaveProperty("name");
    expect(teacher).toHaveProperty("email");
    expect(teacher).toHaveProperty("password");
    expect(teacher).toHaveProperty("studentIds");
  });

  it("Result of save", async () => {
    const teacher = new Teacher({
      _id: new mongoose.Types.ObjectId(),
      name: "John",
      email: "john@email.com",
      password: "12345",
    });
    const result = await teacher.save();

    expect(result._id).toEqual(teacher._id);
    expect(result.password).not.toEqual("12345");
  });
});
