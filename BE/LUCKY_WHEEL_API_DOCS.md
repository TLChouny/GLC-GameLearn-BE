# API Tài liệu - Vòng quay may mắn (Lucky Wheel)

## Tổng quan

API vòng quay may mắn cho phép người dùng tạo, quản lý và sử dụng hệ thống vòng quay may mắn trong ứng dụng GameLearn.

## Base URL
```
/api/lucky-wheels
```

## Authentication
Tất cả các endpoint (trừ GET public) đều yêu cầu authentication token trong header:
```
Authorization: Bearer <token>
```

---

## 1. LuckyWheel Management

### 1.1 Tạo vòng quay mới
**POST** `/api/lucky-wheels`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "wheelTitle": "Daily Lucky Wheel",
  "wheelDescription": "Spin daily to win amazing prizes!",
  "maxSpinPerDay": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lucky wheel created successfully",
  "data": {
    "luckyWheel": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "wheelTitle": "Daily Lucky Wheel",
      "wheelDescription": "Spin daily to win amazing prizes!",
      "maxSpinPerDay": 3,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### 1.2 Lấy danh sách vòng quay
**GET** `/api/lucky-wheels`

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số item per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "luckyWheels": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalWheels": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 1.3 Lấy thông tin vòng quay theo ID
**GET** `/api/lucky-wheels/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "luckyWheel": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "wheelTitle": "Daily Lucky Wheel",
      "wheelDescription": "Spin daily to win amazing prizes!",
      "maxSpinPerDay": 3,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### 1.4 Cập nhật vòng quay
**PUT** `/api/lucky-wheels/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "wheelTitle": "Updated Wheel Title",
  "maxSpinPerDay": 5
}
```

### 1.5 Xóa vòng quay
**DELETE** `/api/lucky-wheels/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Lucky wheel and all related data deleted successfully"
}
```

---

## 2. LuckyWheelPrize Management

### 2.1 Tạo giải thưởng cho vòng quay
**POST** `/api/lucky-wheels/:wheelId/prizes`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "prizeName": "10 Points",
  "prizeType": "points",
  "prizeValue": 10,
  "probability": 40,
  "itemId": "64f8a1b2c3d4e5f6a7b8c9d1"
}
```

**Prize Types:**
- `points`: Phần thưởng điểm
- `item`: Phần thưởng vật phẩm
- `coins`: Phần thưởng tiền xu
- `special`: Phần thưởng đặc biệt

### 2.2 Lấy danh sách giải thưởng của vòng quay
**GET** `/api/lucky-wheels/:wheelId/prizes`

**Query Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số item per page

**Response:**
```json
{
  "success": true,
  "data": {
    "prizes": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "wheelId": "64f8a1b2c3d4e5f6a7b8c9d0",
        "prizeName": "10 Points",
        "prizeType": "points",
        "prizeValue": 10,
        "probability": 40,
        "itemId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "itemName": "Magic Sword",
          "itemType": "weapon",
          "itemPrice": 100,
          "itemImage": "sword.jpg"
        }
      }
    ],
    "pagination": {...}
  }
}
```

### 2.3 Cập nhật giải thưởng
**PUT** `/api/lucky-wheels/prizes/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "prizeName": "20 Points",
  "prizeValue": 20,
  "probability": 30
}
```

### 2.4 Xóa giải thưởng
**DELETE** `/api/lucky-wheels/prizes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 3. LuckyWheelSpin Operations

### 3.1 Quay vòng quay
**POST** `/api/lucky-wheels/:wheelId/spin`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Spin completed successfully",
  "data": {
    "spinResult": "Won: 10 Points (points)",
    "prize": {
      "name": "10 Points",
      "type": "points",
      "value": 10,
      "itemId": null
    },
    "remainingSpins": 2
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "You have reached the daily spin limit of 3 spins"
}
```

### 3.2 Lấy thông tin vòng quay với số lượt quay còn lại
**GET** `/api/lucky-wheels/:wheelId/info`

**Response:**
```json
{
  "success": true,
  "data": {
    "wheel": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "wheelTitle": "Daily Lucky Wheel",
      "wheelDescription": "Spin daily to win amazing prizes!",
      "maxSpinPerDay": 3
    },
    "prizes": [...],
    "remainingSpins": 2,
    "canSpin": true
  }
}
```

