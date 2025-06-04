// src/pages/Settings.tsx - Soddalashtirilgan profil
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetUserProfileQuery } from "@/api/userApi";
import { Loader2 } from "lucide-react";

type Theme = "light" | "dark" | "system";

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentFont, setCurrentFont] = useState("SF Pro Display");

  // API hooks
  const { data: userProfile, isLoading: profileLoading } =
    useGetUserProfileQuery();

  // Profile form state - faqat kerakli fieldlar

  // Load profile data
  useEffect(() => {
    if (userProfile) {
    }
  }, [userProfile]);

  // Theme and font effects
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedFont = localStorage.getItem("font") || "SF Pro Display";
    if (savedTheme) setTheme(savedTheme);
    setCurrentFont(savedFont);
    applyTheme(savedTheme || "light");
    applyFont(savedFont);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("dark");
    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    }
  };

  const applyFont = (fontName: string) => {
    document.body.style.fontFamily = `"${fontName}", sans-serif`;
    const existingFontStyle = document.getElementById("dynamic-font-style");
    if (existingFontStyle) {
      existingFontStyle.remove();
    }

    const style = document.createElement("style");
    style.textContent = `* { font-family: "${fontName}", sans-serif !important; }`;
    style.id = "dynamic-font-style";
    document.head.appendChild(style);
  };

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme);
    toast.success(
      `Тема изменена на ${
        selectedTheme === "light"
          ? "светлую"
          : selectedTheme === "dark"
          ? "тёмную"
          : "системную"
      }`
    );
  };

  const handleFontChange = (fontName: string) => {
    setCurrentFont(fontName);
    localStorage.setItem("font", fontName);
    applyFont(fontName);
    toast.success(`Шрифт изменен на ${fontName}`);
  };

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка профиля...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        {/* Color Mode Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Цветовой режим</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Light Theme Card */}
            <div
              className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
                theme === "light" ? "ring-2 ring-indigo-500" : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="flex items-center gap-2">
                <LogoIcon width={25} />
                <span className="font-medium text-black">iMaster</span>
              </div>
              <span className="text-black text-sm mt-2">Светлый</span>
            </div>

            {/* System Theme Card */}
            <div
              className={`border relative rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
                theme === "system" ? "ring-2 ring-indigo-500" : ""
              }`}
              style={{
                background: "linear-gradient(to right, white 50%, #1A1A1A 50%)",
              }}
              onClick={() => handleThemeChange("system")}
            >
              <div className="flex items-center gap-2">
                <LogoIcon width={25} />
                <span className="font-medium text-black">iMaster</span>
              </div>
              <span className="text-gray-600 text-sm mt-2">Системный</span>
            </div>

            {/* Dark Theme Card */}
            <div
              className={`border rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] text-white cursor-pointer transition-all hover:shadow-md ${
                theme === "dark" ? "ring-2 ring-indigo-500" : ""
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="flex items-center gap-2">
                <LogoIcon width={25} color="#fff" />
                <span className="font-medium text-white">iMaster</span>
              </div>
              <span className="text-white text-sm mt-2">Тёмный</span>
            </div>
          </div>
        </div>

        {/* Font Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Шрифт</h2>
          <div className="grid grid-cols-3 gap-4">
            {["SF Pro Display", "Inter", "Roboto"].map((font) => (
              <Button
                key={font}
                variant={currentFont === font ? "default" : "outline"}
                onClick={() => handleFontChange(font)}
                className={`h-12 text-lg font-medium flex items-center justify-center gap-2 ${
                  currentFont === font
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-background border-border hover:bg-accent"
                }`}
              >
                <span className="text-2xl">Aa</span> {font}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Текущий шрифт: {currentFont}
          </p>
        </div>

        {/* Profile Section */}
      </div>
    </Layout>
  );
};

export default SettingsPage;
