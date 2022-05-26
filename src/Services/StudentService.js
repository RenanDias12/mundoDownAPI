import { Student } from "../models/student";
import { Teacher } from "../models/teacher";
import { Module } from "../models/modules";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

class StudentService {
  constructor() {}

  async createStudent(studentToCreate) {
    let student = await Student.find({})
      .where("email")
      .equals(studentToCreate.email);

    if (student.length) return 0;

    student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: studentToCreate.name,
      email: studentToCreate.email,
      age: studentToCreate.age,
      fone: studentToCreate.fone,
      password: studentToCreate.password,
    });
    const result = await student.save();

    return result;
  }

  async getAllStudents() {
    const students = await Student.find();
    students.forEach((s) => (s.password = undefined));

    return students;
  }

  async getStudentById(studentId) {
    const student = await Student.findById(studentId);
    student.password = undefined;

    return student;
  }

  async getStudentByEmail(candidateEmail) {
    const student = await Student.findOne()
      .where("email")
      .equals(candidateEmail);
    student.password = undefined;

    return student;
  }

  async putModule(studentId, studentModule) {
    studentId = new mongoose.Types.ObjectId(studentId);

    let student = await Student.findById(studentId);

    if (!student) return 0;

    const moduleDocument = new Module({
      _id: new mongoose.Types.ObjectId(),
      name: studentModule.name,
      startDate: new Date(),
      tasks: studentModule.tasks,
    });

    await moduleDocument.save();

    student.modules.push(moduleDocument._id);

    await student.save();

    return 1;
  }

  async putTeacher(studentId, teacherId) {
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

  async getTeachersByStudentId(studentId) {
    let teachers = await Teacher.find()
      .where("studentIds")
      .in(new mongoose.Types.ObjectId(studentId));
    if (!teachers.length) return 1;

    teachers.forEach((t) => {
      t.password = undefined;
      t.studentIds = undefined;
    });

    return teachers;
  }

  async removeStudent(studentId) {
    const result = await Student.deleteOne({ _id: studentId });

    if (result.deletedCount) {
      await Teacher.find()
        .where("studentIds")
        .in(new mongoose.Types.ObjectId(studentId))
        .then((teachers) => {
          if (teachers.length) {
            teachers.forEach(async (teacher) => {
              teacher.studentIds.remove(new mongoose.Types.ObjectId(studentId));
              await teacher.save();
            });
          }
        });

      return 1;
    } else return 0;
  }

  async updatePassword(studentId, password, newPassword) {
    const student = await Student.findById(
      new mongoose.Types.ObjectId(studentId)
    );

    if (!student) return 1;

    let result = bcrypt.compareSync(
      password,
      student.password,
      function (err, isValid) {
        if (err) throw err;
        return isValid;
      }
    );

    if (result) {
      student.password = newPassword;
      student.save();
      return 0;
    } else return 2;
  }
}

export { StudentService };
