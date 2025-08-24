'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Bot, FileText, Loader2, Power, PowerOff } from 'lucide-react';
import React from 'react'

interface ToggleAIProps {
    isEnabled: boolean;
    onToggle: (isEnabled: boolean) => void;
    suggestionLoading: boolean;
    loadingProgress?: number;
    activeFeature?: string;
}

const ToggleAI: React.FC<ToggleAIProps> = ({ isEnabled, onToggle, suggestionLoading, loadingProgress = 0, activeFeature = '' }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={isEnabled ? "default" : "outline"} size="sm" onClick={(e) => { e.preventDefault() }} className={cn("relative gap-2 h-8 px-3 text-sm font-medium transition-all duration-200", isEnabled ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-200" : "bg-background hover:bg-accent text-foreground border-border", suggestionLoading && "opacity-75 animate-pulse")}>
                    {suggestionLoading ? (<Loader2 className='w-4 h-4 animate-spin' />) : (<Bot className='w-4 h-4' />)}
                    <span>AI</span>
                    {
                        isEnabled ? (<div className='size-2 rounded-full bg-green-500 animate-pulse' />) : (<div className='size-2 rounded-full bg-red-500 animate-pulse' />)
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-72'>
                <DropdownMenuLabel className='flex items-center justify-between py-2'>
                    <div className="flex items-center gap-2">
                        <Bot className='w-4 h-4 text-muted-foreground' />
                        <span className='text-sm font-medium'>AI Assistant</span>
                    </div>
                    <Badge variant={"outline"} className={cn("text-xs", isEnabled ? "bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-200" : "bg-muted text-muted-foreground")}>
                        {
                            isEnabled ? "Active" : "Inactive"
                        }
                    </Badge>
                </DropdownMenuLabel>
                {
                    suggestionLoading && activeFeature && (<div className="px-3 pb-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{activeFeature}</span>
                                <span>{Math.round(loadingProgress)}%</span>
                            </div>
                            <Progress value={loadingProgress} className='h-2' />
                        </div>
                    </div>)
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggle(!isEnabled)} className='py-2.5 cursor-pointer'>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            {isEnabled ? (<Power className='size-4 text-muted-foreground' />) : (<PowerOff className='size-4 text-muted-foreground' />)}
                            <div className="">
                                <div className="text-sm font-medium">
                                    {isEnabled ? "Disable AI" : "Enable AI"}
                                </div>
                                <div className="text-xs text-muted-foreground">Toggle AI Assistance</div>
                            </div>
                        </div>
                        <div className={cn("w-8 h-4 rounded-full border transition-all duration-200 relative", isEnabled ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50" : "bg-muted border-border")}>
                            <div className={cn("size-3 rounded-full bg-background transition-all duration-200 absolute top-0.5", isEnabled ? "left-4" : "left-0.5")}></div>
                        </div>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='py-2.5 cursor-pointer' onCanPlay={() => { }}>
                    <div className='flex items-center gap-3 w-full'>
                        <FileText className='size-4 text-muted-foreground' />
                        <div><div className="text-sm font-medium">Open Chat</div>
                            <div className="text-xs text-muted-foreground">Open a chat with the AI</div>
                        </div>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ToggleAI