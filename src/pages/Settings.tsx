"use client"

import type React from "react"

// src/pages/Settings.tsx - Complete dark mode and user profile
import { LogoIcon } from "@/assets/Icons/LogoIcon"
import Layout from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/api/userApi"
import { Loader2, User, Mail, Phone, Edit2, Save, X } from "lucide-react"

type Theme = "light" | "dark" | "system"

interface UserProfile {
  id: number
  username: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  profile_picture: string | null
  role: string
}

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light")
  const [currentFont, setCurrentFont] = useState("SF Pro Display")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({})

  // API hooks
  const { data: userProfile, isLoading: profileLoading, refetch } = useGetUserProfileQuery()
  const [updateProfile, { isLoading: updateLoading }] = useUpdateUserProfileMutation()

  // Load profile data
  useEffect(() => {
    if (userProfile) {
      setProfileForm(userProfile)
    }
  }, [userProfile])

  // Theme and font effects
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedFont = localStorage.getItem("font") || "SF Pro Display"
    if (savedTheme) setTheme(savedTheme)
    setCurrentFont(savedFont)
    applyTheme(savedTheme || "light")
    applyFont(savedFont)
  }, [])

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement
    root.classList.remove("dark")

    if (selectedTheme === "dark") {
      root.classList.add("dark")
    } else if (selectedTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      }
    }
  }

  const applyFont = (fontName: string) => {
    document.body.style.fontFamily = `"${fontName}", sans-serif`
    const existingFontStyle = document.getElementById("dynamic-font-style")
    if (existingFontStyle) {
      existingFontStyle.remove()
    }

    const style = document.createElement("style")
    style.textContent = `* { font-family: "${fontName}", sans-serif !important; }`
    style.id = "dynamic-font-style"
    document.head.appendChild(style)
  }

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme)
    localStorage.setItem("theme", selectedTheme)
    applyTheme(selectedTheme)
    toast.success(
      `Тема изменена на ${selectedTheme === "light" ? "светлую" : selectedTheme === "dark" ? "тёмную" : "системную"}`,
    )
  }

  const handleFontChange = (fontName: string) => {
    setCurrentFont(fontName)
    localStorage.setItem("font", fontName)
    applyFont(fontName)
    toast.success(`Шрифт изменен на ${fontName}`)
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileForm).unwrap()
      toast.success("Профиль успешно обновлен!")
      setIsEditingProfile(false)
      refetch()
    } catch (error) {
      toast.error("Ошибка при обновлении профиля")
      console.error("Profile update error:", error)
    }
  }

  const handleCancelEdit = () => {
    setProfileForm(userProfile || {})
    setIsEditingProfile(false)
  }

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Загрузка профиля...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background p-6">
        {/* User Profile Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Профиль пользователя</h2>
            {!isEditingProfile ? (
              <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Редактировать
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={updateLoading}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Сохранить
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="gap-2">
                  <X className="w-4 h-4" />
                  Отмена
                </Button>
              </div>
            )}
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  {userProfile?.first_name} {userProfile?.last_name}
                </h3>
                <p className="text-muted-foreground">@{userProfile?.username}</p>
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mt-1">
                  {userProfile?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-card-foreground">
                  Имя
                </Label>
                <Input
                  id="first_name"
                  value={profileForm.first_name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-card-foreground">
                  Фамилия
                </Label>
                <Input
                  id="last_name"
                  value={profileForm.last_name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  disabled={!isEditingProfile}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={!isEditingProfile}
                    className="mt-1 pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone_number" className="text-card-foreground">
                  Телефон
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone_number"
                    value={profileForm.phone_number || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                    disabled={!isEditingProfile}
                    className="mt-1 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Mode Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-foreground">Цветовой режим</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Light Theme Card */}
            <div
              className={`border border-border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md bg-white ${
                theme === "light" ? "ring-2 ring-primary" : ""
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
              className={`border border-border relative rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${
                theme === "system" ? "ring-2 ring-primary" : ""
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
              className={`border border-border rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] text-white cursor-pointer transition-all hover:shadow-md ${
                theme === "dark" ? "ring-2 ring-primary" : ""
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
          <h2 className="text-lg font-medium mb-4 text-foreground">Шрифт</h2>
          <div className="grid grid-cols-3 gap-4">
            {["SF Pro Display", "Inter", "Roboto"].map((font) => (
              <Button
                key={font}
                variant={currentFont === font ? "default" : "outline"}
                onClick={() => handleFontChange(font)}
                className={`h-12 text-lg font-medium flex items-center justify-center gap-2 ${
                  currentFont === font
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span className="text-2xl">Aa</span> {font}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Текущий шрифт: {currentFont}</p>
        </div>
      </div>
    </Layout>
  )
}

export default SettingsPage
