import mongoose from "mongoose";

const mongoConnection = mongoose.createConnection(
  "mongodb://localhost:27017/users",
  {
    auth: {
      authSource: "user",
    },
    user: "user",
    pass: "tcc2022",
  }
);

export { mongoConnection };
