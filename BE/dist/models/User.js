"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'teacher'],
        default: 'student'
    },
    avatar: {
        type: String,
        default: ''
    },
    userDescription: {
        type: String,
        maxlength: 500
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    itemId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Item'
        }],
    houseDecorId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'HouseDecor'
        }],
    gameChallengeId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'GameChallenge'
        }],
    matchId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Match'
        }],
    certId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Certificate'
        }],
    stats: {
        gamesPlayed: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
    },
    listFriend: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    otp: String,
    otpExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    token: String,
    oauth: {
        googleId: String,
        facebookId: String,
        provider: String
    }
}, {
    timestamps: true
});
// Indexes for better performance (email and userName already have unique indexes)
UserSchema.index({ points: -1 });
exports.default = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map