import express from 'express';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import authRoutes from './routes/authRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';
import repostRoutes from './routes/repostRoutes';
import notFound from './middleware/not_found';
import errorHandler from './middleware/errorHandler';

const rateLimiter = require('express-rate-limit');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT;
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW;
const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX;

const app = express();

app.use(
  rateLimiter({
    windowMs: RATE_LIMIT_WINDOW,
    max: RATE_LIMIT_MAX,
  })
);
app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/reposts', repostRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
