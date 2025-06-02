import React, { useEffect, useState } from "react";
import { Characteristics } from "../assets/Icons/CharacteristicsIcon";
import { SavedIcon } from "../assets/Icons/SavedIcon";
import { LayersIcon } from "../assets/Icons/LayersIcon";
import { SettingsIcon } from "../assets/Icons/SettingsIcon";
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV_KEY = "active_nav";

export function Sidebar() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>(() => {
    return localStorage.getItem(NAV_KEY) || "Главная страница";
  });

  useEffect(() => {
    localStorage.setItem(NAV_KEY, activeNav);
  }, [activeNav]);

  const handleNavClick = (label: string) => {
    setActiveNav(label);
  };

  return (
    <div className="w-64 lg:w-72 border-r-2 bg-background">
      <div className="fixed top-0 bottom-0 left-0 w-64 lg:w-72 flex flex-col inset-0">
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 font-semibold text-2xl">
            <LogoIcon width={36} height={36} />
            iMaster
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            icon={<HomeIcon width={22} />}
            label="Главная страница"
            active={activeNav === "Главная страница"}
            onClick={() => {
              navigate("/");
              handleNavClick("Главная страница");
            }}
          />
          <NavItem
            icon={<Characteristics width={24} className="scale-115" />}
            label="Характеристики"
            active={activeNav === "Характеристики"}
            onClick={() => {
              navigate("/characteristics");
              handleNavClick("Характеристики");
            }}
          />
          <NavItem
            icon={<SavedIcon width={24} height={24} />}
            label="Договоры"
            active={activeNav === "Договоры"}
            onClick={() => {
              navigate("/contracts");
              handleNavClick("Договоры");
            }}
          />
          <NavItem
            icon={<LayersIcon width={24} height={24} />}
            label="Добавленные"
            badge="67"
            active={activeNav === "Добавленные"}
            onClick={() => {
              navigate("/addeds");
              handleNavClick("Добавленные");
            }}
          />
          <NavItem
            icon={<SettingsIcon width={24} height={24} />}
            label="Настройки"
            active={activeNav === "Настройки"}
            onClick={() => {
              navigate("/settings");
              handleNavClick("Настройки");
            }}
          />
        </nav>
        <div className="p-3 flex items-center justify-center w-full">
          <div className="p-3 w-full border-2 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
              АД
            </div>
            <div className="text-sm">
              <p className="text-sm font-medium">Ахмет Даулетмуратов</p>
              <div className="text-xs">@max_manager</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, badge, active, onClick }: NavItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 h-12 rounded-[0.5rem] text-sm font-medium cursor-pointer ${
        active
          ? "text-indigo-600 dark:text-indigo-300 dark:stroke-indigo-300/50 stroke-indigo-500 fill-indigo-800 bg-indigo-100 dark:bg-indigo-400/10"
          : "text-muted-foreground fill-gray-500 stroke-zinc-800 dark:stroke-zinc-500 hover:bg-muted hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className={`text-sm ${
            active
              ? "bg-indigo-100 dark:bg-indigo-400/10"
              : "bg-gray-200 dark:bg-zinc-800 text-primary"
          }  w-7 h-7 flex items-center justify-center rounded-full`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