### 3.3 Lấy lịch sử quay của user
**GET** `/api/lucky-wheels/user/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số item per page

**Response:**
```json
{
  "success": true,
  "data": {
    "spinHistory": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "wheelId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "wheelTitle": "Daily Lucky Wheel"
        },
        "prizeId": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "prizeName": "10 Points",
          "prizeType": "points",
          "prizeValue": 10
        },
        "spinResult": "Won: 10 Points (points)",
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 3.4 Lấy lịch sử quay của user cho vòng quay cụ thể
**GET** `/api/lucky-wheels/user/history/:wheelId`

**Headers:**
```
Authorization: Bearer <token>
```

### 3.5 Lấy thống kê quay của user
**GET** `/api/lucky-wheels/user/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSpins": 25,
    "todaySpins": 3,
    "prizeStats": [
      {
        "_id": "points",
        "count": 15
      },
      {
        "_id": "item",
        "count": 8
      },
      {
        "_id": "coins",
        "count": 2
      }
    ],
    "wheelStats": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "wheelTitle": "Daily Lucky Wheel",
        "count": 20
      }
    ]
  }
}
```

### 3.6 Lấy thống kê quay của user cho vòng quay cụ thể
**GET** `/api/lucky-wheels/user/stats/:wheelId`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 4. Error Responses

### 4.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Wheel title is required",
      "param": "wheelTitle",
      "location": "body"
    }
  ]
}
```

### 4.2 Authentication Error
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 4.3 Not Found Error
```json
{
  "success": false,
  "message": "Lucky wheel not found"
}
```

### 4.4 Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message"
}
```

---

## 5. Business Rules

### 5.1 Giới hạn quay
- Mỗi user chỉ có thể quay tối đa `maxSpinPerDay` lần mỗi ngày
- Giới hạn được reset vào 00:00 mỗi ngày
- Không thể quay nếu đã hết lượt trong ngày

### 5.2 Xác suất giải thưởng
- Tổng xác suất của tất cả giải thưởng trong một vòng quay phải bằng 100%
- Xác suất được tính theo phần trăm (0-100)
- Hệ thống sử dụng thuật toán weighted random selection

### 5.3 Phần thưởng
- **Points**: Tự động cộng vào điểm của user
- **Item**: Tự động thêm vào inventory của user
- **Coins**: Tương tự như points (có thể tùy chỉnh)
- **Special**: Cần xử lý logic đặc biệt

### 5.4 Bảo mật
- Tất cả operations đều yêu cầu authentication
- User chỉ có thể xem lịch sử và thống kê của chính mình
- Admin có thể quản lý tất cả vòng quay và giải thưởng

---

## 6. Example Usage

### 6.1 Tạo vòng quay hoàn chỉnh
```javascript
// 1. Tạo vòng quay
const wheel = await fetch('/api/lucky-wheels', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    wheelTitle: 'Daily Lucky Wheel',
    wheelDescription: 'Spin daily to win amazing prizes!',
    maxSpinPerDay: 3
  })
});

// 2. Thêm giải thưởng
const prizes = [
  { prizeName: '10 Points', prizeType: 'points', prizeValue: 10, probability: 40 },
  { prizeName: '25 Points', prizeType: 'points', prizeValue: 25, probability: 30 },
  { prizeName: '50 Points', prizeType: 'points', prizeValue: 50, probability: 20 },
  { prizeName: '100 Points', prizeType: 'points', prizeValue: 100, probability: 10 }
];

for (const prize of prizes) {
  await fetch(`/api/lucky-wheels/${wheelId}/prizes`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prize)
  });
}

// 3. Quay vòng quay
const spinResult = await fetch(`/api/lucky-wheels/${wheelId}/spin`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

### 6.2 Kiểm tra thông tin vòng quay
```javascript
// Lấy thông tin vòng quay với số lượt quay còn lại
const wheelInfo = await fetch(`/api/lucky-wheels/${wheelId}/info`, {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const data = await wheelInfo.json();
if (data.data.canSpin) {
  // User có thể quay
  console.log(`Còn ${data.data.remainingSpins} lượt quay`);
} else {
  // User đã hết lượt quay
  console.log('Đã hết lượt quay trong ngày');
}
```
