import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class LikesController {
  static async likePost(req: Request, res: Response): Promise<void> {
    const { postId, userId } = req.body;

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
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
    if (existingLike) {
      res.status(400).json({ message: 'User has already liked this post' });
      res.end();
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const result = await prisma.like.create({
      data: {
        postId,
        userId,
        userName: user?.name,
      },
    });

    if (!result) {
      res.status(500).json({ message: 'Unable to like post' });
      res.end();
      return;
    }

    res.status(201).json({ result });
  }

  static async unlikePost(req: Request, res: Response): Promise<void> {
    const { postId, userId } = req.body;
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (!existingLike) {
      res.status(400).json({ message: 'User has not liked this post' });
      res.end();
      return;
    }

    const result = await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    if (!result) {
      res.status(500).json({ message: 'Unable to unlike post' });
      res.end();
      return;
    }

    res.status(200).json({ message: 'Post unliked' });
  }

  static async getLikesByPost(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const likes = await prisma.like.findMany({
      where: {
        postId,
      },
    });

    res.status(200).json(likes);
  }
}

export default LikesController;
