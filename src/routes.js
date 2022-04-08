import {Router} from 'express';
import {TeacherController} from './Controllers/TeacherController';


const routes = Router();

const teacherController = new TeacherController();

routes.get('/', (req, res) => {
  res.status(200).send('Home page mundo Down API!');
});

routes.post('/teacher', teacherController.create);
routes.get('/teacher', teacherController.getAll);
routes.get('/teacherByEmail', teacherController.getByEmail);

export {routes};
