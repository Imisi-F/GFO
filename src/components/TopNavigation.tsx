
// This file will be kept for reference but is no longer used in the app
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const TopNavigation = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Cap Table", path: "/cap-table" },
    { name: "Deal Builder", path: "/deal-builder" },
    { name: "Documents", path: "/documents" },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link to={item.path}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
