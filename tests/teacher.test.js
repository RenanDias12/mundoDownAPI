import { TestDatabase } from "./database";

const testDatabase = new TestDatabase();

beforeAll(async () => {
  console.log("before connect");
  await testDatabase.connect();
  console.log("after connect");
});

afterEach(async () => {
  console.log("before clear");
  await testDatabase.clear();
  console.log("after clear");
});

afterAll(async () => {
  console.log("before disconnect");
  await testDatabase.disconnect();
  console.log("after disconnect");
});

describe("First Group Of Tests", () => {
  it("First Test", () => {
    expect(2 + 2).toBe(4);
  });
});
