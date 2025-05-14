
import { ReactNode } from "react";
import Navigation from "./Navigation";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 pl-64">
        <div className="container py-8 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
