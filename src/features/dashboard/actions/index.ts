"use server";
import { currentUser } from "@/features/auth/actions";
import { prisma } from "@/lib/db";
import { Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createPlayground = async (data:{title: string, description?: string, template: Templates}) => {
    const {title, description, template} = data;
    const user = await currentUser();
    try {
        const playground = await prisma.playground.create({
            data:{
                title,
                description,
                template,
                userId: user!.id!,
            }
        });
        return playground;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getPlaygrounds = async () => {
    const user = await currentUser();
    try {
        const playgrounds = await prisma.playground.findMany({
            where:{
                userId: user!.id!,
            },
            include:{
                user: true,
                starMark: {
                    where: {
                        userId: user!.id!,
                    },
                    select:{
                        isMarked: true,
                    }
                },
            },
            // orderBy:{
            //     createdAt: "desc",
            // },
            // take: 10,
        });
        return playgrounds;
    } catch (error) {
        console.error(error);
    }
}

export const deleteProjectById = async (id:string) => {
    try {
        await prisma.playground.delete({
            where:{
                id,
            }
        })
        revalidatePath("/dashboard");
    } catch (error) {
        console.error(error);
    }
}

export const editProjectById = async (id:string, data:{title:string, description:string}) => {
    try {
        await prisma.playground.update({
            where:{
                id,
            },
            data:{
                title: data.title,
                description: data.description,
            }
        })
        revalidatePath("/dashboard");
    } catch (error) {
        console.error(error);
    }
}
export const duplicateProjectById = async (id:string) => {
    try {
        const project = await prisma.playground.findUnique({
            where:{
                id,
            }
        })
        if(!project) throw new Error("Project not found");

        const newProject = await prisma.playground.create({
            data:{
                title: `${project.title} - Copy`,
                description: project.description,
                template: project.template,
                userId: project.userId,
            }
        })
        revalidatePath("/dashboard");
        return newProject;
    } catch (error) {
        console.error(error);
    }
}