export declare class LuckyWheelService {
    static validateWheel(wheelId: string): Promise<{
        isValid: boolean;
        message?: string;
    }>;
    static checkDailySpinLimit(userId: string, wheelId: string): Promise<{
        canSpin: boolean;
        remainingSpins: number;
        message?: string;
    }>;
    static performSpin(userId: string, wheelId: string): Promise<{
        success: boolean;
        data?: any;
        message?: string;
    }>;
    private static calculateWinningPrize;
    private static applyPrizeToUser;
    static getWheelStatistics(wheelId: string): Promise<any>;
    static resetDailySpins(wheelId: string): Promise<void>;
    static createSampleWheel(): Promise<any>;
}
//# sourceMappingURL=luckyWheelService.d.ts.map