"use client";
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  KeyRound,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Employee {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface EmployeeForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface EditForm {
  name: string;
  phone: string;
  email: string;
  // password fields — optional, only submitted if user fills them
  newPassword: string;
  confirmNewPassword: string;
}

interface EmployeeFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface EditFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// ─── Password Input ───────────────────────────────────────────────────────────
function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  showStrength = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  showStrength?: boolean;
}) {
  const [show, setShow] = useState(false);

  const getStrength = () => {
    if (!value) return null;
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
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
  };

  const strength = showStrength ? getStrength() : null;

  return (
    <div>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateAddForm(form: EmployeeForm): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  const phoneDigits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  else if (phoneDigits.length < 10 || phoneDigits.length > 13)
    errors.phone = "Enter a valid phone number.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!emailRegex.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 8)
    errors.password = "Must be at least 8 characters.";
  else if (!/[A-Z]/.test(form.password))
    errors.password = "Must contain at least one uppercase letter.";
  else if (!/[0-9]/.test(form.password))
    errors.password = "Must contain at least one number.";
  else if (!/[^A-Za-z0-9]/.test(form.password))
    errors.password = "Must contain at least one special character.";
  if (!form.confirmPassword)
    errors.confirmPassword = "Please confirm the password.";
  else if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function validateEditForm(form: EditForm): EditFormErrors {
  const errors: EditFormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  const phoneDigits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  else if (phoneDigits.length < 10 || phoneDigits.length > 13)
    errors.phone = "Enter a valid phone number.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!emailRegex.test(form.email))
    errors.email = "Enter a valid email address.";

  // Password is optional — only validate if user has started typing
  if (form.newPassword) {
    if (form.newPassword.length < 8)
      errors.newPassword = "Must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.newPassword))
      errors.newPassword = "Must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(form.newPassword))
      errors.newPassword = "Must contain at least one number.";
    else if (!/[^A-Za-z0-9]/.test(form.newPassword))
      errors.newPassword = "Must contain at least one special character.";

    if (!form.confirmNewPassword)
      errors.confirmNewPassword = "Please confirm the new password.";
    else if (form.confirmNewPassword !== form.newPassword)
      errors.confirmNewPassword = "Passwords do not match.";
  }

  return errors;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const emptyAddForm: EmployeeForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const emptyEditForm: EditForm = {
  name: "",
  phone: "",
  email: "",
  newPassword: "",
  confirmNewPassword: "",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Add modal
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addServerError, setAddServerError] = useState("");
  const [addForm, setAddForm] = useState<EmployeeForm>(emptyAddForm);
  const [addErrors, setAddErrors] = useState<EmployeeFormErrors>({});
  const [addTouched, setAddTouched] = useState<Record<string, boolean>>({});

  // Edit modal
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [editErrors, setEditErrors] = useState<EditFormErrors>({});
  const [editTouched, setEditTouched] = useState<Record<string, boolean>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editServerError, setEditServerError] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Delete modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const sidebarItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Employees", path: "/admin/employees", icon: <Users size={20} /> },
    {
      label: "Question Metrics",
      path: "/admin/metrics",
      icon: <BarChart3 size={20} />,
    },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  // ── Fetch ──
  const fetchEmployees = useCallback(async () => {
    setFetchLoading(true);
    setFetchError("");
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/users?role=EMPLOYEE&limit=100",
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployees(data.users ?? []);
      setTotalEmployees(data.meta?.total ?? 0);
    } catch {
      setFetchError("Could not load employees. Please refresh the page.");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Toggle active ──
  const handleToggleActive = async (id: number) => {
    setTogglingId(id);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
      fetchEmployees();
    } catch {
      alert("Failed to update employee status.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Add handlers ──
  const handleAddChange = (field: keyof EmployeeForm, value: string) => {
    const updated = { ...addForm, [field]: value };
    setAddForm(updated);
    if (addTouched[field]) {
      const newErrors = validateAddForm(updated);
      setAddErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
    if (field === "password" && addTouched["confirmPassword"]) {
      setAddErrors((prev) => ({
        ...prev,
        confirmPassword: validateAddForm(updated).confirmPassword,
      }));
    }
  };

  const handleAddBlur = (field: keyof EmployeeForm) => {
    setAddTouched((prev) => ({ ...prev, [field]: true }));
    setAddErrors((prev) => ({
      ...prev,
      [field]: validateAddForm(addForm)[field],
    }));
  };

  const handleAddClose = () => {
    setShowAddForm(false);
    setAddForm(emptyAddForm);
    setAddErrors({});
    setAddTouched({});
    setAddServerError("");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddServerError("");
    setAddTouched({
      name: true,
      phone: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const newErrors = validateAddForm(addForm);
    setAddErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setAddLoading(true);
    try {
      const { confirmPassword, ...payload } = addForm;
      const res = await fetch("http://localhost:5000/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddServerError(data.message || "Failed to add employee.");
        return;
      }
      handleAddClose();
      fetchEmployees();
    } catch {
      setAddServerError("Unable to connect to server. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── Edit handlers ──
  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditForm({
      name: employee.name,
      phone: employee.phone ?? "",
      email: employee.email ?? "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setEditErrors({});
    setEditTouched({});
    setEditServerError("");
    setShowPasswordSection(false);
    setShowEditForm(true);
  };

  const handleEditChange = (field: keyof EditForm, value: string) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);
    if (editTouched[field]) {
      setEditErrors((prev) => ({
        ...prev,
        [field]: validateEditForm(updated)[field],
      }));
    }
    if (field === "newPassword" && editTouched["confirmNewPassword"]) {
      setEditErrors((prev) => ({
        ...prev,
        confirmNewPassword: validateEditForm(updated).confirmNewPassword,
      }));
    }
  };

  const handleEditBlur = (field: keyof EditForm) => {
    setEditTouched((prev) => ({ ...prev, [field]: true }));
    setEditErrors((prev) => ({
      ...prev,
      [field]: validateEditForm(editForm)[field],
    }));
  };

  const handleEditClose = () => {
    setShowEditForm(false);
    setEditingEmployee(null);
    setEditForm(emptyEditForm);
    setEditErrors({});
    setEditTouched({});
    setEditServerError("");
    setShowPasswordSection(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditServerError("");

    const touchFields: Record<string, boolean> = {
      name: true,
      phone: true,
      email: true,
    };
    if (showPasswordSection) {
      touchFields.newPassword = true;
      touchFields.confirmNewPassword = true;
    }
    setEditTouched(touchFields);
    const newErrors = validateEditForm(editForm);
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setEditLoading(true);
    try {
      // Build payload — only include password if section is open and filled
      const payload: any = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      };
      if (showPasswordSection && editForm.newPassword) {
        payload.password = editForm.newPassword;
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/employees/${editingEmployee!.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setEditServerError(data.message || "Failed to update employee.");
        return;
      }
      handleEditClose();
      fetchEmployees();
    } catch {
      setEditServerError("Unable to connect to server. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete handlers ──
  const openDeleteModal = (employee: Employee) => {
    setDeletingEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const handleDeleteClose = () => {
    setShowDeleteConfirm(false);
    setDeletingEmployee(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/employees/${deletingEmployee.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error();
      handleDeleteClose();
      fetchEmployees();
    } catch {
      alert("Failed to delete employee.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Table columns ──
  const columns = [
    { key: "name", header: "Name" },
    {
      key: "email",
      header: "Email",
      render: (_: any, row: Employee) => row.email ?? "—",
    },
    {
      key: "phone",
      header: "Phone",
      render: (_: any, row: Employee) => row.phone ?? "—",
    },
    {
      key: "created_at",
      header: "Joined",
      render: (value: string) =>
        new Date(value).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "is_active",
      header: "Status",
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
          ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`}
          />
          {value ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Employee) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => handleToggleActive(row.id)}
            disabled={togglingId === row.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${
                row.is_active
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              }`}
          >
            {togglingId === row.id ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : row.is_active ? (
              <>
                <UserX size={13} /> Block
              </>
            ) : (
              <>
                <UserCheck size={13} /> Unblock
              </>
            )}
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes Admin" />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Manage Employees</h1>
          <p className="text-gray-600">View and manage all employees</p>
        </div>
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)}>Add New Employee</Button>
        </div>
        <Card>
          <h2 className="text-xl mb-6 text-gray-900">
            All Employees {!fetchLoading && `(${totalEmployees})`}
          </h2>
          {fetchLoading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading employees...
            </div>
          )}
          {fetchError && !fetchLoading && (
            <div className="py-6 text-center text-red-500">
              {fetchError}
              <button
                onClick={fetchEmployees}
                className="ml-2 text-blue-600 underline text-sm"
              >
                Retry
              </button>
            </div>
          )}
          {!fetchLoading && !fetchError && employees.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              No employees found.
            </div>
          )}
          {!fetchLoading && !fetchError && employees.length > 0 && (
            <Table columns={columns} data={employees} />
          )}
        </Card>
      </main>

      {/* ── Add Employee Modal ── */}
      <Modal
        isOpen={showAddForm}
        onClose={handleAddClose}
        title="Add New Employee"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4" noValidate>
          {addServerError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {addServerError}
            </div>
          )}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter employee name"
              value={addForm.name}
              onChange={(e) => handleAddChange("name", e.target.value)}
              onBlur={() => handleAddBlur("name")}
              required
            />
            {addErrors.name && (
              <p className="mt-1 text-xs text-red-500">{addErrors.name}</p>
            )}
          </div>
          <div>
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter phone number"
              value={addForm.phone}
              onChange={(e) => handleAddChange("phone", e.target.value)}
              onBlur={() => handleAddBlur("phone")}
              required
            />
            {addErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{addErrors.phone}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter email address"
              value={addForm.email}
              onChange={(e) => handleAddChange("email", e.target.value)}
              onBlur={() => handleAddBlur("email")}
              required
            />
            {addErrors.email && (
              <p className="mt-1 text-xs text-red-500">{addErrors.email}</p>
            )}
          </div>
          <PasswordInput
            label="Password"
            placeholder="Set initial password"
            value={addForm.password}
            onChange={(e) => handleAddChange("password", e.target.value)}
            onBlur={() => handleAddBlur("password")}
            error={addErrors.password}
            showStrength
          />
          <div>
            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={addForm.confirmPassword}
              onChange={(e) =>
                handleAddChange("confirmPassword", e.target.value)
              }
              onBlur={() => handleAddBlur("confirmPassword")}
              error={addErrors.confirmPassword}
            />
            {!addErrors.confirmPassword &&
              addForm.confirmPassword &&
              addForm.confirmPassword === addForm.password && (
                <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
              )}
          </div>
          <ul className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
            <li
              className={addForm.password.length >= 8 ? "text-green-600" : ""}
            >
              {addForm.password.length >= 8 ? "✓" : "○"} At least 8 characters
            </li>
            <li
              className={/[A-Z]/.test(addForm.password) ? "text-green-600" : ""}
            >
              {/[A-Z]/.test(addForm.password) ? "✓" : "○"} One uppercase letter
            </li>
            <li
              className={/[0-9]/.test(addForm.password) ? "text-green-600" : ""}
            >
              {/[0-9]/.test(addForm.password) ? "✓" : "○"} One number
            </li>
            <li
              className={
                /[^A-Za-z0-9]/.test(addForm.password) ? "text-green-600" : ""
              }
            >
              {/[^A-Za-z0-9]/.test(addForm.password) ? "✓" : "○"} One special
              character
            </li>
          </ul>
          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={addLoading}>
              {addLoading ? "Adding..." : "Add Employee"}
            </Button>
            <Button type="button" variant="outline" onClick={handleAddClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Employee Modal ── */}
      <Modal
        isOpen={showEditForm}
        onClose={handleEditClose}
        title="Edit Employee"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4" noValidate>
          {editServerError && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {editServerError}
            </div>
          )}

          {/* Basic info */}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter employee name"
              value={editForm.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              onBlur={() => handleEditBlur("name")}
              required
            />
            {editErrors.name && (
              <p className="mt-1 text-xs text-red-500">{editErrors.name}</p>
            )}
          </div>
          <div>
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter phone number"
              value={editForm.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
              onBlur={() => handleEditBlur("phone")}
              required
            />
            {editErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{editErrors.phone}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter email address"
              value={editForm.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
              onBlur={() => handleEditBlur("email")}
              required
            />
            {editErrors.email && (
              <p className="mt-1 text-xs text-red-500">{editErrors.email}</p>
            )}
          </div>

          {/* Password section — collapsible */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setShowPasswordSection((p) => !p);
                // Clear password fields when collapsing
                if (showPasswordSection) {
                  setEditForm((prev) => ({
                    ...prev,
                    newPassword: "",
                    confirmNewPassword: "",
                  }));
                  setEditErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                    confirmNewPassword: undefined,
                  }));
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50
                hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2">
                <KeyRound size={15} className="text-gray-500" />
                Change Password
                <span className="text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </span>
              <span
                className={`transition-transform duration-200 text-gray-400 ${showPasswordSection ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {showPasswordSection && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={editForm.newPassword}
                  onChange={(e) =>
                    handleEditChange("newPassword", e.target.value)
                  }
                  onBlur={() => handleEditBlur("newPassword")}
                  error={editErrors.newPassword}
                  showStrength
                />
                <div>
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Re-enter new password"
                    value={editForm.confirmNewPassword}
                    onChange={(e) =>
                      handleEditChange("confirmNewPassword", e.target.value)
                    }
                    onBlur={() => handleEditBlur("confirmNewPassword")}
                    error={editErrors.confirmNewPassword}
                  />
                  {!editErrors.confirmNewPassword &&
                    editForm.confirmNewPassword &&
                    editForm.confirmNewPassword === editForm.newPassword && (
                      <p className="mt-1 text-xs text-green-600">
                        ✓ Passwords match
                      </p>
                    )}
                </div>
                <ul className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
                  <li
                    className={
                      editForm.newPassword.length >= 8 ? "text-green-600" : ""
                    }
                  >
                    {editForm.newPassword.length >= 8 ? "✓" : "○"} At least 8
                    characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(editForm.newPassword) ? "text-green-600" : ""
                    }
                  >
                    {/[A-Z]/.test(editForm.newPassword) ? "✓" : "○"} One
                    uppercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(editForm.newPassword) ? "text-green-600" : ""
                    }
                  >
                    {/[0-9]/.test(editForm.newPassword) ? "✓" : "○"} One number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(editForm.newPassword)
                        ? "text-green-600"
                        : ""
                    }
                  >
                    {/[^A-Za-z0-9]/.test(editForm.newPassword) ? "✓" : "○"} One
                    special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleEditClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteClose}
        title="Delete Employee"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Trash2 size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to delete{" "}
                <span className="font-bold">{deletingEmployee?.name}</span>?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} /> Delete Employee
                </>
              )}
            </button>
            <Button type="button" variant="outline" onClick={handleDeleteClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
