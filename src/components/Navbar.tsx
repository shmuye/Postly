import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, PenSquare, Users, PlusCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserMenu, { UserMenuMobile } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/create", label: "Create Post", icon: PenSquare, auth: true },
  { to: "/communities", label: "Communities", icon: Users, auth: true },
  { to: "/community/create", label: "Create Community", icon: PlusCircle, auth: true },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const links = navLinks.filter((link) => !link.auth || user);

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        location.pathname === to
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          Post<span className="text-primary">ly</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} label={link.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <Separator className="my-4" />
            <div className="px-4">
              {user ? (
                <UserMenuMobile user={user} onNavigate={() => setMenuOpen(false)} />
              ) : (
                <Button asChild className="w-full" onClick={() => setMenuOpen(false)}>
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
