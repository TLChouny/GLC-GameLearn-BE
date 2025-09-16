# Game Learn Backend API

Backend API cho ứng dụng Game Learning sử dụng Node.js, Express, TypeScript và MongoDB.

## Cấu trúc Project

```
src/
├── config/
│   └── database.ts          # Cấu hình kết nối MongoDB
├── controllers/
│   ├── userController.ts    # Xử lý logic cho User
│   ├── gameController.ts    # Xử lý logic cho Game & Match
│   ├── itemController.ts    # Xử lý logic cho Item & Trade
│   └── rankingController.ts # Xử lý logic cho Ranking
├── middleware/
│   ├── auth.ts             # Middleware xác thực JWT
│   ├── validation.ts       # Middleware validation dữ liệu
│   └── errorHandler.ts     # Xử lý lỗi
├── models/
│   ├── User.ts             # Model User
│   ├── Subject.ts          # Model Subject
│   ├── Lesson.ts           # Model Lesson
│   ├── GameChallenge.ts    # Model GameChallenge
│   ├── Match.ts            # Model Match
│   ├── Item.ts             # Model Item
│   ├── HouseDecord.ts      # Model HouseDecord
│   ├── Certificate.ts      # Model Certificate
│   ├── Trade.ts            # Model Trade
│   └── Ranking.ts          # Model Ranking
├── routes/
│   ├── userRoutes.ts       # API routes cho User
│   ├── gameRoutes.ts       # API routes cho Game
│   ├── itemRoutes.ts       # API routes cho Item
│   └── rankingRoutes.ts    # API routes cho Ranking
└── index.ts                # Entry point của ứng dụng
```

## Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Environment Variables
Tạo file `.env` trong thư mục root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/game-learn
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Build và chạy production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Đăng ký user mới
- `POST /api/users/login` - Đăng nhập

### Users
- `GET /api/users` - Lấy danh sách users (có phân trang)
- `GET /api/users/:id` - Lấy thông tin user theo ID
- `PUT /api/users/:id` - Cập nhật thông tin user
- `DELETE /api/users/:id` - Xóa user
- `POST /api/users/add-friend` - Thêm bạn
- `PUT /api/users/:id/points` - Cập nhật điểm

### Games & Challenges
- `POST /api/games/challenges` - Tạo game challenge mới
- `GET /api/games/challenges` - Lấy danh sách challenges
- `POST /api/games/matches` - Tạo match mới
- `PUT /api/games/matches/:id/status` - Cập nhật trạng thái match
- `GET /api/games/matches/:id` - Lấy thông tin match
- `GET /api/games/users/:userId/matches` - Lấy matches của user

### Items & Trading
- `POST /api/items/items` - Tạo item mới
- `GET /api/items/items` - Lấy danh sách items
- `GET /api/items/items/:id` - Lấy thông tin item
- `PUT /api/items/items/:id` - Cập nhật item
- `DELETE /api/items/items/:id` - Xóa item
- `POST /api/items/trades` - Tạo trade mới
- `GET /api/items/trades/match/:matchId` - Lấy lịch sử trade

### Rankings
- `POST /api/rankings/update` - Cập nhật ranking
- `GET /api/rankings/season/:season` - Lấy rankings theo season
- `GET /api/rankings/top/:season` - Lấy top rankings
- `GET /api/rankings/user/:userId/season/:season` - Lấy ranking của user
- `GET /api/rankings/seasons` - Lấy danh sách seasons

## Database Schema

### User
- Thông tin cá nhân (userName, email, password, gender, address)
- Role (student, admin, teacher)
- Điểm số và thống kê
- Danh sách bạn bè
- Các items, decorations, challenges, matches, certificates

### Game Challenge
- Tiêu đề và mô tả
- Liên kết với Subject
- Độ khó (easy, medium, hard)
- Điểm thưởng

### Match
- Danh sách người chơi
- Liên kết với Game Challenge
- Trạng thái (waiting, ongoing, completed, cancelled)
- Người thắng/thua

### Item
- Tên, loại, giá, hình ảnh
- Các loại: weapon, armor, consumable, decoration, special

### Ranking
- Điểm tổng của user
- Xếp hạng trong season
- Liên kết với User

## Tính năng chính

1. **Authentication & Authorization**
   - JWT token authentication
   - Role-based access control
   - Password hashing với bcrypt

2. **Game Management**
   - Tạo và quản lý game challenges
   - Match making và tracking
   - Certificate system

3. **Item & Trading System**
   - Quản lý items và decorations
   - Trading system trong matches
   - House decoration system

4. **Ranking System**
   - Real-time ranking updates
   - Season-based rankings
   - Top player leaderboards

5. **Security Features**
   - Rate limiting
   - CORS protection
   - Helmet security headers
   - Input validation với Zod

6. **Performance**
   - Database indexing
   - Pagination cho tất cả endpoints
   - Error handling và logging

## Dependencies chính

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging
- **Rate Limit** - API rate limiting
