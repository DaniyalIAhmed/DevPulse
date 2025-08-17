import { useCallback, useEffect, useState } from "react";
import { TemplateFolder } from "../lib/path-to-json";
import { getPlayground, SaveUpdatedCode } from "../actions";
import { toast } from "sonner";


interface PlaygroundData {
    id: string;
    title?: string;
    // [key: string]: string | number | Date | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

interface UsePlaygroundReturn {
    playgroundData: PlaygroundData | null;
    templateData: TemplateFolder | null;
    isLoading: boolean;
    error: string | null;
    loadPlayground: () => Promise<void>;
    saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
    const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(null);
    const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPlayground = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const playground = await getPlayground(id);
            if (!playground) {
                setError("Playground not found");
                return;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPlaygroundData(playground);
            const rawContent = playground?.templateFiles?.[0].content;
            if (typeof rawContent === "string") {
                const parsedContent = JSON.parse(rawContent);
                setTemplateData(parsedContent);
                toast.success("Playground loaded successfully");
                return;
            }
            const res = await fetch(`/api/template/${id}`);
            if (!res.ok) {
                setError(`Failed to load template ${res.status}`);
                return;
            }
            const data = await res.json();
            if(data.templateJson && Array.isArray(data.templateJson.items)){
            setTemplateData({
                folderName: "root",
                items: data.templateJson,
            });}
            else {
                setTemplateData(data.templateJson || {
                    folderName: "Root",
                    items: [],
                })
            }
            toast.success("Playground loaded successfully");
        } catch (error) {
            console.error(error);
            setError("Failed to load playground data");
            toast.error("Failed to load playground data");
        } finally {
            setIsLoading(false);
        }
    }, [id])

    const saveTemplateData = useCallback(async (data: TemplateFolder) => {
        try {
            await SaveUpdatedCode(id, data);
            setTemplateData(data);
            toast.success("Template saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save template");
            throw error;
        }
    }, [id])

    useEffect(()=>{
        loadPlayground();
    }, [loadPlayground])

    return {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData,
    }
}