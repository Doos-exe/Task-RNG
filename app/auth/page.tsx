"use client";
/*
  This is the authentication page for users to sign in or sign up.
  It includes validation for email and password, and email verification flow.
*/

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  const { signin, signup, isAuthenticated } = useAuth();

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
    <main className="min-h-screen bg-app-lightMain dark:bg-app-darkMain text-app-lightText dark:text-app-darkText flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-app-darkMain rounded-lg border border-gray-300 dark:border-gray-700 p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Task RNG</h1>
            <p className="text-gray-600 dark:text-gray-400">Let fate decide your tasks</p>
          </div>

          {/* Resend Verification View */}
          {showResendVerification ? (
            <div>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                    📧 Email Verification Required
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Please verify your email to complete sign-up. We'll send you a verification link.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    value={resendEmail || pendingVerificationEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
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
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
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
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
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
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage("");
                  }}
                  className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-2"
                >
                  Back to Login
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-300 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                    setSuccessMessage("");
                  }}
                  className={`flex-1 py-2 px-4 transition-colors ${
                    isLogin
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
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
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm border border-green-200 dark:border-green-700">
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
                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white ${
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
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white ${
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
                  <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white ${
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </button>

                {/* Forgot Password Link */}
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm py-2"
                  >
                    Forgot Password?
                  </button>
                )}
              </form>

              {/* Info Notice */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm border border-blue-200 dark:border-blue-700">
                <p className="text-gray-800 dark:text-gray-200">
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
