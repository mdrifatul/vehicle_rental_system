import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }
      const decoded = jwt.verify(
        token as string,
        config.jwtsecret as string
      ) as JwtPayload;
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(401).json({
          error: "unauthorized!!",
        });
      }
      return next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "login fail",
      });
    }
  };
};

export default auth;
