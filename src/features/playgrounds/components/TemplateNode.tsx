import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ChevronRight, Edit3, File, FilePlus, Folder, FolderPlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NewFileDialog, NewFolderDialog, RenameFileDialog, RenameFolderDialog } from './TemplateFileTree';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
interface TemplateNodeProps {
    item: TemplateItem;
    level: number;
    path?: string;
    onFileSelect?: (file: TemplateFile) => void;
    onAddFile?: (file: TemplateFile, parentPath: string) => void;
    onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile?: (file: TemplateFile, parentPath: string, newName: string, extension: string) => void;
    onRenameFolder?: (folder: TemplateFolder, parentPath: string, newName: string) => void;
    selectedFile: TemplateFile | undefined;
}

const TemplateNode = ({ item, level, path, onFileSelect, onAddFile, onAddFolder, onDeleteFile, onDeleteFolder, onRenameFile, onRenameFolder, selectedFile }: TemplateNodeProps) => {
    const isValidItem = item && typeof item === 'object';
    const isFolder = isValidItem && 'folderName' in item;
    const [isOpen, setIsOpen] = useState(level < 2);
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    if (!isValidItem) return null;
    if (!isFolder) {
        const file = item as TemplateFile;
        const fileName = `${file.filename}.${file.fileExtension}`;
        const  isSelected = selectedFile && selectedFile.filename === file.filename && selectedFile.fileExtension === file.fileExtension;
        const handleRename = () => {
            setIsRenameDialogOpen(true);
        }
        const handleDelete = () => {
            setIsDeleteDialogOpen(true);
        }
        const confirmDelete = () => {
            onDeleteFile?.(file, path || '');
            setIsDeleteDialogOpen(false);
        }
        const handleRenameSubmit = (newFilename: string, newExtension: string) => {
            onRenameFile?.(file, path || '', newFilename, newExtension);
            setIsRenameDialogOpen(false);
        }

        const ItemComponent = level > 0 ? SidebarMenuSubItem : SidebarMenuItem;

        return (
            <ItemComponent>
                <div className="flex items-center group">
                    <SidebarMenuButton isActive={isSelected} onClick={() => { onFileSelect?.(file) }} className='flex-1'>
                        <File className='w-4 h-4 mr-2 shrink-0' />
                        <span>{fileName}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"} className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <MoreHorizontal className='w-3 h-3' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={handleRename}>
                                <Edit3 className='w-4 h-4 mr-2' />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
                                <Trash2 className='w-4 h-4 mr-2' />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </ItemComponent>
        )
    } else {
        const folder = item as TemplateFolder;
        const folderName = folder.folderName;
        const currentPath = path ? `${path}/${folderName}` : folderName;
        const handleAddFile = () => {
            setIsNewFileDialogOpen(true);
        }
        const handleRename = () => {
            setIsRenameDialogOpen(true);
        }
        const handleDelete = () => {
            setIsDeleteDialogOpen(true);
        }
        const handleAddFolder = () => {
            setIsNewFolderDialogOpen(true);
        }
        const confirmDelete = ()=>{
            onDeleteFolder?.(folder, path || '');
            setIsDeleteDialogOpen(false);
        }
        const handleCreateFile = (newFilename: string, newExtension: string) => {
            if(onAddFile){
                const newFile: TemplateFile = {
                    filename: newFilename,
                    fileExtension: newExtension,
                    content: ''
                }
                onAddFile(newFile, currentPath);
                setIsNewFileDialogOpen(false);
            }
        }
        const handleCreateFolder = (newFolderName: string) => {
            if(onAddFolder){
                const newFolder: TemplateFolder = {
                    folderName: newFolderName,
                    items: []
                }
                onAddFolder(newFolder, currentPath);
                setIsNewFolderDialogOpen(false);
            }
        }
        const handleRenameSubmit = (newFolderName: string) => {
            if(onRenameFolder){
                onRenameFolder(folder, path || '', newFolderName);
                setIsRenameDialogOpen(false);
            }
        }

        const ItemComponent = level > 0 ? SidebarMenuSubItem : SidebarMenuItem;

        return (
            <ItemComponent>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className='group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90'>
                    <div className="flex items-center group">
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton className='flex-1'>
                                <ChevronRight className='transition-transform' />
                                <Folder className="w-4 h-4 mr-2 shrink-0" />
                                <span>{folderName}</span>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"icon"} className='size-6 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <MoreHorizontal className='w-3 h-3' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={handleAddFile}>
                                    <FilePlus className='w-4 h-4 mr-2' />
                                    New File
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleAddFolder}>
                                    <FolderPlus className='w-4 h-4 mr-2' />
                                    New Folder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleRename}>
                                    <Edit3 className='w-4 h-4 mr-2' />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
                                    <Trash2 className='w-4 h-4 mr-2' />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {
                                folder.items.map((child, index) => (
                                    <TemplateNode selectedFile={selectedFile} key={index} item={child} level={level + 1} path={currentPath} onFileSelect={onFileSelect} onAddFile={onAddFile} onAddFolder={onAddFolder} onDeleteFile={onDeleteFile} onDeleteFolder={onDeleteFolder} onRenameFile={onRenameFile} onRenameFolder={onRenameFolder} />
                                ))
                            }
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
                <NewFileDialog isOpen={isNewFileDialogOpen} onClose={() => setIsNewFileDialogOpen(false)} onCreateFile={handleCreateFile} />
                <NewFolderDialog isOpen={isNewFolderDialogOpen} onClose={() => setIsNewFolderDialogOpen(false)} onCreateFolder={handleCreateFolder} />
                <RenameFolderDialog isOpen={isRenameDialogOpen} onClose={() => setIsRenameDialogOpen(false)} onRename={handleRenameSubmit} currentFolderName={folderName} />
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete this folder? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
            </ItemComponent>
        )
    }
}

export default TemplateNode