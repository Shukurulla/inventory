// src/pages/Settings.tsx
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    const savedFont = localStorage.getItem("font") || "SF Pro Display";
    setTheme(savedTheme);
    setCurrentFont(savedFont);
    applyTheme(savedTheme);
    applyFont(savedFont);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else if (selectedTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const applyFont = (fontName: string) => {
    document.documentElement.style.fontFamily = `"${fontName}", sans-serif`;
  };

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    applyTheme(selectedTheme);
  };

  const handleFontChange = (fontName: string) => {
    setCurrentFont(fontName);
    localStorage.setItem("font", fontName);
    applyFont(fontName);
  };

  const handleProfileSave = () => {
    // API call to save profile data
    console.log("Saving profile:", profileData);
    setIsEditing(false);
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
              <h2 className="text-lg font-medium mb-4">Цветовой режим</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Light Theme Card */}
                <div
                  className={`border border-border bg-white rounded-lg p-4 flex flex-col items-center justify-center text-black cursor-pointer transition-all ${
                    theme === "light" ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="flex items-center gap-2">
                    <LogoIcon width={25} />
                    <span className="font-medium">iMaster</span>
                  </div>
                  <span className="text-muted-foreground text-sm">Светлый</span>
                </div>

                {/* System Theme Card */}
                <div
                  className={`border border-zinc-200 dark:border-zinc-700 relative rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
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
                  <span className="text-gray-600 text-sm">Системный</span>
                </div>

                {/* Dark Theme Card */}
                <div
                  className={`border border-border rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] text-white cursor-pointer transition-all ${
                    theme === "dark" ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => handleThemeChange("dark")}
                >
                  <div className="flex items-center gap-2">
                    <LogoIcon width={25} color="#fff" />
                    <span className="font-medium">iMaster</span>
                  </div>
                  <span className="text-gray-400 text-sm">Тёмный</span>
                </div>
              </div>
            </div>

            {/* Font Section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Шрифт</h2>
              <div className="grid grid-cols-3 gap-4">
                {["SF Pro Display", "Inter", "Roboto"].map((font) => (
                  <Button
                    key={font}
                    variant={currentFont === font ? "default" : "outline"}
                    onClick={() => handleFontChange(font)}
                    className={`border-border rounded-md h-12 text-lg font-medium flex items-center justify-center gap-2 ${
                      currentFont === font ? "bg-indigo-600 text-white" : ""
                    }`}
                  >
                    <span className="text-2xl">Aa</span> {font}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-4xl">
              {/* Profile Header */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Информация профиля</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() =>
                      isEditing ? handleProfileSave() : setIsEditing(true)
                    }
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? "Сохранить" : "Редактировать"}
                  </Button>
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
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Имя пользователя</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            username: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Должность</Label>
                      <Input
                        id="position"
                        value={profileData.position}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            position: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Отдел</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            department: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Дата приема</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={profileData.joinDate}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            joinDate: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid my-5 grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Добавлено оборудования:
                      </span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Создано договоров:
                      </span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Последний вход:
                      </span>
                      <span className="font-semibold">Сегодня</span>
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
