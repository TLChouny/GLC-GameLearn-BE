import { Request, Response } from 'express';
import Item from '../models/Item';
import HouseDecor from '../models/HouseDecor';
import Trade from '../models/Trade';

// Item Controllers
export const createItem = async (req: Request, res: Response) => {
  try {
    const { itemName, itemType, itemPrice, itemImage } = req.body;

    const item = new Item({
      itemName,
      itemType,
      itemPrice,
      itemImage
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const itemType = req.query.itemType as string;
    const minPrice = parseInt(req.query.minPrice as string) || 0;
    const maxPrice = parseInt(req.query.maxPrice as string) || Infinity;

    const filter: any = {
      itemPrice: { $gte: minPrice, $lte: maxPrice }
    };

    if (itemType) {
      filter.itemType = itemType;
    }

    const items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ itemPrice: 1 });

    const total = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
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

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// House Decoration Controllers
export const createHouseDecoration = async (req: Request, res: Response) => {
  try {
    const { houseName, houseDescription, itemId } = req.body;

    const houseDecoration = new HouseDecor({
      houseName,
      houseDescription,
      itemId
    });

    await houseDecoration.save();

    res.status(201).json({
      success: true,
      message: 'House decoration created successfully',
      data: { houseDecoration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllHouseDecorations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const houseDecorations = await HouseDecor.find()
      .populate('itemId', 'itemName itemType itemPrice itemImage')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await HouseDecor.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        houseDecorations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDecorations: total,
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

// Trade Controllers
export const createTrade = async (req: Request, res: Response) => {
  try {
    const { matchId, itemTaken, bookingId, arvRegimenId } = req.body;

    const trade = new Trade({
      matchId,
      itemTaken,
      bookingId,
      arvRegimenId
    });

    await trade.save();

    res.status(201).json({
      success: true,
      message: 'Trade created successfully',
      data: { trade }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTradeHistory = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const trades = await Trade.find({ matchId })
      .populate('itemTaken', 'itemName itemType itemPrice itemImage')
      .populate('matchId', 'status players')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Trade.countDocuments({ matchId });

    res.status(200).json({
      success: true,
      data: {
        trades,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTrades: total,
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
