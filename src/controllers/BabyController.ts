import { Prisma, PrismaClient } from "@prisma/client";
import Controller from "./Controller";
import type { Request, Response } from "express";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { AuthMiddleware } from "../middlewares";
import { translate } from '@vitalets/google-translate-api';

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
        // this.router.get("/data-origin", this.DataOrigin);
        // this.router.get("/data-by-like", this.DataByLike);
        // this.router.get("/random-baby-name",this.validateGetRandomBabyName, this.getRandomBabyName);
        // this.router.put("/like-baby-name/:uuid", this.likeBabyName);
        
        // new Route
        this.router.get("/", this.DataOrigin);
        // this.router.get("/", this.DataByLike);
        // this.router.get("/",this.validateGetRandomBabyName, this.getRandomBabyName);
        // this.router.put("/:uuid", this.likeBabyName);
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
            const page = parseInt(req.query.page as string) || 1; 
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const filter = req.query.query || "";
        
            // const whereClause: Prisma.BabyNameWhereInput | undefined = filter
            // ? {
            //     OR: [
            //       { name: { contains: filter, mode: 'insensitive' } },
            //       { meaning: { contains: filter, mode: 'insensitive' } },
            //       { origin: { contains: filter, mode: 'insensitive' } },
            //     ],
            //   }
            // : undefined; // Use undefined for no filtering
            var data;
            var totalCount;
            if (filter) {
                data = await prisma.babyName.findMany({
                    where: {
                        OR: [
                            { name: { contains: filter as string } },
                            { meaning: { contains: filter as string } },
                            { origin: { contains: filter as string} },
                        ],
                    },
                    orderBy: {
                        like: 'desc', // Ensure 'like' is a valid field in your schema
                    },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });
                totalCount =await prisma.babyName.count({
                    where: {
                      OR: [
                        { name: { contains: filter as string } },
                        { meaning: { contains: filter as string } },
                        { origin: { contains: filter as string } },
                      ],
                    },
                  });
            } else {
                data = await prisma.babyName.findMany({
                    orderBy: {
                        like: 'desc',
                    },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                });
               totalCount = await prisma.babyName.count();
            }
            
        
   
            // const translatedData = await Promise.all(data.map(async (item) => {
            //     const translatedNama = await translate(item.meaning, { to: 'id' });
            //     return {
            //         ...item,
            //         meaning: translatedNama.text
            //     };
            // }));

            // const totalCount = await prisma.babyName.count();
            const totalPages = Math.ceil(totalCount / pageSize);

            const createLink = (newPage: number) => {
                const query = new URLSearchParams(req.query as any);
                query.set('page', newPage.toString());
                query.set('pageSize', pageSize.toString());
                return `?${query.toString()}`; 
            };

            const nextLink = page < totalPages ? createLink(page + 1) : null;
            const prevLink = page > 1 ? createLink(page - 1) : null;

            return super.success(res, "success", {
                data: data,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalCount,
                    totalPages,
                    nextLink,
                    prevLink,
                },
            });
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

            const firstLetter = req.body.firstLetter;
            const meaning = req.body.meaning;

            const babyNames = await prisma.babyName.findMany({
                where: {
                  ...(req.body.origin !== 'all' ? { origin: req.body.origin } : {}),
                  ...(req.body.gender !== 'all' ? {  gender: req.body.gender } : {}),
                  ...(firstLetter && firstLetter !== 'all' ? { name: { startsWith: firstLetter } } : {}),
                  ...(meaning ? { meaning: { contains: meaning } } : {}),
                },
                orderBy: {
                    like: {
                      sort: 'desc',
                    }
                  },
                take: 30,
              });
              
            const randomBabyNames = babyNames
                .sort(() => 0.5 - Math.random()) 
                .slice(0, 10);                  
              
            return super.success(res, "success", randomBabyNames);
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async likeBabyName(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            const data = await prisma.babyName.update({
                where: { uuid: uuid },
                data: {
                  like: {
                    increment: 1,
                  },
                },
            });
            return super.success(res, "success updated", data);
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }

    public async getBabyNameByOrigin(req: Request, res: Response): Promise<Response> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return super.badRequest(res, "invalid request", errors.array());
    
            const origin = req.query.origin as string || 'all';
    
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            
            // Filter conditions
            const whereConditions = {
                ...(origin !== 'all' ? { origin } : {}),
            };
    
            // Get total count for pagination
            const totalCount = await prisma.babyName.count({ where: whereConditions });
            const totalPages = Math.ceil(totalCount / pageSize);
    
            // Fetch paginated data
            const babyNames = await prisma.babyName.findMany({
                where: whereConditions,
                orderBy: {
                    like: {
                        sort: 'desc',
                    }
                },
                take: pageSize,
                skip: (page - 1) * pageSize,
            });
    
            // Generate pagination links
            const createLink = (newPage: number) => {
                const query = new URLSearchParams(req.query as any);
                query.set('page', newPage.toString());
                query.set('pageSize', pageSize.toString());
                return `?${query.toString()}`; 
            };
    
            const nextLink = page < totalPages ? createLink(page + 1) : null;
            const prevLink = page > 1 ? createLink(page - 1) : null;
    
            // Response
            return super.success(res, "success", {
                data: babyNames,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalCount,
                    totalPages,
                    nextLink,
                    prevLink,
                },
            });
        } catch (error: any) {
            console.error(error.message);
            return super.error(res, error.message);
        }
    }


}

export default new BabyController().getRouter();
