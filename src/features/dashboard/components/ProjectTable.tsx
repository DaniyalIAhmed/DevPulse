"use client";
import Image from "next/image";
import { format } from "date-fns";
import type { Project } from "../types";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import {
    MoreHorizontal,
    Edit3,
    Trash2,
    ExternalLink,
    Copy,
    Download,
    Eye,
    LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
// import { MarkedToggleButton } from "./toggle-star";

interface ProjectTableProps {
    projects: Project[];
    onDeleteProject: (id: string) => void;
    onUpdateProject: (id: string, data: { title: string, description: string }) => void;
    onDuplicateProject: (id: string) => void;
}

interface EditProjectData {
    title: string;
    description: string;
}

const ProjectTable = ({ projects, onDeleteProject, onUpdateProject, onDuplicateProject }: ProjectTableProps) => {
    const [confirmDelete, setConfirmDelete] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [editData, setEditData] = useState<EditProjectData>({
        title: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [favoutrie, setFavourite] = useState(false);


    const handleDuplicateProject = async (project: Project) => {
        if (!onDuplicateProject) return;
        setIsLoading(true);
        try {
            await onDuplicateProject(project.id);
            toast.success("Project duplicated successfully");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteProject = async()=>{
        if(!selectedProject || !onDeleteProject) return;
        if(confirmDelete !== "CONFIRM") return;
        setIsLoading(true);
        try {
            await onDeleteProject(selectedProject.id);
            setDeleteDialogOpen(false);
            setConfirmDelete("");
            toast.success("Project deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete project");
        } finally {
            setIsLoading(false);
        }
    }
    const handleDeleteClick = async (project: Project) => {
        setSelectedProject(project);
        setDeleteDialogOpen(true);
    }
    const handleUpdateProject = async () => {
        if(!selectedProject || !onUpdateProject) return;
        setIsLoading(true);
        try {
            await onUpdateProject(selectedProject.id, editData);
            setEditDialogOpen(false);
            setSelectedProject(null);
            toast.success("Project updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update project");
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditClick = async (project: Project) => {
        setSelectedProject(project);
        setEditData({
            title: project.title,
            description: project.description || "",
        })
        setEditDialogOpen(true);
    }
    const copyProjectUrl = async (projectId: string) => { 
        const url = `${window.location.origin}/playground/${projectId}`;
        navigator.clipboard.writeText(url);
        toast.success("Project URL copied to clipboard");
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Project</TableHead>
                            <TableHead className="">Template</TableHead>
                            <TableHead className="">Created</TableHead>
                            <TableHead className="">User</TableHead>
                            <TableHead className="w-[50px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <Link href={`/playground/${project.id}`} className="hover:underline">
                                                <span className="font-semibold">{project.title}</span>
                                            </Link>
                                            <span className="text-sm text-muted-foreground line-clamp-1">{project.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="bg-[#E93F3F15] text-[#E93F3F] border-[#E93F3F]"
                                        >
                                            {project.template}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(project.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={project.user.image || "/placeholder.svg"}
                                                    alt={project.user.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-sm">{project.user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    {/* <MarkedToggleButton
                                                    markedForRevision={project.Starmark[0]?.isMarked}
                                                    id={project.id}
                                                /> */}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/playground/${project.id}`}
                                                        className="flex items-center"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Open Project
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/playground/${project.id}`}
                                                        target="_blank"
                                                        className="flex items-center"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Open in New Tab
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleEditClick(project)}
                                                >
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Edit Project
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDuplicateProject(project)}
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                onClick={() => copyProjectUrl(project.id)}
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Copy URL
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(project)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Make changes to your project here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Name</Label>
                            <Input
                                id="title"
                                value={editData.title}
                                onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Project Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter project description"
                                value={editData.description}
                                onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="button" variant="brand" onClick={handleUpdateProject} disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin size-4" />: "Save Changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Input
                                id="confirmDelete"
                                type="text"
                                placeholder="CONFIRM?"
                                value={confirmDelete}
                                onChange={(e) => setConfirmDelete(e.target.value)}
                            />{
                                confirmDelete !== "CONFIRM" && (
                                    <span className="text-red-500 text-[12px]">Please type CONFIRM to delete</span>
                                )
                            }
                        </div>
                    </div>
                    <AlertDialogFooter className="flex justify-between">
                        <AlertDialogCancel type="button" onClick={() => {setDeleteDialogOpen(false);setConfirmDelete("")}}>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="button" onClick={handleDeleteProject} disabled={isLoading || confirmDelete !== "CONFIRM"}>{isLoading ? <LoaderCircle className="animate-spin size-4" />: "Delete"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ProjectTable