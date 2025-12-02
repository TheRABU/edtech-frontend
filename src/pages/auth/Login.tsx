import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import {
  useRegisterMutation,
  useLoginMutation,
} from "@/redux/features/auth/auth.api";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiError {
  data?: {
    message?: string;
    error?: string;
  };
  status?: number;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [
    register,
    {
      isLoading: isRegistering,
      error: registerError,
      isSuccess: isRegisterSuccess,
    },
  ] = useRegisterMutation();
  const [
    login,
    { isLoading: isLoggingIn, error: loginError, isSuccess: isLoginSuccess },
  ] = useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (): boolean => {
    return formData.password === formData.confirmPassword;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  // api errors
  useEffect(() => {
    const error = loginError || registerError;
    if (error) {
      const apiError = error as ApiError;
      if (apiError.data?.message) {
        setErrorMessage(apiError.data.message);
      } else if (apiError.data?.error) {
        setErrorMessage(apiError.data.error);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  }, [loginError, registerError]);

  // success actions
  useEffect(() => {
    if (isRegisterSuccess) {
      setSuccessMessage("Registration successful! You can now log in.");

      setTimeout(() => {
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setSuccessMessage("");
      }, 3000);
    }

    if (isLoginSuccess) {
      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [isRegisterSuccess, isLoginSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // client side validation
    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        setErrorMessage("Please enter your name");
        return;
      }

      if (!validateConfirmPassword()) {
        setErrorMessage("Passwords do not match");
        return;
      }
    }

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        //   } else {
        //     await register({
        //       name: formData.name,
        //       email: formData.email,
        //       password: formData.password,
        //     }).unwrap();
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const isSubmitDisabled = (): boolean => {
    if (isLoading) return true;

    if (!formData.email || !validateEmail(formData.email)) return true;
    if (!formData.password || !validatePassword(formData.password)) return true;

    if (!isLogin) {
      if (!formData.name.trim()) return true;
      if (!formData.confirmPassword || !validateConfirmPassword()) return true;
    }

    return false;
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
    setSuccessMessage("");
    if (isLogin) {
      setFormData((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="min-h-screen flex">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  {isLogin ? (
                    <LogIn className="w-8 h-8 text-red-600" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLogin ? "Welcome Back!" : "Create Account"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isLogin
                    ? "Please sign in to continue"
                    : "Get started with your account"}
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors pr-10 disabled:bg-gray-50"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                    <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="text-sm text-red-600">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors pr-10 disabled:bg-gray-50"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formData.password &&
                    !validatePassword(formData.password) && (
                      <p className="text-sm text-red-600">
                        Password must be at least 8 characters
                      </p>
                    )}
                </div>

                {/* Confirm Password Field (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors pr-10 disabled:bg-gray-50"
                        placeholder="••••••••"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        tabIndex={-1}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword && !validateConfirmPassword() && (
                      <p className="text-sm text-red-600">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled()}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </span>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Form Switch */}
                <p className="text-center text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    className="ml-1 text-red-600 hover:text-red-700 font-semibold focus:outline-none disabled:opacity-50"
                    onClick={handleModeSwitch}
                    disabled={isLoading}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=1022&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          />
          <div className="relative z-10 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-12 max-w-2xl">
              <h2 className="text-4xl font-bold mb-6">Unlock Your Potential</h2>
              <p className="text-xl">
                Join thousands of learners who are transforming their careers
                with our comprehensive courses and expert guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
