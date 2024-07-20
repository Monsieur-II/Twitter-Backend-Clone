import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PostsController {
  static async postPost(req: Request, res: Response): Promise<void> {
    const { content, userId, image } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const result = await prisma.post.create({
      data: {
        content,
        userId,
        image,
        userName: user?.name,
      },
    });

    if (!result) {
      res.status(500).json({ message: 'Unable to create post' });
      res.end();
      return;
    }

    res.status(201).json({ result });
  }

  static async getPostById(req: Request, res: Response): Promise<void> {
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
  }

  static async getPosts(req: Request, res: Response): Promise<void> {
    const { search } = req.query;
    const posts = await prisma.post.findMany({
      where: {
        content: {
          contains: search ? String(search) : '',
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const sortedPosts = posts.sort((a, b) => b._count.likes - a._count.likes);
    res.status(200).json(sortedPosts);
    res.end();
  }

  static async getPostsByUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const posts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    res.status(200).json(posts);
    res.end;
  }

  static async updatePost(req: Request, res: Response): Promise<void> {
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
  }

  static async deletePost(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post || req.body.userId !== post?.userId) {
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
      res.status(424).json({ message: 'Unable to delete post' });
      res.end();
      return;
    }
    res.sendStatus(204);
  }
}

export default PostsController;
