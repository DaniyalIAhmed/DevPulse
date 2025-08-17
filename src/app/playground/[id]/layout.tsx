import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>{children}</SidebarProvider>
  )
}

export default layout