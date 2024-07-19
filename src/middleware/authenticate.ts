import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const unAuthorized = { error: 'Unauthorized' };

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token || !token.startsWith('Bearer'))
    return res.status(401).json(unAuthorized);

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err: Error) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = { authenticateToken };
