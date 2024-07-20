import { Router } from 'express';
const { authenticateToken } = require('../middleware/authenticate');
import LikesController from '../controllers/LikesController';

const likeRoutes = Router();

likeRoutes.post('/', authenticateToken, LikesController.likePost);
likeRoutes.delete('/', authenticateToken, LikesController.unlikePost);
likeRoutes.get(
  '/post/:postId',
  authenticateToken,
  LikesController.getLikesByPost
);

export default likeRoutes;
