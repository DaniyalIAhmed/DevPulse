import EmptyState from '@/components/ui/EmptyState';
import { deleteProjectById, duplicateProjectById, editProjectById, getPlaygrounds } from '@/features/dashboard/actions';
import AddnewButton from '@/features/dashboard/components/AddnewButton'
import AddRepoButton from '@/features/dashboard/components/AddRepoButton'
import ProjectTable from '@/features/dashboard/components/ProjectTable';
import React from 'react'

const Page = async () => {
    const playgrounds = await getPlaygrounds();
    return (
        <div className='flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-2'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <AddnewButton />
                <AddRepoButton />
            </div>
            <div className="mt-10 flex flex-col justify-center items-center w-full">
                {
                    playgrounds && playgrounds.length === 0 ? (
                        <EmptyState title="No Playgrounds Found" description="Create a new playground to get started" imageSrc="/empty-state.svg" />
                    ) : (
                        <ProjectTable 
                        projects={playgrounds || []} 
                        onDeleteProject={deleteProjectById} 
                        onUpdateProject={editProjectById} 
                        onDuplicateProject={duplicateProjectById} 
                        />
                    )
                }
            </div>
        </div>
    )
}

export default Page