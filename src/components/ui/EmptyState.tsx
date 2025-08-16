import Image from 'next/image'
import React from 'react'

const EmptyState = ({title, description, imageSrc}: {title: string, description: string, imageSrc?: string}) => {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
        <Image src={imageSrc!} alt="Empty State" className='w-48 h-48 mb-4' width={90} height={90} />
        <h2 className="text-xl font-semibold text-gray-500">{title}</h2>
        <p className={"text-gray-400"}>{description}</p>
    </div>
  )
}

export default EmptyState