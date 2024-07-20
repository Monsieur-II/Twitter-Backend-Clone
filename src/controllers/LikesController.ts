import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class LikesController {
  static async likePost(req: Request, res: Response): Promise<void> {
    const { postId, userId } = req.body;
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
    const result = await prisma.like.create({
      data: {
        postId,
        userId,
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
}

export default LikesController;
