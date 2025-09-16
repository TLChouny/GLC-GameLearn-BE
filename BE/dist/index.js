"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
const rankingRoutes_1 = __importDefault(require("./routes/rankingRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Import passport
const passport_1 = __importDefault(require("./config/passport"));
// Import middleware
const errorHandler_1 = require("./middlewares/errorHandler");
// Import database connection
const database_1 = __importDefault(require("./config/database"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to database
(0, database_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
// Rate limiting
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
// API routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/games', gameRoutes_1.default);
app.use('/api/items', itemRoutes_1.default);
app.use('/api/rankings', rankingRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map