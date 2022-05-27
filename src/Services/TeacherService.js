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
      age: teacherToCreate.age,
      fone: teacherToCreate.fone,
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

  async putStudent(teacherId, studentId) {
    teacherId = new mongoose.Types.ObjectId(teacherId);
    studentId = new mongoose.Types.ObjectId(studentId);

    const teacher = await Teacher.findById(teacherId);
    const student = await Student.findById(studentId);

    if (!teacher || !student) return 0;

    if (!teacher.studentIds.includes(studentId)) {
      teacher.studentIds.push(studentId);
      teacher.save();
    }

    if (!student.teacherIds.includes(teacherId)) {
      student.teacherIds.push(teacherId);
      student.save();
    }

    return 1;
  }

  async getStudentsListByTeacherId(teacherId) {
    let students = await Student.find()
      .where("teacherIds")
      .in(new mongoose.Types.ObjectId(teacherId));
    if (!students.length) return [];

    students.forEach((s) => {
      s.password = undefined;
      s.teacherIds = undefined;
    });

    return students;
  }

  async removeTeacher(teacherId) {
    const result = await Teacher.deleteOne({ _id: teacherId });

    if (result.deletedCount) {
      await Student.find()
        .where("teacherIds")
        .in(new mongoose.Types.ObjectId(teacherId))
        .then((students) => {
          if (students.length) {
            students.forEach(async (student) => {
              student.teacherIds.remove(new mongoose.Types.ObjectId(teacherId));
              await student.save();
            });
          }
        });

      return 1;
    } else return 0;
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
