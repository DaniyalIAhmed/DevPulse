'use client'
import { Progress } from '@/components/ui/progress';
import { TemplateFolder } from '@/features/playgrounds/lib/path-to-json';
import { WebContainer } from '@webcontainer/api';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { transformToWebContainerFormat } from '../hooks/transformer';
import TerminalComponent from './Terminal';

interface WebContainerPreviewProps {
    serverUrl: string;
    templateData: TemplateFolder;
    isDataLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    forceResetup?: boolean;
    writeFileSync: (path: string, content: string) => Promise<void>;
}

const WebContainerPreview = ({ serverUrl, templateData, isDataLoading, error, instance, forceResetup, writeFileSync }: WebContainerPreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
    });
    const [currentStep, setCurrentStep] = useState<number>(0);
    const totalSteps = 4;
    const [setupError, setSetupError] = useState<string | null>(null);
    const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
    const [isSetupInProgress, setIsSetupInProgress] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const terminalRef = useRef<any>(null);

    useEffect(() => {
        if (forceResetup) {
            setIsSetupComplete(false);
            setSetupError(null);
            setCurrentStep(0);
            setIsSetupInProgress(false);
            setPreviewUrl("");
            setIsLoading({
                transforming: false,
                mounting: false,
                installing: false,
                starting: false,
                ready: false,
            })
        }
    }, [forceResetup]);
    useEffect(() => {
        async function setupWebContainer() {
            console.log("setupWebContainer called", { instance: !!instance, isSetupComplete, isSetupInProgress });

            if (!instance || isSetupComplete || isSetupInProgress) return;

            try {
                setIsSetupInProgress(true);
                setSetupError(null);
                console.log("Starting WebContainer setup...");

                // Check if files are already mounted (container was used before)
                try {
                    const packageJsonExists = await instance.fs.readFile("/package.json", "utf-8");
                    if (packageJsonExists) {
                        if (terminalRef.current?.writeToTerminal) {
                            terminalRef.current.writeToTerminal("Reconnecting to Existing WebContainer...")
                        }
                    }

                    instance.on("server-ready", (port: number, url: string) => {
                        console.log("Server ready", port, url);
                        if (terminalRef.current?.writeToTerminal) {
                            terminalRef.current.writeToTerminal(`Server is running on ${url}\r\n`)
                        }
                        setPreviewUrl(url);
                        setIsLoading((prev) => ({ ...prev, starting: false, ready: true }));
                        setIsSetupComplete(true);
                        setIsSetupInProgress(false);
                    });
                    setCurrentStep(4);
                    setIsLoading((prev) => ({ ...prev, starting: true }));

                    // Try to start the server
                    const serverProcess = await instance.spawn('npm', ['start']);
                    serverProcess.output.pipeTo(
                        new WritableStream({
                            write(data) {
                                console.log("Server output:", data);
                                if (terminalRef.current?.writeToTerminal) {
                                    terminalRef.current.writeToTerminal(data)
                                }
                            }
                        })
                    );
                    return;

                } catch (error) {
                    console.log("No existing files, proceeding with full setup...");
                }

                setIsLoading((prev) => ({ ...prev, transforming: true }));
                setCurrentStep(1);
                console.log("Step 1: Transforming template...");
                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("Transforming template...\r\n")
                }
                const files = transformToWebContainerFormat(templateData);
                console.log("Files transformed:", Object.keys(files));

                setIsLoading((prev) => ({ ...prev, transforming: false, mounting: true }));
                setCurrentStep(2);
                console.log("Step 2: Mounting files...");
                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("Mounting files...\r\n")
                }
                await instance.mount(files);
                console.log("Files mounted successfully");

                setIsLoading((prev) => ({ ...prev, mounting: false, installing: true }));
                setCurrentStep(3);
                console.log("Step 3: Installing dependencies...");

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("Installing dependencies...\r\n")
                }

                const installProcess = await instance.spawn('npm', ['install']);
                installProcess.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            if (terminalRef.current?.writeToTerminal) {
                                terminalRef.current.writeToTerminal(data)
                            }
                        }
                    })
                );

                const installExitCode = await installProcess.exit;
                console.log("Install process exit code:", installExitCode);

                if (installExitCode !== 0) {
                    throw new Error("Failed to install dependencies");
                }


                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("Dependencies installed successfully\r\n")
                }

                setIsLoading((prev) => ({ ...prev, installing: false, starting: true }));
                setCurrentStep(4);
                console.log("Step 4: Starting server...");

                instance.on("server-ready", (port: number, url: string) => {
                    console.log("Server ready event received", port, url);
                    if (terminalRef.current?.writeToTerminal) {
                        terminalRef.current.writeToTerminal(`Your Server is ready at this url: ${url}\r\n`)
                    }
                    setPreviewUrl(url);
                    setIsLoading((prev) => ({ ...prev, starting: false, ready: true }));
                    setIsSetupComplete(true);
                    setIsSetupInProgress(false);
                });

                const serverProcess = await instance.spawn('npm', ['start']);
                serverProcess.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            console.log("Server output:", data);
                            if (terminalRef.current?.writeToTerminal) {
                                terminalRef.current.writeToTerminal(data)
                            }
                        }
                    })
                );

            } catch (error) {
                console.error("Setup failed", error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal(`Setup failed: ${errorMessage}\r\n`)
                }
                setSetupError(errorMessage);
                setIsSetupInProgress(false);
                setIsSetupComplete(false);
                setIsLoading({
                    transforming: false,
                    mounting: false,
                    installing: false,
                    starting: false,
                    ready: false,
                });
            }
        }

        setupWebContainer();
    }, [instance, isSetupComplete, isSetupInProgress, templateData])
    useEffect(() => {
        return () => {

        };
    }, [])
    if (isDataLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                    <h3 className="text-lg font-medium">Initializing WebContainer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Setting up the environment for your project...
                    </p>
                </div>
            </div>
        );
    }
    if (error || setupError) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
                    <div className="flex items-center gap-2 mb-3">
                        <XCircle className="h-5 w-5" />
                        <h3 className="font-semibold">Error</h3>
                    </div>
                    <p className="text-sm">{error || setupError}</p>
                </div>
            </div>
        );
    }
    const getStepIcon = (stepIndex: number) => {
        if (stepIndex < currentStep) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else if (stepIndex === currentStep) {
            return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
        } else {
            return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
        }
    };

    const getStepText = (stepIndex: number, label: string) => {
        const isActive = stepIndex === currentStep;
        const isComplete = stepIndex < currentStep;

        return (
            <span className={`text-sm font-medium ${isComplete ? 'text-green-600' :
                isActive ? 'text-blue-600' :
                    'text-gray-500'
                }`}>
                {label}
            </span>
        );
    };
    return (
        <div className='h-full w-full flex flex-col'>
            {!previewUrl ? (<div className='h-full w-full flex flex-col'>
                <div className="h-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
                    <h3 className='text-lg font-medium mb-4'>
                        Setting up your environment
                    </h3>
                    <Progress value={(currentStep / totalSteps) * 100} className='h-2 mb-6' />
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            {getStepIcon(1)}
                            {getStepText(1, "Transforming template")}
                        </div>
                        <div className="flex items-center gap-3">
                            {getStepIcon(2)}
                            {getStepText(2, "Mounting files")}
                        </div>
                        <div className="flex items-center gap-3">
                            {getStepIcon(3)}
                            {getStepText(3, "Installing dependencies")}
                        </div>
                        <div className="flex items-center gap-3">
                            {getStepIcon(4)}
                            {getStepText(4, "Starting server")}
                        </div>
                    </div>
                </div>
                <div className='flex-1 p-4'>
                    <TerminalComponent
                        ref={terminalRef}

                        webContainerInstance={instance}
                        theme='dark'
                        className='h-full'
                    />
                </div>
            </div>) : (<div className='h-full  flex flex-col'>
                <div className="flex-1">
                    <iframe src={previewUrl} className='h-full w-full border-none' title='WebContainer Preview' />
                </div>
                <div className="h-64 border-t">
                    <TerminalComponent
                        ref={terminalRef}

                        webContainerInstance={instance}
                        theme='dark'
                        className='h-full'
                    />
                </div>
            </div>)}
        </div>
    )
}

export default WebContainerPreview