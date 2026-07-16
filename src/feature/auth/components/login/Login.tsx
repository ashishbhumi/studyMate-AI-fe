import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  FolderOpenDot,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useLoginMutation } from "../../apis/auth-api";
import { LOGIN } from "../../slices/auth-slice";
import { useAppDispatch } from "@/store/hooks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and password to continue.");
      return;
    }

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(LOGIN({ accessToken: response.data.accessToken, rememberMe }));
      navigate("/dashboard");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] font-sans bg-black">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gray-900 p-14 text-white">
        <div className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.12),transparent_50%)]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-yellow-500 shadow-lg">
            <FolderOpenDot className="h-5 w-5 text-gray-900" />
          </div>
          <span className="text-lg font-semibold tracking-wide">
            Study<span className="text-yellow-300">Mate</span> AI
          </span>
        </div>

        <div className="relative mt-8">
          <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">
            Every note, sorted.
            <br />
            <em className="italic text-yellow-300">Every chapter,</em>{" "}
            summarized.
          </h1>
          <p className="mt-4 max-w-sm text-white/60">
            Keep your notes in folders that make sense, then let AI turn a messy
            lecture into a clean summary in seconds.
          </p>

          {/* Signature element */}
          <div className="relative mt-10 h-[210px] w-full max-w-sm">
            <div className="absolute left-0 top-9 h-[150px] w-[78%] -rotate-[4deg] rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="absolute left-[8%] top-6 h-[160px] w-[82%] rotate-[2deg] rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="absolute left-4 top-1.5 w-[86%] rounded-lg border border-yellow-500/30 bg-white p-5 text-gray-900 shadow-lg">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-yellow-700">
                <Sparkles className="h-3 w-3" /> AI summary
              </span>
              <div className="mt-3 h-1.5 w-[92%] rounded bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-[length:200%_100%]" />
              <div className="mt-2 h-1.5 w-[74%] rounded bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-[length:200%_100%]" />
              <div className="mt-2 h-1.5 w-[83%] rounded bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-[length:200%_100%]" />
              <div className="mt-2 h-1.5 w-[55%] rounded bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-[length:200%_100%]" />
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/40">
          © 2026 StudyMate AI · Made for focused studying
        </p>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-yellow-700">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              Log in to StudyMate AI
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              New here?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-yellow-700 hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-900"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-[3px] focus:ring-yellow-200"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-900"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-[3px] focus:ring-yellow-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-[17px] w-[17px]" />
                  ) : (
                    <Eye className="h-[17px] w-[17px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 accent-yellow-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-semibold text-yellow-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-yellow-500 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z"
              />
              <path
                fill="#FF3D00"
                d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7Z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.4 0 10.3-1.9 14.1-5.2l-6.5-5.5C29.6 34.7 27 35.7 24 35.7c-5.3 0-9.7-3.1-11.3-7.7l-6.6 5.1C9.6 39.6 16.2 44 24 44Z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.5C41.5 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5Z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-xs text-gray-400">
            By continuing, you agree to StudyMate AI's Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
