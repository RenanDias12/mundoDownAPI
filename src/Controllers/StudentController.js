import { StudentService } from "../services/studentService";

class StudentController {
  constructor() {}

  async create(request, response) {
    const studentService = new StudentService();

    try {
      const result = await studentService.createStudent(request.body);

      if (result === 2)
        return response
          .status(424)
          .json({ Error: "Failed to link student with the teacher" });
      else if (result)
        return response.status(201).json({ Message: "Student created" });
      else return response.status(409).json({ Error: "Existent student" });
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getAll(request, response) {
    const studentService = new StudentService();

    try {
      const data = await studentService.getAllStudents();

      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getById(request, response) {
    const studentService = new StudentService();

    try {
      const data = await studentService.getStudentById(request.query.id);
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getByEmail(request, response) {
    const studentService = new StudentService();

    try {
      const data = await studentService.getStudentByEmail(request.query.email);
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getTeacherByStudentId(request, response) {
    const studentService = new StudentService();

    try {
      const data = await studentService.getTeacherByStudentId(request.query.id);
      if(data == 1) return response.status(404).json({ Message: "Teacher not found" });
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async remove(request, response) {
    const studentService = new StudentService();

    try {
      const result = await studentService.removeStudent(request.query.id);

      if (result.deletedCount)
        return response.status(200).json({ Message: "Student removed" });
      else return response.status(404).json({ Error: "Student not found" });
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async updatePassword(request, response) {
    const studentService = new StudentService();

    try {
      const result = await studentService.updateStudentPassword(
        request.body.id,
        request.body.password,
        request.body.newPassword
      );

      if (result === 1)
        return response.status(404).json({ Error: "Student not found" });
      else if (result === 2)
        return response.status(401).json({ Error: "Invalid password" });
      else return response.status(200).json({ Message: "Password updated" });
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }
}

export { StudentController };
