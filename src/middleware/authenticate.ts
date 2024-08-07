import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const jwt = require('jsonwebtoken');
const unAuthorized = { error: 'Unauthorized' };
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer'))
      return res.status(401).json(unAuthorized);

    jwt.verify(
      token.split(' ')[1],
      JWT_SECRET,
      async (err: Error, client: any) => {
        if (err) {
          console.log(err.message);
          return res.sendStatus(401);
        }
        req.body.userId = client.id;
        var user = await prisma.user.findUnique({
          where: {
            id: client.id,
          },
        });

        if (!user) {
          res.status(401).json(unAuthorized);
          res.end();
          return;
        }
        req.body.user = user;

        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticateToken };
