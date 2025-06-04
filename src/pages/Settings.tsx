// src/pages/Settings.tsx
import { LogoIcon } from "@/assets/Icons/LogoIcon";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Upload, Trash2, Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserStatsQuery,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  type UserProfileUpdate,
} from "@/api/userApi";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

type Theme = "light" | "dark" | "system";

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentFont, setCurrentFont] = useState("SF Pro Display");

  // API hooks
  const {
    data: userProfile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();
  const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [_, { isLoading: isUploading }] = useUploadProfilePictureMutation();
  const [deletePicture, { isLoading: isDeleting }] =
    useDeleteProfilePictureMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Profile form state
  const [profileData, setProfileData] = useState<UserProfileUpdate>({});
  const [originalProfileData, setOriginalProfileData] =
    useState<UserProfileUpdate>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Load profile data when received from API
  useEffect(() => {
    if (userProfile) {
      const formattedData: UserProfileUpdate = {
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        phone_number: userProfile.phone_number,
        position: userProfile.position,
        department: userProfile.department,
      };
      setProfileData(formattedData);
      setOriginalProfileData(formattedData);
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
    document.body.style.fontFamily = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

    const existingFontStyle = document.getElementById("dynamic-font-style");
    if (existingFontStyle) {
      existingFontStyle.remove();
    }

    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: "${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif !important;
      }
    `;
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
      const updateData: UserProfileUpdate = { ...profileData };

      if (newProfilePicture) {
        updateData.profile_picture = newProfilePicture;
      }

      await updateProfile(updateData).unwrap();

      setOriginalProfileData({ ...profileData });
      setIsEditing(false);
      setNewProfilePicture(null);
      toast.success("Профиль успешно обновлен!");
      await refetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      errorValidatingWithToast(error);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({ ...originalProfileData });
    setIsEditing(false);
    setNewProfilePicture(null);
    toast.info("Изменения отменены");
  };

  const handleInputChange = (field: keyof UserProfileUpdate, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePictureDelete = async () => {
    try {
      await deletePicture().unwrap();
      toast.success("Фото профиля удалено!");
      await refetchProfile();
    } catch (error) {
      console.error("Error deleting picture:", error);
      errorValidatingWithToast(error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Новые пароли не совпадают");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Новый пароль должен содержать минимум 8 символов");
      return;
    }

    try {
      await changePassword(passwordData).unwrap();
      toast.success("Пароль успешно изменен!");
      setShowPasswordModal(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      errorValidatingWithToast(error);
    }
  };

  const hasProfileChanges = () => {
    return (
      JSON.stringify(profileData) !== JSON.stringify(originalProfileData) ||
      newProfilePicture !== null
    );
  };

  const getInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.first_name?.charAt(0) || ""}${
      userProfile.last_name?.charAt(0) || ""
    }`;
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return "Никогда";
    const loginDate = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return "Сегодня";
    } else if (diffInHours < 48) {
      return "Вчера";
    } else {
      return loginDate.toLocaleDateString("ru-RU");
    }
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
                  className={`border border-border bg-white rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
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
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Изменить пароль
                    </Button>
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
                      disabled={
                        (isEditing && !hasProfileChanges()) || isUpdating
                      }
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                      {isUpdating
                        ? "Сохранение..."
                        : isEditing
                        ? "Сохранить"
                        : "Редактировать"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {userProfile?.profile_picture ? (
                        <img
                          src={userProfile.profile_picture}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-2xl">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) {
                                setNewProfilePicture(file);
                              }
                            };
                            input.click();
                          }}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Загрузить фото
                        </Button>
                        {userProfile?.profile_picture && (
                          <Button
                            variant="outline"
                            onClick={handleProfilePictureDelete}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Удалить
                          </Button>
                        )}
                      </div>
                    )}
                    {newProfilePicture && (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Новое фото: {newProfilePicture.name}
                      </div>
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
                        value={profileData.first_name || ""}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
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
                        value={profileData.last_name || ""}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
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
                        value={userProfile?.username || ""}
                        disabled={true}
                        className="h-12 bg-background text-foreground border-border opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-card-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email || ""}
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
                        value={profileData.phone_number || ""}
                        onChange={(e) =>
                          handleInputChange("phone_number", e.target.value)
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
                        value={profileData.position || ""}
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
                        value={profileData.department || ""}
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
                        value={
                          userProfile
                            ? formatJoinDate(userProfile.date_joined)
                            : ""
                        }
                        disabled={true}
                        className="h-12 bg-background text-foreground border-border opacity-50"
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

              {/* Statistics */}
              <div className="grid my-5 grid-cols-1 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {statsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Загрузка статистики...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Добавлено оборудования:
                          </span>
                          <span className="font-semibold text-card-foreground">
                            {userStats?.equipment_added || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Создано договоров:
                          </span>
                          <span className="font-semibold text-card-foreground">
                            {userStats?.contracts_created || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Общее количество действий:
                          </span>
                          <span className="font-semibold text-card-foreground">
                            {userStats?.total_actions || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Последний вход:
                          </span>
                          <span className="font-semibold text-card-foreground">
                            {formatLastLogin(userProfile?.last_login)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Password Change Modal */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent className="w-[40%]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Изменить пароль
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Текущий пароль</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Подтвердите новый пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  className="h-12"
                />
              </div>
              {passwordData.new_password &&
                passwordData.confirm_password &&
                passwordData.new_password !== passwordData.confirm_password && (
                  <div className="text-sm text-red-600">
                    Пароли не совпадают
                  </div>
                )}
              {passwordData.new_password &&
                passwordData.new_password.length < 8 && (
                  <div className="text-sm text-red-600">
                    Пароль должен содержать минимум 8 символов
                  </div>
                )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    old_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                }}
                disabled={isChangingPassword}
              >
                Отменить
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={
                  !passwordData.old_password ||
                  !passwordData.new_password ||
                  !passwordData.confirm_password ||
                  passwordData.new_password !== passwordData.confirm_password ||
                  passwordData.new_password.length < 8 ||
                  isChangingPassword
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Изменение...
                  </>
                ) : (
                  "Изменить пароль"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SettingsPage;
