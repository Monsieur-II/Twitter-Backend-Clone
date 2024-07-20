import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class RepostsController {
  static async repostPost(
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

      const repost = await prisma.repost.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });
      if (repost) {
        res
          .status(400)
          .json({ message: 'User has already reposted this post' });
        res.end();
        return;
      }

      const result = await prisma.repost.create({
        data: {
          postId,
          userId: user.id,
          userName: user.name,
        },
      });

      if (!result) {
        res.status(424).json({ message: 'Failed to repost post' });
        res.end();
        return;
      }

      res.status(201).json({ result });
    } catch (error) {
      next(error);
    }
  }

  static async removeRepost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId, user } = req.body;

      const repost = await prisma.repost.findFirst({
        where: {
          postId,
          userId: user.id,
        },
      });

      if (!repost) {
        res.status(400).json({ message: 'User has not reposted this post' });
        res.end();
        return;
      }

      const result = await prisma.repost.delete({
        where: {
          id: repost.id,
        },
      });

      if (!result) {
        res.status(424).json({ message: 'Failed to remove repost' });
        res.end();
        return;
      }

      res.status(200).json({ message: 'Repost removed' });
    } catch (error) {
      next(error);
    }
  }

  static async getPostReposts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;
      const pageNumber = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.size as string) || 10;

      const totalCount = await prisma.repost.count({
        where: {
          postId,
        },
      });
      const reposts = await prisma.repost.findMany({
        where: {
          postId,
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      res.status(200).json({
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageNumber,
        pageSize,
        data: reposts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default RepostsController;
