'use client'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LoadingStep from '@/components/ui/LoadingStep';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PlaygroundEditor from '@/features/playgrounds/components/PlaygroundEditor';
import TemplateFileTree from '@/features/playgrounds/components/TemplateFileTree';
import { useFileExplorer } from '@/features/playgrounds/hooks/useFileExplorer';
import { usePlayground } from '@/features/playgrounds/hooks/usePlayground';
import { TemplateFile, TemplateFolder } from '@/features/playgrounds/types';
import WebContainerPreview from '@/features/webcontainer/components/WebContainerPreview';
import { useWebContainer } from '@/features/webcontainer/hooks/useWebContainer';
import { AlertCircle, Bot, FileText, FolderOpen, Save, SaveAll, Settings, X } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

const Page = () => {
    const { id } = useParams<{ id: string }>();
    const [isPreviewVisible, setIsPreviewVisible] = useState(true);
    const {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData,
    } = usePlayground(id);
    const { openFile, closeFile, closeAllFiles, handleAddFile, handleAddFolder, handleDeleteFile, handleDeleteFolder, handleRenameFile, handleRenameFolder, updateFileContent, setTemplateData, setPlaygroundId, setOpenFiles, setActiveFileId, setEditorContent, openFiles, activeFileId, editorContent } = useFileExplorer();
    const {serverUrl, isLoading: isWebContainerLoading, error: webContainerError, instance: webContainerInstance, writeFileSync, destroy: destroyWebContainer} = useWebContainer({templateData: templateData || {folderName: "", items: []}});
    useEffect(() => {
        setPlaygroundId(id);
    }, [id, setPlaygroundId])
    useEffect(() => {
        if (templateData && !openFiles.length) {
            setTemplateData(templateData);
        }
    }, [templateData, setTemplateData, openFiles.length])
    // const wrappedHandleAddFile = useCallback(
    //     (newFile: TemplateFile, parentPath: string) => {
    //       return handleAddFile(
    //         newFile,
    //         parentPath,
    //         writeFileSync!,
    //         instance,
    //         saveTemplateData
    //       );
    //     },
    //     [handleAddFile, writeFileSync, instance, saveTemplateData]
    //   );

    //   const wrappedHandleAddFolder = useCallback(
    //     (newFolder: TemplateFolder, parentPath: string) => {
    //       return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    //     },
    //     [handleAddFolder, instance, saveTemplateData]
    //   );

    //   const wrappedHandleDeleteFile = useCallback(
    //     (file: TemplateFile, parentPath: string) => {
    //       return handleDeleteFile(file, parentPath, saveTemplateData);
    //     },
    //     [handleDeleteFile, saveTemplateData]
    //   );

    //   const wrappedHandleDeleteFolder = useCallback(
    //     (folder: TemplateFolder, parentPath: string) => {
    //       return handleDeleteFolder(folder, parentPath, saveTemplateData);
    //     },
    //     [handleDeleteFolder, saveTemplateData]
    //   );

    //   const wrappedHandleRenameFile = useCallback(
    //     (
    //       file: TemplateFile,
    //       newFilename: string,
    //       newExtension: string,
    //       parentPath: string
    //     ) => {
    //       return handleRenameFile(
    //         file,
    //         newFilename,
    //         newExtension,
    //         parentPath,
    //         saveTemplateData
    //       );
    //     },
    //     [handleRenameFile, saveTemplateData]
    //   );

    //   const wrappedHandleRenameFolder = useCallback(
    //     (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
    //       return handleRenameFolder(
    //         folder,
    //         newFolderName,
    //         parentPath,
    //         saveTemplateData
    //       );
    //     },
    //     [handleRenameFolder, saveTemplateData]
    //   );
    const activeFile = openFiles.find(file => file.id === activeFileId);
    const hasUnsavedChanges = openFiles.some(file => file.hasUnsavedChanges);
    const HandleFileSelect = (file: TemplateFile) => {
        openFile(file);
    }
    if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="destructive">
              Try Again
            </Button>
          </div>
        );
      }
    
      // Loading state
      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
            <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-6 text-center">
                Loading Playground
              </h2>
              <div className="mb-8">
                <LoadingStep
                  currentStep={1}
                  step={1}
                  label="Loading playground data"
                />
                <LoadingStep
                  currentStep={2}
                  step={2}
                  label="Setting up environment"
                />
                <LoadingStep currentStep={3} step={3} label="Ready to code" />
              </div>
            </div>
          </div>
        );
      }
    
      // No template data
      if (!templateData) {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
            <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-amber-600 mb-2">
              No template data available
            </h2>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Template
            </Button>
          </div>
        );
      }
    return (
        <TooltipProvider>
            <>
                {templateData && <TemplateFileTree selectedFile={activeFile} data={templateData} onFileSelect={HandleFileSelect} onAddFile={() => { }} onAddFolder={() => { }} onDeleteFile={() => { }} onDeleteFolder={() => { }} onRenameFile={() => { }} onRenameFolder={() => { }} />}
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className='-ml-1' />
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <div className="flex flex-1 items-center gap-2">
                            <div className="flex flex-col flex-1">
                                <h1 className="text-sm font-medium">{playgroundData?.title || "Code Playground"}</h1>
                                <p className="text-xs text-muted-foreground">{openFiles.length} File(s) open {hasUnsavedChanges && " • Unsaved Changes"}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => { }} disabled={!activeFile || !activeFile.hasUnsavedChanges}>
                                            <Save className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save (Ctrl + S)
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => { }} disabled={!hasUnsavedChanges} className='ml-2'>
                                            <SaveAll className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Save All (Ctrl + Shift + S)
                                    </TooltipContent>
                                </Tooltip>
                                <Separator orientation='vertical' className='h-4' />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => { }} className='ml-2'>
                                            <Bot className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Toggle AI
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        {/* <Tooltip>
                                            <TooltipTrigger asChild> */}
                                        <Button variant="outline" size="sm" className='ml-2'>
                                            <Settings className='w-4 h-4' />
                                        </Button>
                                        {/* </TooltipTrigger>
                                            <TooltipContent>
                                                Settings
                                            </TooltipContent>
                                        </Tooltip> */}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem onClick={() => { setIsPreviewVisible(!isPreviewVisible) }}>
                                            {
                                                isPreviewVisible ? "Hide " : "Show "
                                            } Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => { }}>
                                            Close All Files
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>
                    <div className="h-[calc(100vh-4rem)]">
                        {
                            openFiles.length > 0 ? (<div className='flex h-full flex-col'>
                                <div className="border-b bg-muted/30">
                                    <Tabs value={activeFileId || ""} onValueChange={setActiveFileId}>
                                        <div className="flex items-center justify-between px-4 py-2">
                                            <TabsList className='h-8 bg-transparent p-0'>
                                                {
                                                    openFiles.map((file) => (
                                                        <TabsTrigger key={file.id} value={file.id} className='relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group'>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className='size-3' />
                                                                <span className="truncate">{file.filename}.{file.fileExtension}</span>{
                                                                    file.hasUnsavedChanges && (
                                                                        <span className="size-2 rounded-full bg-yellow-500" />
                                                                    )
                                                                }
                                                                <span className="ml-2 size-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => { e.stopPropagation(); closeFile(file.id) }}>
                                                                    <X className='size-3' />
                                                                </span>
                                                            </div>
                                                        </TabsTrigger>
                                                    ))
                                                }
                                            </TabsList>
                                            {
                                                openFiles.length > 1 && (
                                                    <Button variant="ghost" size="sm" className='h-6 px-2 text-xs' onClick={() => { closeAllFiles() }}>
                                                        Close All
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    </Tabs>
                                </div>
                                <div className="flex-1">
                                    <ResizablePanelGroup direction='horizontal' className='h-full'>
                                        <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                                            <PlaygroundEditor
                                            activeFile={activeFile}
                                            content={activeFile?.content || ""}
                                            onContentChange={(value)=> activeFileId && updateFileContent(activeFileId, value)}
                                            />
                                        </ResizablePanel>
                                        {
                                            isPreviewVisible && (<>
                                            <ResizableHandle/>
                                            <ResizablePanel defaultSize={50}>
                                                <WebContainerPreview
                                                templateData={templateData!}
                                                instance={webContainerInstance}
                                                writeFileSync={writeFileSync}
                                                isDataLoading={isWebContainerLoading}
                                                error={webContainerError}
                                                forceResetup={false}
                                                serverUrl={serverUrl!}
                                                />
                                            </ResizablePanel>
                                            </>)
                                        }
                                    </ResizablePanelGroup>
                                </div>
                            </div>) : (
                                <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                                    <FileText className='size-16 text-gray-300' />
                                    <div className="text-center">
                                        <p className="text-lg font-medium">No Files Open</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </SidebarInset>
            </>
        </TooltipProvider>
    )
}

export default Page