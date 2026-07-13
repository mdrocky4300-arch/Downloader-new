import { Request, Response } from "express";
import { prisma } from "../index";

export const getSettings = async (req: Request, res: Response) => {
  try {
    // Get basic stats for admin dashboard
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const downloadsToday = await prisma.history.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    const totalDownloads = await prisma.history.count();
    
    // Group by format to find popular formats
    const popularFormats = await prisma.history.groupBy({
      by: ['format'],
      _count: {
        format: true
      },
      orderBy: {
        _count: {
          format: 'desc'
        }
      },
      take: 5
    });

    res.json({
      stats: {
        downloadsToday,
        totalDownloads,
        popularFormats: popularFormats.map(f => ({
          format: f.format,
          count: f._count.format
        }))
      },
      settings: {
        maintenanceMode: false // Hardcoded for now, can be moved to DB
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings and stats" });
  }
};
