import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get token from header
    const authHeader = req.headers.authorization;
    // if token is not present show error
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // verify token
    const decoded = jwt.verify(token, "your_secret_key");

    // attach user with request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
