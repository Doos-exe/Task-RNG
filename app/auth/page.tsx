"use client";
/*
  This is the authentication page for users to sign in or sign up.
  It includes validation for email and password, and email verification flow.
*/

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { signin, signup, isAuthenticated } = useAuth();

  // Handle email verification callback
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setVerificationSuccess(true);
      setSuccessMessage("✅ Email verified successfully! You can now sign in.");
      // Clear the verified parameter from URL
      router.replace("/auth");
    }
  }, [searchParams, router]);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    // Better email validation that allows multiple dots in domain and local part
    const emailRegex = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!isLogin && !name) newErrors.name = "Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors({});

    try {
      if (isLogin) {
        const result = await signin(email, password);
        if (result.error) {
          if (result.error.includes("verify your email")) {
            setErrors({ submit: result.error });
            setPendingVerificationEmail(email);
            setShowResendVerification(true);
          } else {
            setErrors({ submit: result.error });
          }
        } else {
          setSuccessMessage("Logged in successfully!");
          // Wait a moment before redirecting
          setTimeout(() => router.push("/"), 500);
        }
      } else {
        const result = await signup(email, password, name);
        if (result.error) {
          setErrors({ submit: result.error });
        } else {
          setSuccessMessage(
            "Sign up successful! Please check your email to verify your account."
          );
          setPendingVerificationEmail(email);
          setEmail("");
          setPassword("");
          setName("");
        }
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (response.ok) {
        setResetMessage(
          "Password reset link sent to your email! Check your inbox."
        );
        setForgotEmail("");
      } else {
        const { error } = await response.json();
        setResetMessage(error || "Failed to send reset link");
      }
    } catch (error) {
      setResetMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail || pendingVerificationEmail }),
      });

      if (response.ok) {
        setResendMessage(
          "Verification email sent! Please check your inbox and spam folder."
        );
        setResendEmail("");
      } else {
        const { error } = await response.json();
        setResendMessage(error || "Failed to resend verification email");
      }
    } catch (error) {
      setResendMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-page flex items-center justify-center p-4 text-app-lightText dark:text-app-darkText">
      <div className="w-full max-w-lg">
        <div className="app-surface rounded-3xl p-6 shadow-2xl md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Welcome to the table</p><h1 className="page-title text-4xl">Task RNG</h1>
            <p className="page-subtitle mx-auto mt-3 text-sm">A playful decision desk for getting unstuck.</p>
          </div>

          {/* Resend Verification View */}
          {showResendVerification ? (
            <div>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                    📧 Email Verification Required
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Please verify your email to complete sign-up. We'll send you a verification link.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--app-ink)]">Email</label>
                  <input
                    type="email"
                    value={resendEmail || pendingVerificationEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="app-field w-full"
                  />
                </div>

                {resendMessage && (
                  <p
                    className={`text-sm p-3 rounded ${
                      resendMessage.includes("sent")
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
                    }`}
                  >
                    {resendMessage}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="app-button app-button-primary flex-1 disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Resend Verification Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResendVerification(false);
                      setResendMessage("");
                      setResendEmail("");
                    }}
                    className="app-button app-button-ghost flex-1"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          ) : showForgotPassword ? (
            <div>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--app-ink)]">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="app-field w-full"
                    required
                  />
                </div>

                {resetMessage && (
                  <p
                    className={`text-sm p-3 rounded ${
                      resetMessage.includes("sent")
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    {resetMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="app-button app-button-primary w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage("");
                  }}
                  className="w-full py-2 text-sm font-semibold text-[var(--app-accent)] transition hover:opacity-70"
                >
                  Back to Login
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="mb-6 flex gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-1">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 px-4 transition-colors ${
                    isLogin
                      ? "rounded-lg bg-[var(--app-ink)] text-[var(--app-surface-strong)] font-semibold shadow-sm"
                      : "text-[var(--app-muted)] hover:text-[var(--app-ink)]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 px-4 transition-colors ${
                    !isLogin
                      ? "rounded-lg bg-[var(--app-ink)] text-[var(--app-surface-strong)] font-semibold shadow-sm"
                      : "text-[var(--app-muted)] hover:text-[var(--app-ink)]"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm border ${
                  verificationSuccess
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                    : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
                }`}>
                  {successMessage}
                </div>
              )}

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm border border-red-200 dark:border-red-700">
                  {errors.submit}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[var(--app-ink)]">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`app-field w-full ${
                        errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--app-ink)]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`app-field w-full ${
                      errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--app-ink)]">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`app-field w-full ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="app-button app-button-primary mt-6 w-full disabled:opacity-50"
                >
                  {isSubmitting ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </button>

                {/* Forgot Password Link */}
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full py-2 text-sm font-semibold text-[var(--app-accent)] transition hover:opacity-70"
                  >
                    Forgot Password?
                  </button>
                )}
              </form>

              {/* Info Notice */}
              <div className="app-surface-flat mt-6 rounded-2xl p-4 text-sm">
                <p className="text-[var(--app-ink)]">
                  <strong>📧 Email Verification Required:</strong> After signing up, check your email to verify your account before you can sign in. If you didn't receive an email, click "Resend Verification Email" on the error screen.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
