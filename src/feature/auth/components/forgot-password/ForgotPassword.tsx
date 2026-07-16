import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  FolderOpenDot,
  CheckCircle2,
} from "lucide-react";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../apis/auth-api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Email is invalid" });
      return;
    }

    try {
      const response = await forgotPassword({ email: formData.email }).unwrap();
      setMessage(response.message || "OTP sent to your email");
      setStep("otp");
      setErrors({});
    } catch {
      setErrors({ email: "Failed to send OTP. Please try again." });
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }).unwrap();

      setMessage(response.message || "Password reset successful");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      setErrors({ otp: "Invalid OTP or failed to reset password" });
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] font-sans bg-gray-100">
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
            Forgot your password?
            <br />
            <em className="italic text-yellow-300">No worries,</em> we'll fix
            it.
          </h1>
          <p className="mt-4 max-w-sm text-white/60">
            Enter your email and we'll send you an OTP to reset your password
            securely.
          </p>

          {/* Signature element */}
          <div className="relative mt-10 h-[210px] w-full max-w-sm">
            <div className="absolute left-0 top-9 h-[150px] w-[78%] -rotate-[4deg] rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="absolute left-[8%] top-6 h-[160px] w-[82%] rotate-[2deg] rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="absolute left-4 top-1.5 w-[86%] rounded-lg border border-yellow-500/30 bg-white p-5 text-gray-900 shadow-lg">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">
                <CheckCircle2 className="h-3 w-3" /> Password reset
              </span>
              <div className="mt-3 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-gray-600">
                  New password saved
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
                <div className="h-2 w-2 rounded-full bg-green-300" />
                <span className="text-xs font-medium text-gray-600">
                  Account secured
                </span>
              </div>
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
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-yellow-700">
              {step === "email" ? "Reset password" : "Enter OTP"}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              {step === "email" ? "Forgot password?" : "Verify OTP"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === "email"
                ? "Enter your email to receive a reset code"
                : "Enter the OTP sent to your email"}
            </p>
          </div>

          {message && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
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
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-[3px] focus:ring-yellow-200"
                    placeholder="you@university.edu"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isForgotLoading}
                className="w-full rounded-lg bg-yellow-500 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isForgotLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-sm font-semibold text-gray-900"
                >
                  OTP
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={(e) => {
                      setFormData({ ...formData, otp: e.target.value });
                      setErrors({ ...errors, otp: "" });
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-[3px] focus:ring-yellow-200"
                    placeholder="Enter OTP"
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-1.5 block text-sm font-semibold text-gray-900"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-gray-400" />
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, newPassword: e.target.value });
                      setErrors({ ...errors, newPassword: "" });
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-[3px] focus:ring-yellow-200"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetLoading}
                className="w-full rounded-lg bg-yellow-500 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isResetLoading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
              >
                Back to email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
