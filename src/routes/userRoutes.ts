import { Router } from 'express';
import UsersController from '../controllers/UsersController';
const {
  validateNewUserAsync,
  validateUpdateUserAsync,
} = require('../middleware/validateUser');

const userRoutes = Router();

userRoutes.get('/', UsersController.getUsers);
userRoutes.post('/', validateNewUserAsync, UsersController.postUser);
userRoutes.put('/:id', validateUpdateUserAsync, UsersController.putUser);
userRoutes.delete('/:id', UsersController.deleteUser);

export default userRoutes;
