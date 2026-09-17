"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { API_URL, apiFetch } from "@/lib/api";

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(formData: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Full name is required.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const phoneDigits = formData.phone.replace(/\D/g, "");
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    errors.phone = "Enter a valid phone number.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(formData.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(formData.password)) {
    errors.password = "Password must contain at least one number.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please retype your password.";
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function getPasswordStrength(password: string) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2)
    return {
      label: "Weak",
      color: "bg-red-400",
      width: "w-1/3",
      textColor: "text-red-500",
    };
  if (score <= 3)
    return {
      label: "Fair",
      color: "bg-yellow-400",
      width: "w-2/3",
      textColor: "text-yellow-600",
    };
  return {
    label: "Strong",
    color: "bg-green-500",
    width: "w-full",
    textColor: "text-green-600",
  };
}

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showStrength = false,
  matchValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  showStrength?: boolean;
  matchValue?: string;
}) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;
  const isMatch =
    matchValue !== undefined && value !== "" && value === matchValue;

  return (
    <div>
      <label className="block text-sm mb-1 text-gray-700">{label}</label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="text-gray-900 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeClosed size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value && strength && (
        <div className="mt-2">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
            />
          </div>
          <p className={`text-xs mt-1 ${strength.textColor}`}>
            Password strength: {strength.label}
          </p>
        </div>
      )}

      {isMatch && !error && (
        <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function Signup() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
    // Keep confirmPassword in sync when password changes
    if (field === "password" && touched["confirmPassword"]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: newErrors.confirmPassword,
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    setTouched({
      name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await apiFetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(
          data.message || "Registration failed. Please try again.",
        );
        return;
      }
      router.push("/student");
    } catch (err) {
      setServerError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <div className="w-full lg:w-1/2 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-6 py-4 sm:px-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-gray-900 font-semibold text-lg tracking-tight group-hover:text-brand-600 transition-colors">
                Praxes
              </span>
            </Link>

            <h1 className="text-2xl mb-1 text-gray-900">Create your account</h1>
            <p className="text-gray-600 text-sm mb-4">
              Start your learning journey today
            </p>

            {serverError && (
              <div className="mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Input
                    type="text"
                    label="Full Name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="text-gray-900"
                    required
                  />
                  {errors.name && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Input
                    type="tel"
                    label="Phone Number"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className="text-gray-900"
                    required
                  />
                  {errors.phone && (
                    <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className="text-gray-900"
                  required
                />
                {errors.email && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                showStrength
              />

              <PasswordInput
                label="Retype Password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                matchValue={formData.password}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button className="mt-3 w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-blue-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-4xl mb-4 text-gray-900">
              Join Thousands of Students
            </h2>
            <p className="text-xl text-gray-600">
              Excel in your exams with personalized practice and analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
