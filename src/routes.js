import { Router } from "express";
import { TeacherController } from "./Controllers/TeacherController";
import { StudentController } from "./Controllers/StudentController";
import { AuthController } from "./Controllers/AuthController";

const routes = Router();

const teacherController = new TeacherController();
const studentController = new StudentController();
const authController = new AuthController();

routes.get("/", (req, res) => {
  res.status(200).send("Home page mundo Down API!");
});

//Login route
routes.post("/auth/login", authController.authUser);

//Use Bearer token
routes.use(authController.verifyUser);

// Teacher routes
routes.post("/teacher", teacherController.create);
routes.get("/teacher", teacherController.getAll);
routes.get("/teacherById", teacherController.getById);
routes.get("/teacherByEmail", teacherController.getByEmail);
routes.delete("/teacher", teacherController.remove);

// Student routes
routes.post("/student", studentController.create);
routes.get("/student", studentController.getAll);
routes.get("/studentById", studentController.getById);
routes.get("/studentByEmail", studentController.getByEmail);
routes.delete("/student", studentController.remove);

export { routes };
