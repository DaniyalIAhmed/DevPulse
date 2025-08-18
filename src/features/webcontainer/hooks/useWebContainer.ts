import { TemplateFolder } from '@/features/playgrounds/lib/path-to-json';
import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';
import WebContainerSingleton from './webcontainer-singleton';

interface UseWebContainerProps {
    templateData: TemplateFolder;
}

interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => void;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
    // TODO: Handle templateData changes when needed
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [instance, setInstance] = useState<WebContainer | null>(null);

    useEffect(() => {
        let mounted = true;
        
        async function initWebContainer() {
            try {
                setIsLoading(true);
                setError(null);
                
                // Get or create the singleton instance
                const webcontainerInstance = await WebContainerSingleton.getInstance();
                
                if (!mounted) return;
                setInstance(webcontainerInstance);
            } catch (error) {
                console.error("Error initializing webcontainer:", error);
                if (!mounted) return;
                setError(error instanceof Error ? error.message : "An unknown error occurred");
                setInstance(null);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }
        
        initWebContainer();
        
        return () => {
            mounted = false;
            // Don't teardown the singleton here as other components might be using it
        }
    }, [])

    const writeFileSync = useCallback(async (path: string, content: string) => {
        if (!instance) return;
        try {
            const pathParts = path.split('/');
            const folderPath = pathParts.slice(0, -1).join('/');
            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true });
            }
            await instance.fs.writeFile(path, content);
        } catch (error) {
            console.error("Error writing file:", error);
            throw error;
        }
    }, [instance])

    const destroy = useCallback(async () => {
        try {
            await WebContainerSingleton.teardown();
        } catch (error) {
            console.error("Error during WebContainer teardown:", error);
        } finally {
            setInstance(null);
            setServerUrl(null);
        }
    }, [])
    return {
        destroy, error, instance, isLoading, serverUrl, writeFileSync
    }
}