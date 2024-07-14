import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UsersController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    const users = await prisma.user.findMany();
    res.json(users);
  }
}

export default UsersController;
