import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthComponent() {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }

      navigate("/");
    } catch {
      alert("Authentication failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">

      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-xl p-8 shadow-xl">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-white/20 bg-transparent text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-white/20 bg-transparent text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 transition text-white p-3 rounded-md font-medium"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="bg-red-500 hover:bg-red-600 transition text-white p-3 rounded-md font-medium"
          >
            Continue with Google
          </button>

        </form>

        <div className="flex items-center gap-3 my-6 text-gray-400">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          onClick={signInWithGithub}
          className="w-full bg-black hover:bg-gray-800 transition text-white p-3 rounded-md font-medium"
        >
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            className="ml-2 text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

      </div>

    </div>
  );
}