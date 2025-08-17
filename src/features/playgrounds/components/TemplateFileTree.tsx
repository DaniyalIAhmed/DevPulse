"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarRail } from '@/components/ui/sidebar';
import { FilePlus, FolderPlus, Plus } from 'lucide-react';
import React, { useState } from 'react';
import TemplateNode from './TemplateNode';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TemplateFile {
    filename: string;
    fileExtension: string;
    content: string;
}
interface TemplateFolder {
    folderName: string;
    items: (TemplateFile | TemplateFolder)[];
}

type TemplateItem = TemplateFile | TemplateFolder;

interface TemplateFileTreeProps {
    data: TemplateItem;
    onFileSelect?: (file: TemplateFile, parentPath: string) => void;
    selectedFile?: TemplateFile;
    title?: string;
    onAddFile?: (file: TemplateFile, parentPath: string) => void;
    onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile?: (file: TemplateFile, parentPath: string, newName: string, extension: string) => void;
    onRenameFolder?: (folder: TemplateFolder, parentPath: string, newName: string) => void;
}

const TemplateFileTree: React.FC<TemplateFileTreeProps> = ({
    data,
    onFileSelect,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder,
    selectedFile,
    title = "File Explorer",
}) => {
    const isRootFolder = data && typeof data === "object" && "folderName" in data;
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

    const handleAddRootFile = () => {
        setIsNewFileDialogOpen(true);
    }
    const handleAddRootFolder = () => {
        setIsNewFolderDialogOpen(true);
    }
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{title}</SidebarGroupLabel>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarGroupAction>
                                <Plus className='w-4 h-4' />
                            </SidebarGroupAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={handleAddRootFile}>
                                <FilePlus className='w-4 h-4 mr-2' />
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddRootFolder}>
                                <FolderPlus className='w-4 h-4 mr-2' />
                                New Folder
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                    isRootFolder ? ((data as TemplateFolder).items.map((child, index) => (<TemplateNode selectedFile={selectedFile} onFileSelect={onFileSelect} onAddFile={onAddFile} onAddFolder={onAddFolder} onDeleteFile={onDeleteFile} onDeleteFolder={onDeleteFolder} onRenameFile={onRenameFile} onRenameFolder={onRenameFolder} key={index} item={child} level={0} path="" />))) :
                                        (
                                        <TemplateNode selectedFile={selectedFile} onFileSelect={onFileSelect} onAddFile={onAddFile} onAddFolder={onAddFolder} onDeleteFile={onDeleteFile} onDeleteFolder={onDeleteFolder} onRenameFile={onRenameFile} onRenameFolder={onRenameFolder} item={data} level={0} path="" />
                                    )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
            <NewFileDialog isOpen={isNewFileDialogOpen} onClose={() => setIsNewFileDialogOpen(false)} onCreateFile={()=>{}} />
            <NewFolderDialog isOpen={isNewFolderDialogOpen} onClose={() => setIsNewFolderDialogOpen(false)} onCreateFolder={()=>{}} />
            {/* <RenameFileDialog isOpen={isRenameFileDialogOpen} onClose={() => setIsRenameFileDialogOpen(false)} onRenameFile={()=>{}} />
            <RenameFolderDialog isOpen={isRenameFolderDialogOpen} onClose={() => setIsRenameFolderDialogOpen(false)} onRenameFolder={()=>{}} /> */}
        </Sidebar>
    )
}

export default TemplateFileTree;

interface NewFileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateFile: (filename: string, extension: string) => void;
}

export const NewFileDialog: React.FC<NewFileDialogProps> = ({ isOpen, onClose, onCreateFile }) => {
    const [filename, setFilename] = useState('');
    const [fileExtension, setFileExtension] = useState('');

    const handleCreateFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (filename.trim()) {
            onCreateFile(filename.trim(), fileExtension.trim() || 'js');
            setFilename('');
            setFileExtension('');
            // onClose();
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                    <DialogDescription>Enter a name for the new file and select an extension</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFile} className='space-y-4'>
                    <div className='grid gap-4 py-4'>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor='filename' className='text-right'>File Name</Label>
                            <Input id='filename' value={filename} onChange={(e) => setFilename(e.target.value)}  className='col-span-2' autoFocus placeholder='Enter file name'/>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor='extension' className='text-right'>File Extension</Label>
                            <Input id='extension' value={fileExtension} onChange={(e) => setFileExtension(e.target.value)}  className='col-span-2' placeholder='Enter file extension'/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
                        <Button type='submit' disabled={!filename.trim() || !fileExtension.trim()}>Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface NewFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string) => void;
}

export const NewFolderDialog: React.FC<NewFolderDialogProps> = ({ isOpen, onClose, onCreateFolder }) => {
    const [filename, setFilename] = useState('');

    const handleCreateFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (filename.trim()) {
            onCreateFolder(filename.trim());
            setFilename('');
            // onClose();
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Enter a name for the new folder</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFile} className='space-y-4'>
                    <div className='grid gap-4 py-4'>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor='foldername' className='text-right'>Folder Name</Label>
                            <Input id='foldername' value={filename} onChange={(e) => setFilename(e.target.value)}  className='col-span-2' autoFocus placeholder='Enter folder name'/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
                        <Button type='submit' disabled={!filename.trim()}>Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
interface RenameFileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRenameFile: (filename: string, extension: string) => void;
}

export const RenameFileDialog: React.FC<RenameFileDialogProps> = ({ isOpen, onClose, onRenameFile }) => {
    const [filename, setFilename] = useState('');
    const [fileExtension, setFileExtension] = useState('');

    const handleCreateFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (filename.trim()) {
            onRenameFile(filename.trim(), fileExtension.trim() || 'js');
            setFilename('');
            setFileExtension('');
            // onClose();
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename File</DialogTitle>
                    <DialogDescription>Enter a new name for the file</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFile} className='space-y-4'>
                    <div className='grid gap-4 py-4'>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor='filename' className='text-right'>File Name</Label>
                            <Input id='filename' value={filename} onChange={(e) => setFilename(e.target.value)}  className='col-span-2' autoFocus placeholder='Enter file name'/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
                        <Button type='submit' disabled={!filename.trim()}>Rename</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface RenameFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (folderName: string) => void;
    currentFolderName: string;
}

export const RenameFolderDialog: React.FC<RenameFolderDialogProps> = ({ isOpen, onClose, onRename, currentFolderName }) => {
    const [filename, setFilename] = useState('');

    const handleCreateFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (filename.trim()) {
            onRename(filename.trim());
            setFilename('');
            // onClose();
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Folder</DialogTitle>
                    <DialogDescription>Enter a new name for the folder</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFile} className='space-y-4'>
                    <div className='grid gap-4 py-4'>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor='foldername' className='text-right'>Folder Name</Label>
                            <Input id='foldername' value={filename} onChange={(e) => setFilename(e.target.value)}  className='col-span-2' autoFocus placeholder='Enter folder name'/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
                        <Button type='submit' disabled={!filename.trim()}>Rename</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}