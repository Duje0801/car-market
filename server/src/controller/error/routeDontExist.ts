import { Request, Response } from "express";

export const routeDontExist: any = async function (req: Request, res: Response) {
  res.status(404).json({
    status: `fail`,
    error: `Cant find ${req.originalUrl} on this server`,
  });
};
