import { RecentActionsAPI } from "./ResentActions";
import { Sidebar } from "./SideBar";
import { type ReactNode } from "react";
import { Header } from "./Header";
import { useParams } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const path = window.location.pathname;
  const pageFromPage = [
    {
      path: "/",
      title: "Главная страница",
    },
    {
      path: "/characteristics",
      title: "Характеристики",
    },
    {
      path: "/contracts",
      title: "Договоры",
    },
    {
      path: "/addeds",
      title: "Добавленные",
    },
    {
      path: "/settings",
      title: "Настройки",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header
          title={pageFromPage.find((c) => c.path == path)?.title || ""}
          children={""}
          key={1}
        />
        {children}
      </div>
      <div className="w-80 border-l p-6 hidden xl:block">
        <RecentActionsAPI />
      </div>
    </div>
  );
}
