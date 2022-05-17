import mongoose from "mongoose";
import { Teacher } from "../models/teacher";

class Migration {
  constructor() {}

  async up() {
    let teacher = await Teacher.find({});

    if (teacher.length) return 0;

    const user = new Teacher({
      _id: new mongoose.Types.ObjectId(),
      name: process.env.D_USER_NAME,
      email: process.env.D_USER_EMAIL,
      password: process.env.D_USER_PASS,
    });
    await user.save();
  }
}

export { Migration };
