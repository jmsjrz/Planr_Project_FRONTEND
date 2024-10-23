// src/components/layout/Header.tsx

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  breadcrumbs: { title: string; url: string }[];
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  isLeftSidebarOpen?: boolean;
  setIsLeftSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isRightSidebarOpen?: boolean;
  setIsRightSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  breadcrumbs,
  showLeftSidebar,
  showRightSidebar,
  isLeftSidebarOpen,
  setIsLeftSidebarOpen,
  isRightSidebarOpen,
  setIsRightSidebarOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center justify-between bg-background px-4">
      <div className="flex items-center space-x-4">
        {showLeftSidebar && setIsLeftSidebarOpen && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            >
              {isLeftSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center space-x-4">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Créer un Événement
        </Button>
        {showRightSidebar && setIsRightSidebarOpen && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            >
              {isRightSidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isRightSidebarOpen ? "Fermer" : "Ouvrir"} le panneau latéral
                droit
              </span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
