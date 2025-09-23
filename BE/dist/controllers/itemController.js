"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradeHistory = exports.createTrade = exports.getAllHouseDecorations = exports.createHouseDecoration = exports.deleteItem = exports.updateItem = exports.getItemById = exports.getAllItems = exports.createItem = void 0;
const Item_1 = __importDefault(require("../models/Item"));
const HouseDecor_1 = __importDefault(require("../models/HouseDecor"));
const Trade_1 = __importDefault(require("../models/Trade"));
// Item Controllers
const createItem = async (req, res) => {
    try {
        const { itemName, itemType, itemPrice, itemImage } = req.body;
        const item = new Item_1.default({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createItem = createItem;
const getAllItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const itemType = req.query.itemType;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || Infinity;
        const filter = {
            itemPrice: { $gte: minPrice, $lte: maxPrice }
        };
        if (itemType) {
            filter.itemType = itemType;
        }
        const items = await Item_1.default.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ itemPrice: 1 });
        const total = await Item_1.default.countDocuments(filter);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllItems = getAllItems;
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item_1.default.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getItemById = getItemById;
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const item = await Item_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteItem = deleteItem;
// House Decoration Controllers
const createHouseDecoration = async (req, res) => {
    try {
        const { houseName, houseDescription, itemId } = req.body;
        const houseDecoration = new HouseDecor_1.default({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createHouseDecoration = createHouseDecoration;
const getAllHouseDecorations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const houseDecorations = await HouseDecor_1.default.find()
            .populate('itemId', 'itemName itemType itemPrice itemImage')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await HouseDecor_1.default.countDocuments();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllHouseDecorations = getAllHouseDecorations;
// Trade Controllers
const createTrade = async (req, res) => {
    try {
        const { matchId, itemTaken, bookingId, arvRegimenId } = req.body;
        const trade = new Trade_1.default({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTrade = createTrade;
const getTradeHistory = async (req, res) => {
    try {
        const { matchId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const trades = await Trade_1.default.find({ matchId })
            .populate('itemTaken', 'itemName itemType itemPrice itemImage')
            .populate('matchId', 'status players')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await Trade_1.default.countDocuments({ matchId });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTradeHistory = getTradeHistory;
//# sourceMappingURL=itemController.js.map