import { Prisma, PrismaClient } from "@prisma/client";
import { default as baby_data } from "./data/excel-to-json.json";

interface BabyName {
    name: string;
    gender: string;
    meaning: string;
    origin: string;
    sub_origin: string;
}

class BabyNameSeeder {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async run(): Promise<void> {
        const coaDataArray = baby_data as BabyName[];
        let successCount = 0;
        const operationStartTime = new Date();
    
        for (const coa of coaDataArray) {
            const currentTime = new Date();
            if (coa.gender && coa.gender !== 'Gender') {
                try {
                    const insertStartTime = new Date();
                    
                    let baby = await this.prisma.babyName.upsert({
                        where: { 
                            name: coa.name,
                            gender: coa.gender,
                            meaning: coa.meaning,
                            origin: coa.origin,
                            sub_origin: coa.sub_origin,
                        },
                        update: {
                            name: coa.name,
                            gender: coa.gender,
                            meaning: coa.meaning,
                            origin: coa.origin,
                            sub_origin: coa.sub_origin,
                        },
                        create: {
                            name: coa.name,
                            gender: coa.gender,
                            meaning: coa.meaning,
                            origin: coa.origin,
                            sub_origin: coa.sub_origin,
                        },
                    });
    
                    const insertEndTime = new Date(); 
                    const insertionTime = insertEndTime.getTime() - insertStartTime.getTime();
    
                    console.log(`Success Insert: ${baby.name}, Time taken: ${insertionTime} ms`);
                    successCount++;
                } catch (error) {
                    console.error('Error inserting baby name:', error);
                }
            } else {
                console.log('Skipped: ' + coa.name);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    
        const operationEndTime = new Date();
        const totalTime = operationEndTime.getTime() - operationStartTime.getTime();
    
        if (successCount === coaDataArray.length) {
            console.log('All upsert operations were successful.');
        } else {
            console.log('Some upsert operations were skipped or failed.');
        }
        console.log(`Total time taken for all operations: ${totalTime} ms`);
    }
    
}

export default new BabyNameSeeder();
