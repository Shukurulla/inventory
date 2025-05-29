import { LogoIcon } from '@/assets/Icons/LogoIcon';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const SettingsPage: React.FC = () => {
    const [isDark, setIsDark] = useState<boolean | 'system'>(false);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        if(isDark == 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches){
            root.classList.add('dark');
        }else if(isDark == 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches){
            root.classList.remove('dark');
        }
    }, [isDark]);

    const handleFontChange = (fontName: string) => {
        document.documentElement.style.fontFamily = fontName;
    };
  return (
    <Layout>
        <div className="min-h-screen bg-background text-foreground p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Настройки</h1>
            <div className="flex items-center gap-3">
            <div className="relative">
                <Input
                placeholder="Поиск"
                className="pl-10 w-64 bg-card text-card-foreground border-border rounded-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="outline" className="border-border rounded-md">
                Ручное добавление
            </Button>
            </div>
        </div>

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
        </Tabs>

        {/* Color Mode Section */}
        <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Цветовой режим</h2>
            <div className="grid grid-cols-3 gap-4">
            {/* Light Theme Card */}
            <div className="border border-border bg-white rounded-lg p-4 flex flex-col items-center justify-center text-black" onClick={()=> setIsDark(false)}>
                <div className="flex items-center gap-2">
                    <LogoIcon width={25}/>
                    <span className="font-medium">iMaster</span>
                </div>
                <span className="text-muted-foreground text-sm">Светлый</span>
            </div>
            {/* System Theme Card */}
            <div
                className="border border-zinc-200 dark:border-zinc-700 relative w-full rounded-lg p-4 flex flex-col items-center justify-between bg-gradient-to-r from-white to-[#1A1A1A] from-46% to-46%"
                onClick={() => setIsDark('system')}
                >
                <div className="flex items-center gap-2 text-black">
                    <LogoIcon width={25} />
                    <span className="font-medium text-white">iMaster</span>
                </div>
                <span className="text-gray-400 text-sm pr-4">Системный</span>
            </div>
            {/* Dark Theme Card */}
            <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center bg-[#1A1A1A] text-white" onClick={()=> setIsDark(true)}>
                <div className="flex items-center gap-2">
                    <LogoIcon width={25} color='#fff'/>
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
            <Button
                variant="outline"
                onClick={() => handleFontChange('SF Pro Display')}
                className="border-border rounded-md h-12 text-lg font-medium flex items-center justify-center gap-2"
            >
                <span className="text-2xl">Aa</span> SF Pro Display
            </Button>
            <Button
                variant="outline"
                onClick={() => handleFontChange('Inter')}
                className="border-border rounded-md h-12 text-lg font-medium flex items-center justify-center gap-2"
            >
                <span className="text-2xl">Aa</span> Inter
            </Button>
            <Button
                variant="outline"
                onClick={() => handleFontChange('Roboto')}
                className="border-border rounded-md h-12 text-lg font-medium flex items-center justify-center gap-2"
            >
                <span className="text-2xl">Aa</span> Roboto
            </Button>
            </div>
        </div>
        </div>
    </Layout>
  );
};

export default SettingsPage;