import { MainPage } from "@/pages/main/MainPage.tsx";
import { SideMenu } from "@/SideMenu.tsx";

export const Layout = () => {
  return (
    <div className="grid min-h-full grid-cols-[12rem_calc(100%-12rem)]">
      <SideMenu />
      <MainPage />
    </div>
  );
};
