import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase-client";
import {
  formatDate,
  getAuthProviders,
  getDisplayName,
  getInitials,
} from "@/lib/user";
import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";

interface UserStats {
  posts: number;
  comments: number;
  votes: number;
}

const fetchUserStats = async (userId: string): Promise<UserStats> => {
  const [postsResult, commentsResult, votesResult] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("comment").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("votes").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  if (postsResult.error) throw postsResult.error;
  if (commentsResult.error) throw commentsResult.error;
  if (votesResult.error) throw votesResult.error;

  return {
    posts: postsResult.count ?? 0,
    comments: commentsResult.count ?? 0,
    votes: votesResult.count ?? 0,
  };
};

const Profile = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: () => fetchUserStats(user!.id),
    enabled: !!user,
  });

  const { mutate: handleDeleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Your account has been deleted");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  if (!user) return <Loader />;

  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);
  const providers = getAuthProviders(user);
  const isEmailVerified = !!user.email_confirmed_at;

  const activityItems = [
    { label: "Posts", value: stats?.posts ?? 0, icon: FileText },
    { label: "Comments", value: stats?.comments ?? 0, icon: MessageSquare },
    { label: "Votes", value: stats?.votes ?? 0, icon: ThumbsUp },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your account and view your activity"
      />

      <div className="mx-auto grid max-w-4xl gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="size-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <Badge key={provider} variant="secondary" className="capitalize">
                  {provider}
                </Badge>
              ))}
              <Badge
                variant={isEmailVerified ? "secondary" : "outline"}
                className="gap-1"
              >
                {isEmailVerified ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="size-3.5 text-amber-500" />
                )}
                {isEmailVerified ? "Email verified" : "Email not verified"}
              </Badge>
            </div>

            <Separator />

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Member since
                </dt>
                <dd className="text-sm font-medium">{formatDate(user.created_at)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Last sign in
                </dt>
                <dd className="text-sm font-medium">{formatDate(user.last_sign_in_at)}</dd>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Shield className="size-3.5" />
                  User ID
                </dt>
                <dd className="break-all font-mono text-xs text-muted-foreground">{user.id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Your contributions on Postly</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {activityItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your posts, comments, votes, and account. You will not be able to recover any of this data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => handleDeleteAccount()}
            >
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
