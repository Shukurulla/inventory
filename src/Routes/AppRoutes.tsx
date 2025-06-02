import { useRoutes } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import Login from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute.tsx";
import ContractsPage from "@/pages/Contracts";
import { Characteristics } from "@/pages/Characteristics";
import SettingsPage from "@/pages/Settings";
import AddedEquipmentPage from "@/pages/AddedEquipmentsPage";

const AppRoutes = () => {
  const appRoutes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={[""]}>
          <MainPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/contracts",
      element: <ContractsPage />,
    },
    {
      path: "/characteristics",
      element: <Characteristics />,
    },
    {
      path: "/addeds",
      element: <AddedEquipmentPage />,
    },
    {
      path: "/settings",
      element: <SettingsPage />,
    },
    { path: "/login", element: <Login /> },
  ]);

  return appRoutes;
};

export default AppRoutes;
