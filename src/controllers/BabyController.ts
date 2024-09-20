import { PrismaClient } from "@prisma/client";
import Controller from "./Controller";
import type { Request, Response } from "express";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { AuthMiddleware } from "../middlewares";

const prisma = new PrismaClient();

class BabyController extends Controller {
    private router: Router;

    constructor() {
        super();
        this.router = Router();
        this.routes();
    }

    public getRouter(): Router {
        return this.router;
    }

    public routes(): void {
        this.router.get("/data-origin", this.DataOrigin);
        this.router.get("/data-by-like", this.DataByLike);
        this.router.post("/random-baby-name", this.getRandomBabyName);
        this.router.put("/random-baby-name/:uuid", this.likeBabyName);

    }


    public async DataOrigin(req: Request, res: Response): Promise<Response> {
        try {

            return super.success(res, "success", {  });
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async DataByLike(req: Request, res: Response): Promise<Response> {
        try {

            return super.success(res, "success", {  });
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async getRandomBabyName(req: Request, res: Response): Promise<Response> {
        try {

            return super.success(res, "success", {  });
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async likeBabyName(req: Request, res: Response): Promise<Response> {
        try {
            return super.success(res, "success", {  });
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }


}

export default new BabyController().getRouter();
