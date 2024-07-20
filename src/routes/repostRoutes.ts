import { Router } from 'express';
const { authenticateToken } = require('../middleware/authenticate');
import RepostsController from '../controllers/RepostsController';

const repostRoutes = Router();

repostRoutes.post('/', authenticateToken, RepostsController.repostPost);
repostRoutes.delete('/', authenticateToken, RepostsController.removeRepost);
repostRoutes.get(
  '/post/:postId',
  authenticateToken,
  RepostsController.getPostReposts
);

export default repostRoutes;
