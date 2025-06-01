import { useGetEquipmentTypesQuery } from "@/api/universityApi";
import CharItem from "@/components/CharacteristicsItem";
import CharForm from "@/components/charForm";
import Layout from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Addeds from "./Addeds";

export const Characteristics = () => {
  return (
    <Layout>
      <>
        <header className="p-6">
          <h1 className="text-3xl font-semibold">Главная страница</h1>
        </header>
        <main className="flex-1 flex">
          <div className="flex-1 p-6">
            <Tabs defaultValue="templates">
              <TabsList className="mb-6">
                <TabsTrigger value="templates">Шаблоны</TabsTrigger>
                <TabsTrigger value="added">Добавленные</TabsTrigger>
              </TabsList>
              {/* <TabsContent value="inventory">
                <InventoryTable items={inventoryItems} />
            </TabsContent> */}
              <TabsContent value="templates">
                <Templates />
              </TabsContent>
              <TabsContent value="added">
                <Addeds />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </>
    </Layout>
  );
};

export const Templates = () => {
  const { data: getEquipmentTypes } = useGetEquipmentTypesQuery();
  // const [onOpenChange, setOnOpenChange] = useState<boolean>(false)
  const [formVisible, setFormVisible] = useState(false);
  const [stepFormData, setStepFormData] = useState({
    name: "",
    id: 0,
  });

  return (
    <div aria-describedby="">
      <div className="border-2 rounded-xl overflow-hidden">
        <div className="flex flex-row items-center p-4 border-b-2 bg-white z-10">
          <div className="flex items-center gap-2 text-xl font-medium w-full">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              </div>
              Элемент инвентаря
            </div>
            <div className="flex-1 text-center">
              <p>Наличие шаблонов</p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
        <div>
          {getEquipmentTypes?.map((item) => (
            <CharItem
              key={item.name}
              item={item}
              setStepFormData={setStepFormData}
              onPlusClick={() => setFormVisible(true)}
            />
          ))}
        </div>
      </div>
      {formVisible && (
        <div>
          <CharForm stepFormData={stepFormData} onOpenChange={setFormVisible} />
        </div>
      )}
    </div>
  );
};
