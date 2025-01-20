import { Request, Response } from 'express';
import StatsService from '../services/stats.service';

export default class StatsController {
    static TOTAL_STORAGE = 10 * 1024 * 1024 * 1024; // 10 GB

    static async getOverallStats(req: Request, res: Response): Promise<any> {
        try {
            const result = await StatsService.getOverallStats();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getPDFStats(req: Request, res: Response): Promise<any> {
        try {
            const result = await StatsService.getPDFStats();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getImageStats(req: Request, res: Response): Promise<any> {
        try {
            const result = await StatsService.getImageStats();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getFileStats(req: Request, res: Response): Promise<any> {
        try {
            const result = await StatsService.getFileStats();

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getSpecificLogs(req: Request, res: Response): Promise<any> {
        try {
            const { date } = req.body;

            const result = await StatsService.getSpecificLogs(date);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
