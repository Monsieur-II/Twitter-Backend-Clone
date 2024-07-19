import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        res.status(403).json({
          message: 'Invalid email or password',
        });
        return;
      }

      var isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(403).json({
          message: 'Invalid email or password',
        });
        return;
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({
        message: 'Error logging in user',
      });
    }
  }
}

export default AuthController;
