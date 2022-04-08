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
    const result = teacher.save();

    return result;
  }

  async getAllTeachers() {
    const teachers = await Teacher.find();
    teachers.forEach(t => t.password = undefined);

    return teachers;
  }

  async getTeacherByEmail(candidateEmail){
    const teacher = await Teacher.findOne().where('email').equals(candidateEmail);
    teacher.password = undefined;
    
    return teacher;
  }
}

export { TeacherService };
