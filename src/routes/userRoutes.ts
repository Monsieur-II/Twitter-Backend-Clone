import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const userRoutes = Router();

userRoutes.get('/', UsersController.getUsers);

export default userRoutes;
