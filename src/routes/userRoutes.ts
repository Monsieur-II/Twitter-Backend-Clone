import { Router } from 'express';
import UsersController from '../controllers/UsersController';
const {
  validateNewUserAsync,
  validateUpdateUserAsync,
} = require('../middleware/validateUser');
const { authenticateToken } = require('../middleware/authenticate');

const userRoutes = Router();

userRoutes.get('/', authenticateToken, UsersController.getUsers);
userRoutes.post('/', validateNewUserAsync, UsersController.postUser);
userRoutes.put(
  '/:id',
  authenticateToken,
  validateUpdateUserAsync,
  UsersController.putUser
);
userRoutes.delete('/:id', authenticateToken, UsersController.deleteUser);

export default userRoutes;
