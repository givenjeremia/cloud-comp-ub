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
        this.router.post("/random-baby-name",this.validateGetRandomBabyName, this.getRandomBabyName);
        this.router.put("/like-baby-name/:uuid", this.likeBabyName);
    }


    public async DataOrigin(req: Request, res: Response): Promise<Response> {
        try {
            const data = await prisma.babyName.groupBy({
                by: ['origin'],
            });
            return super.success(res, "success",data);
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async DataByLike(req: Request, res: Response): Promise<Response> {
        try {
            const data = await prisma.babyName.findMany({
                orderBy: {
                  like: {
                    sort: 'desc',
                  }
                },
                take: 10
              });
            return super.success(res, "success", data);
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }
    private validateGetRandomBabyName = [
        body("gender", "Gender is required").notEmpty(),
        body("origin", "Origin required").notEmpty(),
    ];
    public async getRandomBabyName(req: Request, res: Response): Promise<Response> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return super.badRequest(res, "invalid request", errors.array());

            const babyNames = await prisma.babyName.findMany({
                where: {
                  origin: req.body.origin,
                  gender: req.body.gender,
                },
                orderBy: {
                    like: {
                      sort: 'desc',
                    }
                  },
              });
              
            const randomBabyNames = babyNames
                .sort(() => 0.5 - Math.random()) 
                .slice(0, 4);                  
              
              
            return super.success(res, "success", randomBabyNames);
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async likeBabyName(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            // const babyName = await prisma.babyName.findUnique({
            //     where: { uuid: uuid },
            //     select: { like: true },
            //   });
              
            // const currentLikes = parseInt(babyName?.like ?? '0', 10);
              
            // const data = await prisma.babyName.update({
            //     where: { uuid: uuid },
            //     data: {
            //       like: (currentLikes + 1).toString(),
            //     },
            // });
              
            return super.success(res, "success updated", {});
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }


}

export default new BabyController().getRouter();
