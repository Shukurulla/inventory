import { recentActions } from "@/data/recen-actions";
import { RecentActions } from "./ResentActions";
import { Sidebar } from "./SideBar";
import type { ReactNode } from "react";

export default function Layout({children}:{children: ReactNode}){
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col ">{children}</div>
            <div className="w-80 border-l p-6 hidden xl:block">
                <RecentActions actions={recentActions} />
            </div>
        </div>
    )
}