import { Teacher } from "../models/teacher";
import { Student } from "../models/student";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

  async getTeacherById(teacherId) {
    const teacher = await Teacher.findById(
      new mongoose.Types.ObjectId(teacherId)
    );
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

  async getStudentsListByTeacherId(teacherId) {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) return 1;

    let students = [];

    for (let studentId of teacher.studentIds) {
      let student = await Student.findById(studentId);
      student.password = undefined;
      students.push(student);
    }

    return students;
  }

  async removeTeacher(teacherId) {
    const result = await Teacher.deleteOne({ _id: teacherId });

    return result;
  }

  async updatePassword(teacherId, password, newPassword) {
    const teacher = await Teacher.findById(
      new mongoose.Types.ObjectId(teacherId)
    );

    if (!teacher) return 1;

    let result = bcrypt.compareSync(
      password,
      teacher.password,
      function (err, isValid) {
        if (err) throw err;
        return isValid;
      }
    );

    if (result) {
      teacher.password = newPassword;
      teacher.save();
      return 0;
    } else return 2;
  }
}

export { TeacherService };
