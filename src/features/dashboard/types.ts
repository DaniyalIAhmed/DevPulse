export interface User {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
    password: string | null
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Project {
    id: string
    title: string | null
    description: string | null
    template: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user: User
    starMark: { isMarked: boolean }[]
  }
  