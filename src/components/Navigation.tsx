
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, PieChart, LineChart, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />
    },
    {
      name: "Cap Table",
      path: "/cap-table",
      icon: <PieChart className="h-5 w-5" />
    },
    {
      name: "Deal Builder",
      path: "/deal-builder",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      name: "Documents",
      path: "/documents",
      icon: <FileText className="h-5 w-5" />
    }
  ];
  
  return (
    <nav className="p-4 bg-slate-900 border-r border-slate-800 h-screen w-64 fixed left-0 top-0">
      <div className="flex items-center space-x-2 mb-8 pl-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="font-heading font-bold text-white">G</span>
        </div>
        <h1 className="text-xl font-heading font-bold">GFO</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">AI CFO</span>
      </div>
      
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors duration-150",
                location.pathname === item.path 
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
              {location.pathname === item.path && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="absolute bottom-8 left-4 right-4">
        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium">SU</span>
            </div>
            <div>
              <p className="text-sm font-medium">StartupName</p>
              <p className="text-xs text-slate-400">Pre-Seed</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
