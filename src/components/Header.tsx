// src/components/Header.tsx
import { useState } from "react";
import { Input } from "./ui/input";
import { Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { Tequipment } from "@/types";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tequipment[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://invenmaster.pythonanywhere.com/inventory/equipment/?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setIsSearchOpen(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <header className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-accent-foreground">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          {/* INN Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Поиск по ИНН..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </form>

          {children}
        </div>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Результаты поиска по ИНН: {searchQuery}</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Оборудование с ИНН "{searchQuery}" не найдено
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">ИНН: {item.uid}</p>
                        <p className="text-sm text-gray-600">
                          Комната: {item.room_data?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Статус:{" "}
                          {item.status === "NEW"
                            ? "Новое"
                            : item.status === "WORKING"
                            ? "Рабочее"
                            : item.status === "NEEDS_REPAIR"
                            ? "Требуется ремонт"
                            : "Утилизировано"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {item.type_data?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
