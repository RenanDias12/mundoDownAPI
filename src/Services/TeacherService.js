import { Teacher } from "../models/Teacher";
import mongoose from "mongoose";

class TeacherService {
  constructor() {}

  async createTeacher(teacherToCreate) {
    let teacher = await Teacher.find({})
      .where("email")
      .equals(teacherToCreate.email);

    if (teacher.length) return 0;

    teacher = new Teacher({
      _id: new mongoose.Types.ObjectId(),
      name: teacherToCreate.name,
      email: teacherToCreate.email,
      password: teacherToCreate.password,
    });
    const result = await teacher.save();

    return result;
  }

  async getAllTeachers() {
    const teachers = await Teacher.find();
    teachers.forEach((t) => (t.password = undefined));

    return teachers;
  }

  async getTacherById(teacherId) {
    const teacher = await Teacher.findById(teacherId);
    teacher.password = undefined;

    return teacher;
  }

  async getTeacherByEmail(candidateEmail) {
    const teacher = await Teacher.findOne()
      .where("email")
      .equals(candidateEmail);
    teacher.password = undefined;

    return teacher;
  }

  async removeTeacher(teacherId) {
    const result = await Teacher.deleteOne({ _id: teacherId });

    return result;
  }

  //TODO: update password
  async updatePassword(teacherId, password, newPassword) {}
}

export { TeacherService };
