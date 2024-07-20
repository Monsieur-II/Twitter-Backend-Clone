import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CommentsController {
  static async postComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, postId, user } = req.body;

      const postExists = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!postExists) {
        res.status(404).json({ message: 'Post not found' });
        res.end();
        return;
      }

      const result = await prisma.comment.create({
        data: {
          content,
          userId: user.id,
          postId,
          userName: user.name,
        },
      });

      if (!result) {
        res
          .status(424)
          .json({ message: 'Failed to post comment, please try again' });
        res.end();
        return;
      }

      res.status(201).json({ result });
    } catch (error) {
      next(error);
    }
  }

  static async getPostComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { postId } = req.params;
      const pageNumber = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.size as string) || 10;

      const totalCount = await prisma.comment.count({
        where: {
          postId,
        },
      });
      const comments = await prisma.comment.findMany({
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
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { content, user } = req.body;

      var existingComment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!existingComment) {
        res.status(404).json({ message: 'Comment not found' });
        res.end();
        return;
      }

      if (existingComment.userId !== user.id) {
        res.status(403).json({ message: 'Forbidden' });
        res.end();
        return;
      }

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
        res
          .status(424)
          .json({ message: 'Failed to update comment. Please try again' });
        res.end();
        return;
      }

      res.status(200).json({ comment });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { user } = req.body;

      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        res.end();
        return;
      }

      if (user.id !== comment.userId) {
        res.status(403).json({ message: 'Forbidden' });
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
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsController;
