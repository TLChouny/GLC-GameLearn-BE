import { Request, Response } from 'express';
import LuckyWheel from '../models/LuckyWheel';
import LuckyWheelPrize from '../models/LuckyWheelPrize';
import LuckyWheelSpin from '../models/LuckyWheelSpin';
import User from '../models/User';

// Kiểm tra số lượt quay còn lại trong ngày
const checkDailySpinLimit = async (userId: string, wheelId: string, maxSpinPerDay: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaySpins = await LuckyWheelSpin.countDocuments({
    userId,
    wheelId,
    createdAt: { $gte: today }
  });

  return todaySpins < maxSpinPerDay;
};

// Logic quay vòng quay
const spinWheel = (prizes: any[]) => {
  const random = Math.random() * 100;
  let cumulativeProbability = 0;

  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      return prize;
    }
  }

  // Fallback: trả về giải thưởng cuối cùng nếu có lỗi
  return prizes[prizes.length - 1];
};

// Spin Lucky Wheel
export const spinLuckyWheel = async (req: Request, res: Response) => {
  try {
    const { wheelId } = req.params;
    const userId = (req as any).user?.id; // Từ middleware auth

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Kiểm tra vòng quay có tồn tại không
    const luckyWheel = await LuckyWheel.findById(wheelId);
    if (!luckyWheel) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel not found'
      });
    }

    // Kiểm tra giới hạn quay trong ngày
    const canSpin = await checkDailySpinLimit(userId, wheelId, luckyWheel.maxSpinPerDay);
    if (!canSpin) {
      return res.status(400).json({
        success: false,
        message: `You have reached the daily spin limit of ${luckyWheel.maxSpinPerDay} spins`
      });
    }

    // Lấy danh sách giải thưởng
    const prizes = await LuckyWheelPrize.find({ wheelId });
    if (prizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No prizes available for this wheel'
      });
    }

    // Kiểm tra tổng probability = 100%
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    if (Math.abs(totalProbability - 100) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Prize probabilities must sum to 100%'
      });
    }

    // Thực hiện quay
    const winningPrize = spinWheel(prizes);

    // Lưu kết quả quay
    const spinResult = new LuckyWheelSpin({
      wheelId,
      userId,
      prizeId: winningPrize._id,
      spinResult: `Won: ${winningPrize.prizeName} (${winningPrize.prizeType})`
    });

    await spinResult.save();

    // Cập nhật điểm/items cho user nếu cần
    if (winningPrize.prizeType === 'points') {
      await User.findByIdAndUpdate(userId, {
        $inc: { points: winningPrize.prizeValue }
      });
    } else if (winningPrize.prizeType === 'item' && winningPrize.itemId) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { itemId: winningPrize.itemId }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Spin completed successfully',
      data: {
        spinResult: spinResult.spinResult,
        prize: {
          name: winningPrize.prizeName,
          type: winningPrize.prizeType,
          value: winningPrize.prizeValue,
          itemId: winningPrize.itemId
        },
        remainingSpins: luckyWheel.maxSpinPerDay - (await LuckyWheelSpin.countDocuments({
          userId,
          wheelId,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy lịch sử quay của user
export const getUserSpinHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { wheelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const filter: any = { userId };
    if (wheelId) {
      filter.wheelId = wheelId;
    }

    const spinHistory = await LuckyWheelSpin.find(filter)
      .populate('wheelId', 'wheelTitle wheelDescription')
      .populate('prizeId', 'prizeName prizeType prizeValue itemId')
      .populate('prizeId.itemId', 'itemName itemType itemPrice itemImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await LuckyWheelSpin.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        spinHistory,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalSpins: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy thống kê quay của user
export const getUserSpinStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { wheelId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const filter: any = { userId };
    if (wheelId) {
      filter.wheelId = wheelId;
    }

    // Thống kê tổng quan
    const totalSpins = await LuckyWheelSpin.countDocuments(filter);
    
    // Thống kê theo loại giải thưởng
    const prizeStats = await LuckyWheelSpin.aggregate([
      { $match: filter },
      { $lookup: { from: 'luckywheelprizes', localField: 'prizeId', foreignField: '_id', as: 'prize' } },
      { $unwind: '$prize' },
      { $group: { _id: '$prize.prizeType', count: { $sum: 1 } } }
    ]);

    // Thống kê theo vòng quay
    const wheelStats = await LuckyWheelSpin.aggregate([
      { $match: filter },
      { $lookup: { from: 'luckywheels', localField: 'wheelId', foreignField: '_id', as: 'wheel' } },
      { $unwind: '$wheel' },
      { $group: { _id: '$wheelId', wheelTitle: { $first: '$wheel.wheelTitle' }, count: { $sum: 1 } } }
    ]);

    // Lượt quay hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySpins = await LuckyWheelSpin.countDocuments({
      ...filter,
      createdAt: { $gte: today }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSpins,
        todaySpins,
        prizeStats,
        wheelStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Lấy thông tin vòng quay với số lượt quay còn lại
export const getWheelInfo = async (req: Request, res: Response) => {
  try {
    const { wheelId } = req.params;
    const userId = (req as any).user?.id;

    const luckyWheel = await LuckyWheel.findById(wheelId);
    if (!luckyWheel) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel not found'
      });
    }

    // Lấy danh sách giải thưởng
    const prizes = await LuckyWheelPrize.find({ wheelId })
      .populate('itemId', 'itemName itemType itemPrice itemImage')
      .sort({ probability: -1 });

    let remainingSpins = 0;
    if (userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaySpins = await LuckyWheelSpin.countDocuments({
        userId,
        wheelId,
        createdAt: { $gte: today }
      });
      
      remainingSpins = Math.max(0, luckyWheel.maxSpinPerDay - todaySpins);
    }

    res.status(200).json({
      success: true,
      data: {
        wheel: luckyWheel,
        prizes,
        remainingSpins,
        canSpin: remainingSpins > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
