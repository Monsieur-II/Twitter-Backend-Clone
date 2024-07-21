import { Router } from 'express';
import FollowController from '../controllers/FollowController';
const { authenticateToken } = require('../middleware/authenticate');

const followRoutes = Router();

followRoutes.post('/', authenticateToken, FollowController.followUser);
followRoutes.delete('/', authenticateToken, FollowController.unfollowUser);

export default followRoutes;
