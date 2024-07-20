import { Router } from 'express';
const { authenticateToken } = require('../middleware/authenticate');
import PostsController from '../controllers/PostsController';

const postRoutes = Router();

postRoutes.post('/', authenticateToken, PostsController.postPost);
postRoutes.get('/:id', authenticateToken, PostsController.getPostById);
postRoutes.get('/', authenticateToken, PostsController.getPosts);
postRoutes.get('/user/:id', authenticateToken, PostsController.getPostsByUser);
postRoutes.put('/:id', authenticateToken, PostsController.updatePost);
postRoutes.delete('/:id', authenticateToken, PostsController.deletePost);

export default postRoutes;
