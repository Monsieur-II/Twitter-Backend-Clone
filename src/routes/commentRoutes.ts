import { Router } from 'express';
const { authenticateToken } = require('../middleware/authenticate');
import CommentsController from '../controllers/CommentsController';

const commentRoutes = Router();

commentRoutes.post('/', authenticateToken, CommentsController.postComment);
commentRoutes.get(
  '/:postId',
  authenticateToken,
  CommentsController.getPostComments
);
commentRoutes.put('/:id', authenticateToken, CommentsController.updateComment);
commentRoutes.delete(
  '/:id',
  authenticateToken,
  CommentsController.deleteComment
);

export default commentRoutes;
