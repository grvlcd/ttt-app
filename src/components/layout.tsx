import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

const Layout: React.FunctionComponent = () => {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
