import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { getDisplayName, getInitials } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: SupabaseUser;
  onNavigate?: () => void;
}

const UserMenu = ({ user, onNavigate }: UserMenuProps) => {
  const { signOut } = useAuth();
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  const handleSignOut = () => {
    signOut();
    onNavigate?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar size="sm">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-sm text-muted-foreground">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" onClick={onNavigate}>
            <User />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserMenuMobile = ({ user, onNavigate }: UserMenuProps) => {
  const { signOut } = useAuth();
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{displayName}</span>
      </div>
      <Button asChild variant="outline" className="w-full" onClick={onNavigate}>
        <Link to="/profile">
          <User className="size-4" />
          Profile
        </Link>
      </Button>
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
      >
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserMenu;
