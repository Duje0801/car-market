import { Request, Response } from "express";
import { errorHandler } from "../../utilis/errorHandling/errorHandler";

export const rateLimitResponse: any = async function (req: Request, res: Response) {
  errorHandler({name: "Too many requests"}, req, res);
};
