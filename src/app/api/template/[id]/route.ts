import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/features/playgrounds/lib/path-to-json";
import { prisma } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import { NextRequest, NextResponse } from "next/server";
import fs from 'node:fs/promises';
import path from "path";

function validateJsonStructure(data: unknown):boolean{
    try {
        JSON.parse(JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    const playground = await prisma.playground.findUnique({
        where: {
            id,
        },
    })
    if (!playground) {
        return NextResponse.json({ error: "Playground not found" }, { status: 404 });
    }
    const templatePath = templatePaths[playground.template as keyof typeof templatePaths];
    if (!templatePath) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    try {
        const inputPath = path.join(process.cwd(), templatePath);
        const outputFile = path.join(process.cwd(), `/output/${playground.template as keyof typeof templatePaths}.json`);
        await saveTemplateStructureToJson(inputPath, outputFile);
        const result = await readTemplateStructureFromJson(outputFile);
        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid template structure" }, { status: 500 });
        }
        await fs.unlink(outputFile);
        return Response.json({success:true, templateJson: result}, {status: 200});
    } catch (error) {
        console.error(error);
        return Response.json({error: "Failed to load template"}, {status: 500});
    }
}