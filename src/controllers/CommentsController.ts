import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CommentsController {
  static async postComment(req: Request, res: Response): Promise<void> {
    const { content, userId, postId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const result = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
        userName: user?.name,
      },
    });

    if (!result) {
      res.status(500).json({ message: 'Unable to post comment' });
      res.end();
      return;
    }

    res.status(201).json({ result });
  }

  static async getPostComments(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });

    res.status(200).json(comments);
  }

  static async updateComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { content } = req.body;

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

    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    if (!comment) {
      res.status(424).json({ message: 'Unable to update comment' });
      res.end();
      return;
    }

    res.status(200).json({ comment });
  }

  static async deleteComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment || req.body.userId !== comment?.userId) {
      res.status(403).json({ message: 'Unauthorized' });
      res.end();
      return;
    }

    const isDeleted = await prisma.comment.delete({
      where: {
        id,
      },
    });

    if (!isDeleted) {
      res.status(424).json({ message: 'Unable to delete comment' });
      res.end();
      return;
    }

    res.status(200).json({ message: 'Comment deleted' });
  }
}

export default CommentsController;
