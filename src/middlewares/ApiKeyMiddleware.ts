import "dotenv/config";
import type { Request, Response, NextFunction } from "express";

const ApiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["api-key"];
    console.log(key)
    console.log(process.env.API_KEY)
    if (key !== process.env.API_KEY) {
        return res.status(403).json({
            data: null,
            message: "Forbidden",
            status: 403,
        });
    }
    next();
};

export default ApiKeyMiddleware;
