import { Request, Response } from "express";
import { prisma } from "../index";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await prisma.history.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 for performance
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.history.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete history item" });
  }
};
