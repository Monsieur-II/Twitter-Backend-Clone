import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PostsController {
  static async postPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, user, image } = req.body;

      const result = await prisma.post.create({
        data: {
          content,
          userId: user.id,
          image,
          userName: user.userName,
          name: user.name,
        },
      });

      if (!result) {
        res.status(424).json({ message: 'Failed to create post' });
        res.end();
        return;
      }

      res.status(201).json({ result });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
              reposts: true,
            },
          },
        },
      });
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        res.end();
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  static async getPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { search } = req.query;
      const pageNumber = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.size as string) || 10;

      const totalCount = await prisma.post.count({
        where: {
          content: {
            contains: search ? String(search) : '',
          },
        },
      });

      const posts = await prisma.post.findMany({
        where: {
          content: {
            contains: search ? String(search) : '',
          },
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: [
          {
            comments: {
              _count: 'desc',
            },
          },
          {
            likes: {
              _count: 'desc',
            },
          },
          {
            reposts: {
              _count: 'desc',
            },
          },
        ],
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
              reposts: true,
            },
          },
        },
      });

      res.status(200).json({
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageNumber,
        pageSize,
        data: posts,
      });
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async getPostsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const pageNumber = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.size as string) || 10;

      const totalCount = await prisma.post.count({
        where: {
          userId: id,
        },
      });
      const posts = await prisma.post.findMany({
        where: {
          userId: id,
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: [
          {
            comments: {
              _count: 'desc',
            },
          },
          {
            likes: {
              _count: 'desc',
            },
          },
          {
            reposts: {
              _count: 'desc',
            },
          },
        ],
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
              reposts: true,
            },
          },
        },
      });

      res.status(200).json({
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        pageNumber,
        pageSize,
        data: posts,
      });
      res.end;
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: req.body.userId,
        },
      });
      if (user!.isVerified === false) {
        res.status(403).json({ message: 'Subscribe to Premium version' });
        res.end();
        return;
      }

      const { content, image } = req.body;
      const post = await prisma.post.update({
        where: {
          id,
        },
        data: {
          content,
          image,
        },
      });
      res.status(200).json(post);
      res.end();
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { user } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      if (!post || user.id !== post?.userId) {
        res.status(403).json({ message: 'Unauthorized' });
        res.end();
        return;
      }

      const isDeleted = await prisma.post.delete({
        where: {
          id,
        },
      });
      if (!isDeleted) {
        res.status(424).json({ message: 'Failed to delete post' });
        res.end();
        return;
      }
      res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default PostsController;
