// src/pages/Settings.tsx - Fixed version
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

type Theme = "light" | "dark" | "system";

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentFont, setCurrentFont] = useState("SF Pro Display");

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: "Ахмет",
    lastName: "Даулетмуратов",
    username: "max_manager",
    email: "ahmet.dauletmuratov@example.com",
    phone: "+998 90 123 45 67",
    position: "Менеджер по оборудованию",
    department: "IT отдел",
    joinDate: "2023-01-15",
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    ...profileData,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedFont = localStorage.getItem("font") || "SF Pro Display";
    setTheme(savedTheme);
    setCurrentFont(savedFont);
    applyTheme(savedTheme);
    applyFont(savedFont);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("dark");

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      // Light theme is default, no class needed
    } else if (selectedTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    }
  };

  const applyFont = (fontName: string) => {
    // Apply font to body and all elements
    document.body.style.fontFamily = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

    // Also apply to root element for better coverage
    document.documentElement.style.setProperty(
      "--font-family",
      `"${fontName}", sans-serif`
    );

    // Force update all text elements
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: "${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
      }
    `;

    // Remove any existing font style
    const existingFontStyle = document.getElementById("dynamic-font-style");
    if (existingFontStyle) {
      existingFontStyle.remove();
    }

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

  const handleProfileSave = async () => {
    try {
      // Simulate API call to save profile data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update original data to reflect saved changes
      setOriginalProfileData({ ...profileData });
      setIsEditing(false);
      toast.success("Профиль успешно обновлен!");

      console.log("Profile saved:", profileData);
    } catch (error) {
      toast.error("Ошибка при сохранении профиля");
      console.error("Error saving profile:", error);
    }
  };

  const handleProfileCancel = () => {
    // Revert changes to original data
    setProfileData({ ...originalProfileData });
    setIsEditing(false);
    toast.info("Изменения отменены");
  };

  const handleInputChange = (
    field: keyof typeof profileData,
    value: string
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasProfileChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground p-6">
        {/* Tabs */}
        <Tabs defaultValue="main" className="mb-6">
          <TabsList className="bg-transparent border-b border-border">
            <TabsTrigger
              value="main"
              className="px-4 py-2 text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Основные
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="px-4 py-2 text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              Профиль
            </TabsTrigger>
          </TabsList>

          {/* Main Settings Tab */}
          <TabsContent value="main" className="space-y-8">
            {/* Color Mode Section */}
            <div>
              <h2 className="text-lg font-medium mb-4 text-foreground">
                Цветовой режим
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Light Theme Card */}
                <div
                  className={`border border-border bg-white rounded-lg p-4 flex flex-col items-center justify-center  cursor-pointer transition-all hover:shadow-md ${
                    theme === "light" ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="flex items-center gap-2">
                    <LogoIcon width={25} />
                    <i className="font-medium contain text-[#010]">iMaster</i>
                  </div>
                  <i className="text-[#010] text-sm mt-2">Светлый</i>
                </div>

                {/* System Theme Card */}
                <div
                  className={`border border-zinc-200 dark:border-zinc-700 relative rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
                    theme === "system" ? "ring-2 ring-indigo-500" : ""
                  }`}
                  style={{
                    background:
                      "linear-gradient(to right, white 50%, #1A1A1A 50%)",
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
                  className={`border border-zinc-600 rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] text-white cursor-pointer transition-all hover:shadow-md ${
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
            <div>
              <h2 className="text-lg font-medium mb-4 text-foreground">
                Шрифт
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {["SF Pro Display", "Inter", "Roboto"].map((font) => (
                  <Button
                    key={font}
                    variant={currentFont === font ? "default" : "outline"}
                    onClick={() => handleFontChange(font)}
                    className={`border-border rounded-md h-12 text-lg font-medium flex items-center justify-center gap-2 transition-all hover:shadow-md ${
                      currentFont === font
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-background text-foreground border-border hover:bg-accent"
                    }`}
                  >
                    <span className="text-2xl">Aa</span> {font}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Текущий шрифт: {currentFont}
              </p>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-4xl">
              {/* Profile Header */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-card-foreground">
                    Информация профиля
                  </CardTitle>
                  <div className="flex gap-2">
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={handleProfileCancel}
                        className="flex items-center gap-2"
                      >
                        Отменить
                      </Button>
                    )}
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() =>
                        isEditing ? handleProfileSave() : setIsEditing(true)
                      }
                      className="flex items-center gap-2"
                      disabled={isEditing && !hasProfileChanges()}
                    >
                      <Edit className="h-4 w-4" />
                      {isEditing ? "Сохранить" : "Редактировать"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-2xl">
                      {profileData.firstName.charAt(0)}
                      {profileData.lastName.charAt(0)}
                    </div>
                    {isEditing && (
                      <Button variant="outline">Изменить фото</Button>
                    )}
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-card-foreground"
                      >
                        Имя
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-card-foreground"
                      >
                        Фамилия
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-card-foreground"
                      >
                        Имя пользователя
                      </Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-card-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-card-foreground">
                        Телефон
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="position"
                        className="text-card-foreground"
                      >
                        Должность
                      </Label>
                      <Input
                        id="position"
                        value={profileData.position}
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-card-foreground"
                      >
                        Отдел
                      </Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="joinDate"
                        className="text-card-foreground"
                      >
                        Дата приема
                      </Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={profileData.joinDate}
                        onChange={(e) =>
                          handleInputChange("joinDate", e.target.value)
                        }
                        disabled={!isEditing}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                  </div>

                  {/* Show changes indicator */}
                  {isEditing && hasProfileChanges() && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      У вас есть несохраненные изменения
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid my-5 grid-cols-1 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Добавлено оборудования:
                      </span>
                      <span className="font-semibold text-card-foreground">
                        127
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Создано договоров:
                      </span>
                      <span className="font-semibold text-card-foreground">
                        23
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Последний вход:
                      </span>
                      <span className="font-semibold text-card-foreground">
                        Сегодня
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
