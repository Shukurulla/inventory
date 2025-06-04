// src/pages/MainPage.tsx - University tabiga Inventory modal qo'shilgan
import { useState } from "react";
import Layout from "@/components/layout";
import { UniversityTable } from "@/components/universityTableNew";
import { StatusTable } from "@/components/StatusTable";
import { InventoryModal } from "@/components/InventoryModal";

type TabType = "status" | "university";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<TabType>("university");
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedRoomForInventory, setSelectedRoomForInventory] = useState<
    number | null
  >(null);

  const handleCreateInventory = (roomId: number) => {
    setSelectedRoomForInventory(roomId);
    setShowInventoryModal(true);
  };

  return (
    <Layout>
      <main className="flex-1 flex">
        <div className="flex-1 p-6">
          {/* Custom Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("status")}
                  className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                    activeTab === "status"
                      ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Состояние
                </button>
                <button
                  onClick={() => setActiveTab("university")}
                  className={`whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium ${
                    activeTab === "university"
                      ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Университет
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === "status" && <StatusTable />}
            {activeTab === "university" && (
              <>
                <UniversityTable onCreateInventory={handleCreateInventory} />

                {/* Inventory Modal */}
                <InventoryModal
                  open={showInventoryModal}
                  roomId={selectedRoomForInventory}
                  onOpenChange={(open) => {
                    setShowInventoryModal(open);
                    if (!open) {
                      setSelectedRoomForInventory(null);
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
