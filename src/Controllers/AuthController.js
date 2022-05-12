import { Teacher } from "../models/teacher";
import { Student } from "../models/student";
import jsonwebtoken from "jsonwebtoken";

class AuthController {
  async verifyUser(request, response, next) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return response.status(401).json({ Error: "Unprovided token" });
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2) {
        return response.status(401).json({ Error: "Bad token" });
      }

      const [prefix, token] = parts;

      if (!/^Bearer$/i.test(prefix)) {
        return response.status(401).json({ Error: "Malformed token" });
      }

      jsonwebtoken.verify(token, process.env.JWT_KEY, (err) => {
        if (err) return response.status(401).json({ Error: "Invalid token" });

        return next();
      });
    } catch (error) {
      return response.status(500).json({
        Message: error.message,
      });
    }
  }

  async authUser(request, response) {
    try {
      const { email, password, type } = request.body;

      if (type === "teacher") {
        const teacher = await Teacher.findOne({ email: email });
        if (!teacher) {
          return response.status(401).json({ Error: "Teacher not found" });
        }

        teacher.comparePassword(password, (err, isValid) => {
          if (err) return response.status(500).json({ Error: "Server error" });
          if (!isValid)
            return response.status(401).json({ Error: "Invalid password" });
          const token = jsonwebtoken.sign(
            {
              id: teacher._id,
              email: teacher.email,
              type: "teacher",
            },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );
          return response.status(200).json({
            token: token,
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
          });
        });
      } else if (type === "student") {
        const student = await Student.findOne({ email: email });
        if (!student) {
          return response.status(401).json({ Error: "Student not found" });
        }

        student.comparePassword(password, (err, isValid) => {
          if (err) return response.status(500).json({ Error: "Server error" });
          if (!isValid)
            return response.status(401).json({ Error: "Invalid password" });
          const token = jsonwebtoken.sign(
            {
              id: student._id,
              email: student.email,
              type: "student",
            },
            process.env.JWT_KEY,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );
          return response.status(200).json({
            token: token,
            id: student._id,
            name: student.name,
            email: student.email,
          });
        });
      } else return response.status(401).json({ Error: "Invalid user type" });
    } catch (error) {
      return response.status(500).json({
        Message: error.message,
      });
    }
  }
}

export { AuthController };
