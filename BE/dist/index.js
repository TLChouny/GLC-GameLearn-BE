"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables BEFORE importing modules that read process.env
dotenv_1.default.config();
// Import routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const rankingRoutes_1 = __importDefault(require("./routes/rankingRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const luckyWheelRoutes_1 = __importDefault(require("./routes/luckyWheelRoutes"));
// Import passport AFTER dotenv.config()
const passport_1 = __importDefault(require("./config/passport"));
// Import middleware
const errorHandler_1 = require("./middlewares/errorHandler");
// Import database connection
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
// Connect to database
(0, database_1.default)();
// Tắt ETag để tránh 304 Not Modified từ cơ chế so khớp ETag
app.set('etag', false);
// Vô hiệu hoá cache cho các route API (đặc biệt GET /api/users)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    }
    next();
});
// CORS: allow both local and production FE domains
const allowedOrigins = [
    (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
    'https://glc-game-learn-fe.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];
// Place CORS BEFORE other middleware (helmet, rate limiter...) so preflight succeeds
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
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
app.use((0, cors_1.default)(corsOptions));
// Security middleware (after CORS)
// Allow embedding images from this server on other origins (FE localhost:5173)
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// Rate limiting
// Behind Render/Cloudflare; trust proxy so rate limiter uses X-Forwarded-For
app.set('trust proxy', 1);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Passport middleware
app.use(passport_1.default.initialize());
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// Root route: helpful for uptime checks or direct visits
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'GLC-GameLearn-BE API',
        endpoints: ['/api/users', '/api/games', '/api/items', '/api/rankings', '/api/auth', '/api/lucky-wheels', '/health']
    });
});
// Static file serving for uploads (images)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Also map BE/uploads for environments where cwd is project root
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'BE', 'uploads')));
// API routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/games', gameRoutes_1.default);
app.use('/api/items', itemRoutes_1.default);
app.use('/api/rankings', rankingRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/lucky-wheels', luckyWheelRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map