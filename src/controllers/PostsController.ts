import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PostsController {
  static async postPost(req: Request, res: Response): Promise<void> {
    const {};
  }
}
