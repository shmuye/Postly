import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";

export default function AuthComponent() {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerificationMessage("");

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        navigate("/");
      } else {
        await signUpWithEmail(email, password);
        setPassword("");
        setIsLogin(true);
        const message = `We sent a verification link to ${email}. Please verify your email before signing in.`;
        setVerificationMessage(message);
        toast.success("Check your email", {
          description: "Verify your email address before signing in.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message.toLowerCase().includes("email not confirmed")
          ? "Please verify your email before signing in."
          : "Authentication failed";
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to share posts and join communities"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {verificationMessage && (
            <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-muted-foreground">{verificationMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={signInWithGithub}
          >
            <Github className="size-4" />
            Continue with GitHub
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="px-1"
              onClick={() => {
                setIsLogin(!isLogin);
                setVerificationMessage("");
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
