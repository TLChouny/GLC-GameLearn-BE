import { Request, Response } from 'express';
import LuckyWheel from '../models/LuckyWheel';
import LuckyWheelPrize from '../models/LuckyWheelPrize';
import LuckyWheelSpin from '../models/LuckyWheelSpin';

// LuckyWheel Controllers
export const createLuckyWheel = async (req: Request, res: Response) => {
  try {
    const { wheelTitle, wheelDescription, maxSpinPerDay } = req.body;

    const luckyWheel = new LuckyWheel({
      wheelTitle,
      wheelDescription,
      maxSpinPerDay: maxSpinPerDay || 3
    });

    await luckyWheel.save();

    res.status(201).json({
      success: true,
      message: 'Lucky wheel created successfully',
      data: { luckyWheel }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllLuckyWheels = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const luckyWheels = await LuckyWheel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await LuckyWheel.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        luckyWheels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalWheels: total,
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

export const getLuckyWheelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const luckyWheel = await LuckyWheel.findById(id);
    if (!luckyWheel) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { luckyWheel }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateLuckyWheel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const luckyWheel = await LuckyWheel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!luckyWheel) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lucky wheel updated successfully',
      data: { luckyWheel }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteLuckyWheel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Xóa tất cả prizes và spins liên quan
    await LuckyWheelPrize.deleteMany({ wheelId: id });
    await LuckyWheelSpin.deleteMany({ wheelId: id });

    const luckyWheel = await LuckyWheel.findByIdAndDelete(id);
    if (!luckyWheel) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lucky wheel and all related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// LuckyWheelPrize Controllers
export const createLuckyWheelPrize = async (req: Request, res: Response) => {
  try {
    const { wheelId, itemId, prizeName, prizeType, prizeValue, probability } = req.body;

    // Kiểm tra tổng probability không vượt quá 100
    const existingPrizes = await LuckyWheelPrize.find({ wheelId });
    const totalProbability = existingPrizes.reduce((sum, prize) => sum + prize.probability, 0);
    
    if (totalProbability + probability > 100) {
      return res.status(400).json({
        success: false,
        message: 'Total probability cannot exceed 100%'
      });
    }

    const luckyWheelPrize = new LuckyWheelPrize({
      wheelId,
      itemId,
      prizeName,
      prizeType,
      prizeValue,
      probability
    });

    await luckyWheelPrize.save();

    res.status(201).json({
      success: true,
      message: 'Lucky wheel prize created successfully',
      data: { luckyWheelPrize }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getLuckyWheelPrizes = async (req: Request, res: Response) => {
  try {
    const { wheelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const prizes = await LuckyWheelPrize.find({ wheelId })
      .populate('itemId', 'itemName itemType itemPrice itemImage')
      .skip(skip)
      .limit(limit)
      .sort({ probability: -1 });

    const total = await LuckyWheelPrize.countDocuments({ wheelId });

    res.status(200).json({
      success: true,
      data: {
        prizes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPrizes: total,
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

export const updateLuckyWheelPrize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Nếu cập nhật probability, kiểm tra tổng không vượt quá 100
    if (updateData.probability) {
      const prize = await LuckyWheelPrize.findById(id);
      if (prize) {
        const existingPrizes = await LuckyWheelPrize.find({ 
          wheelId: prize.wheelId, 
          _id: { $ne: id } 
        });
        const totalProbability = existingPrizes.reduce((sum, p) => sum + p.probability, 0);
        
        if (totalProbability + updateData.probability > 100) {
          return res.status(400).json({
            success: false,
            message: 'Total probability cannot exceed 100%'
          });
        }
      }
    }

    const luckyWheelPrize = await LuckyWheelPrize.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!luckyWheelPrize) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel prize not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lucky wheel prize updated successfully',
      data: { luckyWheelPrize }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteLuckyWheelPrize = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const luckyWheelPrize = await LuckyWheelPrize.findByIdAndDelete(id);
    if (!luckyWheelPrize) {
      return res.status(404).json({
        success: false,
        message: 'Lucky wheel prize not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lucky wheel prize deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
