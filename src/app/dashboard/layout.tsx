import { SidebarProvider } from "@/components/ui/sidebar";
import { getPlaygrounds } from "@/features/dashboard/actions";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";

type PlaygroundWithRelations = {
    id: string;
    title: string | null;
    description: string | null;
    template: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    starMark: { isMarked: boolean }[];
};

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
    const playgrounds = await getPlaygrounds();
    const technologyIconMap: Record<string, string>={
        REACT:"Zap",
        NESTJS: "Lightbulb",
        EXPRESS: "Database",
        VUE: "Compass",
        HONO: "FlameIcon",
        ANGULAR: "Terminal",
    }
    const formattedPlaygrounds = playgrounds?.map((playground: PlaygroundWithRelations)=>{
        return {
            id: playground.id,
            name: playground.title || "",
            starred: playground.starMark?.[0]?.isMarked ||false,
            icon: technologyIconMap[playground.template]|| "Code2",
        }
    }) || [];
    return (
        <SidebarProvider>
            <div className="flex mint-h-screen w-full overflow-x-hidden">
                <DashboardSidebar initialPlaygroundData={formattedPlaygrounds}/>
                <main className="flex-1">
                    
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}