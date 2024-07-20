import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class LikesController {
  static async likePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId, user } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        res.end();
        return;
      }
      const like = await prisma.like.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });
      if (like) {
        res.status(400).json({ message: 'User has already liked this post' });
        res.end();
        return;
      }

      const result = await prisma.like.create({
        data: {
          postId,
          userId: user.id,
          userName: user.name,
        },
      });

      if (!result) {
        res.status(424).json({ message: 'Failed to like post' });
        res.end();
        return;
      }

      res.status(201).json({ result });
    } catch (error) {
      next(error);
    }
  }

  static async unlikePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId, user } = req.body;
      const like = await prisma.like.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });

      if (!like) {
        res.status(400).json({ message: 'User has not liked this post' });
        res.end();
        return;
      }

      const result = await prisma.like.delete({
        where: {
          id: like.id,
        },
      });

      if (!result) {
        res.status(424).json({ message: 'Failed to unlike post' });
        res.end();
        return;
      }

      res.status(200).json({ message: 'Post unliked' });
    } catch (error) {
      next(error);
    }
  }

  static async getLikesByPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;
      const likes = await prisma.like.findMany({
        where: {
          postId,
        },
      });

      res.status(200).json(likes);
    } catch (error) {
      next(error);
    }
  }
}

export default LikesController;
