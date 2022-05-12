import { Student } from "../models/student";
import { Teacher } from "../models/teacher";
import mongoose from "mongoose";

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
      password: studentToCreate.password,
    });
    const result = await student.save();

    var teacher = await Teacher.findById(studentToCreate.teacherId);
    if (teacher) {
      teacher.studentIds.push(student._id);
      await Teacher.updateOne({ _id: teacher._id }, teacher);
    } else {
      console.log("Student not added to teacher");
      await Student.deleteOne({ _id: student._id });
      return 2;
    }

    return result;
  }

  async getAllStudents() {
    const students = await Student.find();
    students.forEach((s) => (s.password = undefined));

    return students;
  }

  async getById(studentId) {
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

  async getTeacherByStudentId(studentId) {
    let teacher = await Teacher.findOne()
      .where("studentIds")
      .in(new mongoose.Types.ObjectId(studentId));
    if (!teacher) return 1;
    teacher.studentIds = undefined;
    teacher.password = undefined;

    return teacher;
  }

  async removeStudent(studentId) {
    const result = await Student.deleteOne({ _id: studentId });

    if (result.deletedCount) {
      var teacher = await Teacher.findOne({
        studentIds: new mongoose.Types.ObjectId(studentId),
      });
      if (teacher) {
        teacher.studentIds.remove(studentId);
        const teacherResult = await Teacher.updateOne(
          { _id: teacher._id },
          teacher
        );

        if (teacherResult.modifiedCount) {
          console.log("Student removed from teacher");
        }
      }
    }

    return result;
  }

  //TODO: update password
  async updatePassword(studentId, password, newPassword) {}
}

export { StudentService };
