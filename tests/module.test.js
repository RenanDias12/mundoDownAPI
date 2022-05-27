import { TestDatabase } from "./database";
import { Module } from "../src/models/modules";
import mongoose from "mongoose";

describe("Student test", () => {
  const testDatabase = new TestDatabase();

  beforeAll(async () => {
    await testDatabase.connect();
  });

  afterAll(async () => {
    await testDatabase.clear();
    await testDatabase.disconnect();
  });

  it("Structure test", async () => {
    const module = new Module({
      _id: new mongoose.Types.ObjectId(),
      name: "Salutations",
      tasks: [{
        task: 1,
        description: "Hello",
        result: "Success"
      },
      {
        task: 2,
        description: "Goodbye",
        result: "Success"
      }]      
    });

    expect(module).toHaveProperty("_id");
    expect(module).toHaveProperty("name");
    expect(module).toHaveProperty("tasks");
  });

  it("Result of save", async () => {
    const module = new Module({
      _id: new mongoose.Types.ObjectId(),
      name: "Salutations",
      startDate: new Date(),
      tasks: [{
        task: 1,
        description: "Hello!",
        result: 1
      },
      {
        task: 2,
        description: "Goodbye!",
        result: 1
      }]      
    });
    const result = await module.save();

    expect(result._id).toEqual(module._id);
    expect(result.name).toEqual(module.name);
    expect(result.startDate).toEqual(module.startDate);
    expect(result.tasks).toEqual(module.tasks);
  });
});
