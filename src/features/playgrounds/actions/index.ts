"use server";

import {currentUser} from "@/features/auth/actions/index"
import {prisma } from "@/lib/db"
import { TemplateFolder } from "../lib/path-to-json";


export const getPlayground = async (id: string) => {
    try {
        const user = await currentUser();
        const playground = await prisma.playground.findUnique({
            where: {
                id,
            },
            select: {
                template: true,
                description: true,
                templateFiles: {
                    select:{
                        content: true,
                    }
                }
            }
        })
        return playground;
        
    } catch (error) {
        
    }
}
export const SaveUpdatedCode = async (id: string, data: TemplateFolder)=>{
    const user = await currentUser();
    if (!user) {
        return null;
    }
    try {
        const updatedPlayground = await prisma.templateFile.upsert({
            where:{
                playgroundId: id,
            },
            update:{
                content: JSON.stringify(data),
            },
            create:{
                playgroundId: id,
                content: JSON.stringify(data),
            }
        })
        return updatedPlayground;
    } catch (error) {
        console.error(error);
        return null;
    }
}