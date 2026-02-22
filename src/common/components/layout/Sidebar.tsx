import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { SIDEBAR_ITEMS, SidebarItem } from "@common/constants/sidebar";
import { cn } from "@common/utils/cn";
import { ScrollArea } from "@common/components/ui/scroll-area";
import { Button } from "@common/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@common/components/ui/sheet";

/** Recursive sidebar link component */
const SidebarLink = ({ item, depth = 0 }: { item: SidebarItem; depth?: number }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (permission === "superadmin_only") return user?.role === "SuperAdmin";
    if (user?.role === "SuperAdmin") return true;
    if (user?.role === "OrgAdmin") return true;
    return user?.permissions?.includes(permission) || false;
  };

  if (item.permission && !hasPermission(item.permission)) {
    return null;
  }

  // Has sub-items
  if (item.subItems && item.subItems.length > 0) {
    const filteredSubItems = item.subItems.filter(
      (sub) => !sub.permission || hasPermission(sub.permission)
    );
    if (filteredSubItems.length === 0) return null;

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
            depth > 0 && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {filteredSubItems.map((subItem, index) => (
              <SidebarLink key={index} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Simple link
  if (item.to) {
    const isActive = location.pathname === item.to;
    return (
      <Link
        to={item.to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        )}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span>{item.label}</span>
      </Link>
    );
  }

  return null;
};

/** Desktop sidebar */
const SidebarContent = () => {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">NexaPos</h1>
        <p className="text-xs text-muted-foreground">Point of Sale System</p>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item, index) => (
            <SidebarLink key={index} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

/** Desktop sidebar (fixed) */
export const Sidebar = () => {
  return (
    <aside className="hidden md:flex">
      <SidebarContent />
    </aside>
  );
};

/** Mobile sidebar (sheet) */
export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
};
