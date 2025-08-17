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
    try {
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
            return NextResponse.json({ error: `Template path not found for ${playground.template}` }, { status: 404 });
        }
        
        const inputPath = path.join(process.cwd(), templatePath);
        
        // Check if input path exists
        try {
            await fs.access(inputPath);
        } catch (error) {
            // Return fallback data instead of failing
            return Response.json({
                success: true, 
                templateJson: {
                    folderName: "Root",
                    items: [
                        {
                            filename: "index",
                            fileExtension: "js",
                            content: "console.log('Hello World');"
                        }
                    ]
                }
            }, {status: 200});
        }
        
        const outputFile = path.join(process.cwd(), `output/${playground.template}.json`);
        
        // Use minimal ignore patterns for development templates
        const customOptions = {
            ignoreFiles: [
                'package-lock.json',
                '.DS_Store',
                'thumbs.db'
            ],
            ignoreFolders: [
                'node_modules'
            ],
            ignorePatterns: [],
            maxFileSize: 1024 * 1024 // 1MB
        };
        
        let result;
        try {
            await saveTemplateStructureToJson(inputPath, outputFile, customOptions);
            result = await readTemplateStructureFromJson(outputFile);
        } catch (scanError) {
            // Return fallback data if scanning fails
            return Response.json({
                success: true, 
                templateJson: {
                    folderName: "Root",
                    items: [
                        {
                            filename: "scan-error",
                            fileExtension: "txt",
                            content: `Scanning failed: ${(scanError as Error).message}`
                        }
                    ]
                }
            }, {status: 200});
        }
        
        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid template structure" }, { status: 500 });
        }
        
        // Clean up the temporary file
        try {
            await fs.unlink(outputFile);
        } catch (error) {
            // Silently ignore cleanup errors
        }
        
        return Response.json({success: true, templateJson: result}, {status: 200});
        
    } catch (error) {
        return Response.json({error: "Failed to load template"}, {status: 500});
    }
}