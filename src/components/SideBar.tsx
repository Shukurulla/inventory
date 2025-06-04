// src/components/SideBar.tsx
import React, { useEffect, useState } from "react";
import { Characteristics } from "../assets/Icons/CharacteristicsIcon";
import { SavedIcon } from "../assets/Icons/SavedIcon";
import { LayersIcon } from "../assets/Icons/LayersIcon";
import { SettingsIcon } from "../assets/Icons/SettingsIcon";
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import { HomeIcon, User, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "@/api/userApi";
import { useGetAddedEquipmentsQuery } from "@/api/universityApi";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

const NAV_KEY = "active_nav";

export function Sidebar() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>(() => {
    return localStorage.getItem(NAV_KEY) || "Главная страница";
  });

  // API hooks
  const { data: userProfile, isLoading: profileLoading } =
    useGetUserProfileQuery();
  const { data: addedEquipments } = useGetAddedEquipmentsQuery();

  useEffect(() => {
    localStorage.setItem(NAV_KEY, activeNav);
  }, [activeNav]);

  const handleNavClick = (label: string) => {
    setActiveNav(label);
  };

  const handleLogout = () => {
    // Clear all tokens and user data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.setItem("active_nav", "Главная страница");

    toast.success("Успешно вышли из системы");
    navigate("/login", { replace: true });
  };

  const getInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.first_name?.charAt(0) || ""}${
      userProfile.last_name?.charAt(0) || ""
    }`;
  };

  const getUserDisplayName = () => {
    if (!userProfile) return "Пользователь";
    return (
      `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() ||
      userProfile.username
    );
  };

  const getEquipmentCount = () => {
    return addedEquipments?.length || 0;
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
            badge={getEquipmentCount().toString()}
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

        {/* User Profile Section */}
        <div className="p-3 border-t">
          {profileLoading ? (
            <div className="flex items-center justify-center p-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-2 text-sm">Загрузка...</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {userProfile?.profile_picture ? (
                  <img
                    src={userProfile.profile_picture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                    {getInitials()}
                  </div>
                )}
                <div className="text-sm min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {getUserDisplayName()}
                  </p>
                  <div className="text-xs text-muted-foreground truncate">
                    @{userProfile?.username || "user"}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigate("/settings");
                    handleNavClick("Настройки");
                  }}
                  className="h-8 w-8 rounded-full hover:bg-accent"
                  title="Настройки профиля"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                  title="Выйти"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
