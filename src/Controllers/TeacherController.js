import { TeacherService } from "../Services/TeacherService";

class TeacherController {
  constructor() {}

  async create(request, response) {
    const teacherService = new TeacherService();

    try {
      const result = await teacherService.createTeacher(request.body);

      if (result)
        return response.status(201).json({ Message: "Teacher created" });
      else return response.status(409).json({ Error: "Existent teacher" });
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getAll(request, response) {
    const teacherService = new TeacherService();

    try {
      const data = await teacherService.getAllTeachers();

      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getById(request, response) {
    const teacherService = new TeacherService();

    try {
      const data = await teacherService.getTeacherById(request.query.id);
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async getByEmail(request, response) {
    const teacherService = new TeacherService();

    try {
      const data = await teacherService.getTeacherByEmail(request.query.email);
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }

  async remove(request, response) {
    const teacherService = new TeacherService();

    try {
      const result = await teacherService.removeTeacher(request.query.id);

      if (result.deletedCount)
        return response.status(200).json({ Message: "Teacher removed" });
      else return response.status(404).json({ Error: "Teacher not found" });
    } catch (error) {
      return response.status(500).json({ Error: error.message });
    }
  }
}

export { TeacherController };
