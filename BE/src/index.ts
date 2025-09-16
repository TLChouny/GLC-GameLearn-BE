import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables BEFORE importing modules that read process.env
dotenv.config();

// Import routes
import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/gameRoutes';
import itemRoutes from './routes/itemRoutes';
import rankingRoutes from './routes/rankingRoutes';
import authRoutes from './routes/authRoutes';

// Import passport AFTER dotenv.config()
import passport from './config/passport';

// Import middleware
import { errorHandler, notFound } from './middlewares/errorHandler';

// Import database connection
import connectDB from './config/database';

const app = express();

// Connect to database
connectDB();

// CORS: allow both local and production FE domains
const allowedOrigins = [
  (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  'https://glc-game-learn-fe.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// Place CORS BEFORE other middleware (helmet, rate limiter...) so preflight succeeds
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = (origin || '').replace(/\/$/, '');
    // Allow specific list OR any vercel.app subdomain (for preview deployments)
    const isVercelPreview = /https?:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(normalizedOrigin);
    const isAllowed = allowedOrigins.includes(normalizedOrigin) || isVercelPreview;
    if (!isAllowed) {
      console.warn(`[CORS] Blocked origin: ${normalizedOrigin}`);
    }
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Do NOT lock allowedHeaders; let the library reflect request headers automatically
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Security middleware (after CORS)
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
