import Layout from "@/components/layout";
// import { InventoryTable } from "@/components/InventoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { inventoryItems } from "@/data/inventory";
import Addeds from "./Addeds";
import { UniversityTable } from "@/components/universityTableNew";
import { Templates } from "./Characteristics";

export default function MainPage() {
  return (
    <Layout>
      <>
        <header className="p-6">
          <h1 className="text-3xl font-semibold">Главная страница</h1>
        </header>
        <main className="flex-1 flex">
          <div className="flex-1 p-6">
            <Tabs defaultValue="university">
              <TabsList className="mb-6">
                {/* <TabsTrigger value="inventory">Инвентарь</TabsTrigger> */}
                <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
                <TabsTrigger value="added">Добавленные</TabsTrigger>
                <TabsTrigger value="university">Университет</TabsTrigger>
              </TabsList>
              {/* <TabsContent value="inventory">
                        <InventoryTable items={inventoryItems} />
                    </TabsContent> */}
              <TabsContent value="inventory">
                <Templates />
              </TabsContent>
              <TabsContent value="added">
                <Addeds />
              </TabsContent>
              <TabsContent value="university">
                <UniversityTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </>
    </Layout>
  );
}
